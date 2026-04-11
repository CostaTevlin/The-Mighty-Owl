import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  image: string;
  task: string;
  context: Record<string, any>;
  userId?: string;
  correction?: string;
}

interface AnalyzeResponse {
  model: string;
  confidence: 'high' | 'medium' | 'low';
  quickAnswer: string;
  steps: string[];
  commonMistakes: string[];
  safetyTips: string[];
  estimatedTime: string;
  needsBetterPhoto: boolean;
  reason: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: AnalyzeRequest = await req.json();
    const { image, task, context, userId, correction } = body;

    if (!image || !task) {
      return new Response(
        JSON.stringify({ error: 'Missing image or task' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    let contextString = '';
    switch (task) {
      case 'washing':
        contextString = `Load size: ${context.loadSize || 'medium'}, Colors: ${context.washColor || 'colored'}`;
        break;
      case 'cooking':
        contextString = `Cooking item: ${context.cookingItem || 'unknown'}`;
        break;
      case 'coffee':
        contextString = `Drink type: ${context.coffeeType || 'latte'}`;
        break;
      case 'dishwashing':
        contextString = `Load level: ${context.loadLevel || 'full'}, Soil level: ${context.soilLevel || 'normal'}`;
        break;
      case 'drying':
        contextString = `Fabric type: ${context.fabricType || 'synthetic'}, Heat: ${context.heatLevel || 'medium'}`;
        break;
      case 'other':
        contextString = `Description: ${context.description || 'unknown appliance'}`;
        break;
    }

    const systemPrompt = `You are a sharp, friendly expert who knows home appliances inside out. You're standing next to the user — help them like a knowledgeable friend, not a manual.

Your voice: casual, confident, slightly cheeky. Use "you" directly. Recommend THE best option — don't list all possibilities.

Before producing any output, work through these steps in your head:

Step 1 — Look for text: Scan for any visible brand name, model number, or serial label. These are usually on the front panel, door edge, or top surface.
Step 2 — Identify the appliance type: Determine the specific category (e.g. washing machine, air fryer, espresso machine, built-in oven). Be specific — don't say "kitchen appliance".
Step 3 — Identify the specific model: If a brand or model number is visible, state it exactly. If not, say "brand not visible" — do not guess the brand.
Step 4 — Assess your confidence:
  - "high": brand AND appliance type are both clearly visible
  - "medium": appliance type is clear but brand is not visible
  - "low": image is unclear, partially captured, too dark, or appliance is unidentifiable

Step 5 — Produce output:
  If confidence is "high" or "medium": give full instructions for the task.
  If confidence is "low": set steps/commonMistakes/safetyTips to empty arrays, set needsBetterPhoto to true, and put a clear specific explanation in "reason" (e.g. "The brand label is not visible in this photo", "The image is too dark on the left side"). Do not invent instructions for low-confidence images.

Respond in JSON only:
{"model":"string — appliance type and brand/model if known, or 'brand not visible' if not","confidence":"high|medium|low","needsBetterPhoto":false,"reason":"one sentence — if low: exactly what is making identification difficult; if medium: note the limitation e.g. 'Brand not identified — instructions are for [appliance type] in general'; if high: brief justification","quickAnswer":"The single safest default setting — one sentence, tell them exactly what to select/press/turn (empty string if needsBetterPhoto)","steps":["Conversational step. Include WHY when not obvious. Reference this appliance's actual button/dial names."],"commonMistakes":["Things people get wrong on THIS appliance — be specific, not generic"],"safetyTips":["Only non-obvious tips specific to this appliance/task — skip 'read the manual'"],"estimatedTime":"string (empty string if needsBetterPhoto)"}

Rules for full results: 4-7 steps, 2-4 common mistakes, 2-3 safety tips, realistic time.`;

    let userPrompt = `Task: ${task}\nContext: ${contextString}`;
    if (correction) {
      userPrompt = `The user has told you this appliance is: "${correction}". Use this information to re-examine the image and provide instructions specifically for this appliance. If what you see doesn't match, briefly note the inconsistency before giving instructions. Bias your confidence toward "high" or "medium" since the user is asserting ground truth.\n\nTask: ${task}\nContext: ${contextString}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: userPrompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Claude API error:', errorBody);
      throw new Error(`Claude API failed: ${errorBody}`);
    }

    const claudeResponse = await response.json();
    const content = claudeResponse.content[0].text;

    let analysisResult: AnalyzeResponse;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content);
      throw new Error('Failed to parse AI response');
    }

    // Fire-and-forget — don't block the response on the DB write
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      supabase.from('scans').insert({
        task,
        context,
        appliance_model: analysisResult.model,
        confidence: analysisResult.confidence,
        instructions: analysisResult.steps,
        safety_tips: analysisResult.safetyTips,
        estimated_time: analysisResult.estimatedTime,
        user_id: userId || null,
      }).then().catch((err) => console.error('DB insert failed:', err));
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
