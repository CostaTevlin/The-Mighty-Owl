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
}

interface AnalyzeResponse {
  model: string;
  confidence: 'high' | 'medium' | 'low';
  steps: string[];
  safetyTips: string[];
  estimatedTime: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: AnalyzeRequest = await req.json();
    const { image, task, context, userId } = body;

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

    const systemPrompt = `You are ApplianceAI, a friendly home appliance expert. When shown a photo of an appliance, you identify the exact make and model, then provide clear, safe, step-by-step instructions for the user's specific task.

Always respond in valid JSON format with this structure:
{
  "model": "string (exact make/model if identifiable)",
  "confidence": "high|medium|low",
  "steps": ["string", "string", ...],
  "safetyTips": ["string", "string", ...],
  "estimatedTime": "string (e.g., '5-10 minutes')"
}

Rules:
- Be concise and clear
- Use simple, non-technical language
- Number your steps implicitly (they will be numbered in the UI)
- Include 3-8 safety tips appropriate to the task
- If you cannot identify the model with high confidence, set confidence to 'medium' or 'low' but still provide generic, accurate instructions
- Estimated time should be realistic for the task
- All responses must be valid JSON`;

    const userPrompt = `I'm using a ${task} appliance and need help with the following task.

Context: ${contextString}

Based on the photo of this appliance, please:
1. Identify the exact make and model if possible
2. Provide step-by-step instructions for the task
3. Include relevant safety tips
4. Estimate how long this task will take

Respond in JSON format only.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('scans').insert({
        task,
        context,
        appliance_model: analysisResult.model,
        confidence: analysisResult.confidence,
        instructions: analysisResult.steps,
        safety_tips: analysisResult.safetyTips,
        estimated_time: analysisResult.estimatedTime,
        user_id: userId || null,
      });
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
