import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Received Money Fusion Webhook payload:", JSON.stringify(payload, null, 2));

    const event = payload.event;
    const tokenPay = payload.tokenPay || payload.token || payload.token_pay;
    const personalInfo = payload.personal_Info || payload.personal_info || [];
    const info = personalInfo[0] || {};
    const orderId = info.orderId;

    if (!tokenPay) {
      return new Response(JSON.stringify({ error: "Missing tokenPay" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the existing record in database to verify status and avoid redundant updates
    let query = supabase.from("premium_unlocks").select("*");
    if (orderId) {
      query = query.eq("order_id", orderId);
    } else {
      query = query.eq("token_pay", tokenPay);
    }
    
    const { data: record, error: selectError } = await query.maybeSingle();

    if (selectError) {
      console.error("Database query error:", selectError.message);
    }

    const currentStatus = record ? record.status : null;
    const incomingStatus = event === "payin.session.completed" ? "paid" : 
                           (event === "payin.session.cancelled" ? "failed" : "pending");

    // Ignore events that have already been processed (no change in status)
    if (currentStatus === incomingStatus) {
      console.log(`Status already matches incoming '${incomingStatus}'. No-op.`);
      return new Response(JSON.stringify({ message: "No change, event already processed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update database
    const updatePayload: any = {
      status: incomingStatus,
      updated_at: new Date().toISOString()
    };
    if (tokenPay) {
      updatePayload.token_pay = tokenPay;
    }

    let updateQuery = supabase.from("premium_unlocks").update(updatePayload);
    if (orderId) {
      updateQuery = updateQuery.eq("order_id", orderId);
    } else {
      updateQuery = updateQuery.eq("token_pay", tokenPay);
    }

    const { error: updateError } = await updateQuery;

    if (updateError) {
      console.error("Failed to update database status:", updateError.message);
      throw new Error(`DB update error: ${updateError.message}`);
    }

    console.log(`Successfully updated order status to ${incomingStatus}`);

    return new Response(JSON.stringify({ success: true, status: incomingStatus }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Webhook processing error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
