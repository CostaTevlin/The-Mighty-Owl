import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LogPurchaseRequest {
  deviceId: string;
  product: string;
  creditsGranted: number;
  priceShown: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: LogPurchaseRequest = await req.json();
    const { deviceId, product, creditsGranted, priceShown } = body;

    if (!deviceId || !product) {
      return new Response(
        JSON.stringify({ error: 'Missing deviceId or product' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('purchase_intents').insert({
      device_id: deviceId,
      product,
      credits_granted: creditsGranted,
      price_shown: priceShown,
    });

    if (error) {
      console.error('DB insert failed:', error);
      throw new Error(`Failed to log purchase intent: ${error.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in log-purchase function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
