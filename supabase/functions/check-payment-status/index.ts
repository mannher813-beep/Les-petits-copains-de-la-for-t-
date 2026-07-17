import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const tokenPay = url.searchParams.get("token");

    if (!tokenPay) {
      return new Response(JSON.stringify({ error: "Missing token parameter in query string" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Money Fusion Verification API
    const verifyUrl = `https://www.pay.moneyfusion.net/paiementNotif/${tokenPay}`;
    console.log(`Querying Money Fusion status verify URL: ${verifyUrl}`);

    const verifyResponse = await fetch(verifyUrl);
    
    if (!verifyResponse.ok) {
      throw new Error(`Money Fusion status check returned ${verifyResponse.status}`);
    }

    const verifyData = await verifyResponse.json();
    console.log("Money Fusion Verification payload returned:", JSON.stringify(verifyData));

    // Map verification status
    // Money Fusion API returns status like "success", "paid" or "completed"
    let isPaid = false;
    if (verifyData) {
      if (verifyData.data) {
        isPaid = verifyData.data.statut === "paid" || verifyData.data.status === "paid" || verifyData.data.status === "success" || verifyData.data.status === "completed";
      } else {
        isPaid = 
          verifyData.status === "success" ||
          verifyData.status === "completed" ||
          verifyData.status === "paid" ||
          verifyData.success === true ||
          verifyData.success === "true" ||
          JSON.stringify(verifyData).toLowerCase().includes("success") ||
          JSON.stringify(verifyData).toLowerCase().includes("completed") ||
          JSON.stringify(verifyData).toLowerCase().includes("paid");
      }
    }

    const statusValue = isPaid ? "paid" : "pending";

    if (isPaid) {
      // Initialize Supabase Client and update database
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase
        .from("premium_unlocks")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("token_pay", tokenPay);
        
      console.log(`Updated database status to paid for token: ${tokenPay}`);
    }

    return new Response(JSON.stringify({ status: statusValue, data: verifyData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Error in check-payment-status function:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
