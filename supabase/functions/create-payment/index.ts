import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { totalPrice, article, numeroSend, nomclient, orderId, unlockedBooks } = await req.json();

    if (!totalPrice || !numeroSend || !nomclient || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: totalPrice, numeroSend, nomclient, orderId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client inside the handler
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const booksToUnlock = unlockedBooks || ["2"]; // Default to Book 2

    // 1. Insert/upsert order record into database with 'pending' status
    const { error: insertError } = await supabase
      .from("premium_unlocks")
      .upsert(
        {
          order_id: orderId,
          phone: numeroSend,
          child_name: nomclient,
          status: "pending",
          unlocked_books: JSON.stringify(booksToUnlock),
          created_at: new Date().toISOString()
        },
        { onConflict: "order_id" }
      );

    if (insertError) {
      console.error("Database upsert error:", insertError.message);
    }

    // 2. Fetch Money Fusion API URL from environment secrets
    const moneyFusionUrl = Deno.env.get("MONEYFUSION_API_URL") || Deno.env.get("FUSIONPAY_API_URL");
    
    if (!moneyFusionUrl) {
      // Simulate payment redirection for local test/preview in case of missing API key
      console.warn("MONEYFUSION_API_URL is missing. Simulating checkout url.");
      const redirectUrl = `https://lescopainsdelaforet.pages.dev/?payment=success&order=${orderId}&simulated=true`;
      const simulatedToken = `sim_token_${Math.random().toString(36).substring(2, 11)}`;

      await supabase
        .from("premium_unlocks")
        .update({ token_pay: simulatedToken })
        .eq("order_id", orderId);

      return new Response(
        JSON.stringify({
          statut: true,
          token: simulatedToken,
          message: "paiement en cours (simulé)",
          url: redirectUrl,
          simulated: true
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Build Money Fusion Payload
    const paymentData = {
      totalPrice: Number(totalPrice),
      article: article || [{ "Pack Premium - Copains de la Forêt": Number(totalPrice) }],
      personal_Info: [{ userId: 1, orderId }],
      numeroSend: String(numeroSend),
      nomclient: String(nomclient),
      return_url: `https://lescopainsdelaforet.pages.dev/?payment=success&order=${orderId}`,
      webhook_url: `${supabaseUrl}/functions/v1/moneyfusion-webhook`
    };

    console.log("Sending payload to Money Fusion:", JSON.stringify(paymentData));

    // 4. Send request to Money Fusion
    const response = await fetch(moneyFusionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Money Fusion API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Response from Money Fusion:", JSON.stringify(data));

    // Format fields correctly
    const isSuccess = data.statut === true || data.status === "success" || data.success === true;
    const token = data.token || data.tokenPay || "";
    const checkoutUrl = data.url || "";

    if (isSuccess && token) {
      // Update our database entry with tokenPay
      await supabase
        .from("premium_unlocks")
        .update({ token_pay: token })
        .eq("order_id", orderId);
    }

    return new Response(
      JSON.stringify({
        statut: isSuccess,
        token: token,
        message: data.message || "paiement en cours",
        url: checkoutUrl
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Error in create-payment function:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
