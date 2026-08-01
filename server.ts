import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Simple In-Memory Fallback DB in case Supabase is not fully set up or errors
interface PremiumUnlockRecord {
  order_id: string;
  token_pay?: string;
  phone: string;
  child_name: string;
  status: string;
  created_at: string;
}

const memoryDb = new Map<string, PremiumUnlockRecord>(); // Key: order_id
const tokenToOrderId = new Map<string, string>(); // Key: token_pay -> order_id

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", supabaseConfigured: !!supabaseUrl });
});

// Helper: Try to create premium_unlocks table or check if we can query it
const checkSupabaseTable = async () => {
  try {
    if (!supabaseUrl) return;
    // Test query
    const { error } = await supabase.from("premium_unlocks").select("id").limit(1);
    if (error) {
      console.warn("Notice: 'premium_unlocks' table might not exist or lacks permissions yet:", error.message);
    } else {
      console.log("Successfully connected to Supabase 'premium_unlocks' table.");
    }
  } catch (err: any) {
    console.warn("Notice during Supabase table validation:", err.message);
  }
};

/**
 * 1. POST /api/payment/create
 * Initiates the Money Fusion payment session
 */
app.post("/api/payment/create", async (req, res) => {
  const { 
    phone, 
    childName, 
    orderId, 
    totalPrice, 
    article, 
    numeroSend, 
    nomclient, 
    unlockedBooks 
  } = req.body;

  const finalPhone = phone || numeroSend;
  const finalChildName = childName || nomclient;
  const finalOrderId = orderId;
  const finalPrice = totalPrice || 1000;
  const finalArticle = article || [{ "Tome 2 : La cabane dans les arbres": finalPrice }];
  const booksToUnlock = unlockedBooks || ["2"];

  if (!finalPhone || !finalChildName || !finalOrderId) {
    return res.status(400).json({ error: "Missing required fields: phone/numeroSend, childName/nomclient, orderId" });
  }

  try {
    // Save to memoryDb first for robust fallback
    memoryDb.set(finalOrderId, {
      order_id: finalOrderId,
      phone: finalPhone,
      child_name: finalChildName,
      status: "pending",
      created_at: new Date().toISOString()
    });

    // Insert/upsert pending entry into Supabase premium_unlocks table
    const { error: insertError } = await supabase
      .from("premium_unlocks")
      .upsert(
        {
          order_id: finalOrderId,
          phone: finalPhone,
          child_name: finalChildName,
          status: "pending",
          unlocked_books: JSON.stringify(booksToUnlock),
          created_at: new Date().toISOString()
        },
        { onConflict: "order_id" }
      );

    if (insertError) {
      console.error("Supabase insert error (continuing with In-Memory fallback):", insertError.message || insertError);
    }

    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const fusionPayUrl = process.env.FUSIONPAY_API_URL || process.env.MONEYFUSION_API_URL;

    // Build standard Money Fusion payment payload
    const paymentData = {
      totalPrice: finalPrice, // Price in FCFA
      article: finalArticle,
      personal_Info: [{ userId: 1, orderId: finalOrderId }],
      numeroSend: finalPhone,
      nomclient: finalChildName,
      return_url: `${appUrl}/?payment=success&order=${finalOrderId}`,
      webhook_url: `${appUrl}/api/payment/webhook`
    };

    // If FUSIONPAY_API_URL is not set, simulate the payment redirection for a seamless preview
    if (!fusionPayUrl) {
      console.warn("FUSIONPAY_API_URL or MONEYFUSION_API_URL is not set. Simulating Money Fusion checkout.");
      const simulatedUrl = `${appUrl}/?payment=success&order=${finalOrderId}&simulated=true`;
      
      // Update with a simulated token
      const simulatedToken = `sim_token_${Math.random().toString(36).substring(2, 11)}`;
      
      const record = memoryDb.get(finalOrderId);
      if (record) {
        record.token_pay = simulatedToken;
        tokenToOrderId.set(simulatedToken, finalOrderId);
      }

      await supabase
        .from("premium_unlocks")
        .update({ token_pay: simulatedToken })
        .eq("order_id", finalOrderId);

      return res.json({
        url: simulatedUrl,
        token: simulatedToken,
        simulated: true,
        statut: true,
        message: "paiement en cours (simulé)"
      });
    }

    // Call Money Fusion API (Server-to-Server)
    console.log("Calling Money Fusion API...", paymentData);
    
    // Dynamically import node-fetch or use standard fetch if available
    const apiResponse = await fetch(fusionPayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Money Fusion API rejected request: ${apiResponse.status} - ${errorText}`);
    }

    const data = (await apiResponse.json()) as any;
    console.log("Money Fusion API response:", data);

    const redirectUrl = data.url;
    const tokenPay = data.token || data.tokenPay || data.token_pay || data.session_token || "";

    if (!redirectUrl) {
      throw new Error("Money Fusion API response is missing redirect URL ('url' field).");
    }

    // Sync memoryDb with real tokenPay
    if (tokenPay) {
      const record = memoryDb.get(finalOrderId);
      if (record) {
        record.token_pay = tokenPay;
        tokenToOrderId.set(tokenPay, finalOrderId);
      }

      const { error: updateError } = await supabase
        .from("premium_unlocks")
        .update({ token_pay: tokenPay })
        .eq("order_id", finalOrderId);

      if (updateError) {
        console.error("Supabase update tokenPay error:", updateError.message || updateError);
      }
    }

    return res.json({
      url: redirectUrl,
      token: tokenPay,
      statut: data.statut ?? true,
      message: data.message || "paiement en cours"
    });

  } catch (err: any) {
    console.error("Error creating payment session:", err);
    return res.status(500).json({
      error: "Could not create payment session",
      details: err.message
    });
  }
});

/**
 * 2. POST /api/payment/webhook
 * Receives webhook updates from Money Fusion
 */
app.post("/api/payment/webhook", async (req, res) => {
  const payload = req.body;
  console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

  // Determine tokenPay and event status from payload
  const tokenPay = payload.tokenPay || payload.token || payload.token_pay || payload.session_token;
  const event = payload.event || payload.status || payload.type;

  if (!tokenPay) {
    console.error("Webhook rejected: missing token identifier.");
    return res.status(400).send("Missing token parameter");
  }

  // Update In-Memory fallback database
  let targetOrderId = tokenToOrderId.get(tokenPay);
  if (!targetOrderId) {
    for (const [oId, rec] of memoryDb.entries()) {
      if (rec.token_pay === tokenPay) {
        targetOrderId = oId;
        tokenToOrderId.set(tokenPay, oId);
        break;
      }
    }
  }

  const incomingStatus = event === "payin.session.completed" ? "paid" : 
                         (event === "payin.session.cancelled" ? "failed" : "pending");

  if (targetOrderId) {
    const record = memoryDb.get(targetOrderId);
    if (record) {
      record.status = incomingStatus;
      console.log(`[MemoryDB] Webhook updated order ${targetOrderId} status to: ${incomingStatus}`);
    }
  }

  try {
    // Look up existing status in database to avoid redundant updates
    const { data: existing, error: selectError } = await supabase
      .from("premium_unlocks")
      .select("status")
      .eq("token_pay", tokenPay)
      .single();

    if (selectError) {
      console.warn("Could not retrieve existing payment record for webhook from Supabase:", selectError.message);
    }

    const currentStatus = existing ? existing.status : null;
    if (currentStatus === incomingStatus) {
      console.log(`Webhook redundant: record already has status '${incomingStatus}'`);
      return res.sendStatus(200);
    }

    // Update status in the database
    const { error: updateError } = await supabase
      .from("premium_unlocks")
      .update({ status: incomingStatus })
      .eq("token_pay", tokenPay);

    if (updateError) {
      console.error("Webhook database update failed on Supabase:", updateError.message || updateError);
    } else {
      console.log(`Successfully updated Supabase order status for token ${tokenPay} to: ${incomingStatus}`);
    }

    return res.sendStatus(200);

  } catch (err: any) {
    console.error("Error handling webhook:", err);
    return res.status(500).send("Webhook handler internal error");
  }
});

/**
 * 3. GET /api/payment/status/:orderId
 * Fetches current payment status. First checks In-Memory, then Supabase.
 * If status is not paid, queries Money Fusion status verification as a safety net.
 */
app.get("/api/payment/status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // 1. Check Memory DB first
    const memRecord = memoryDb.get(orderId);
    if (memRecord && memRecord.status === "paid") {
      return res.json({ status: "paid" });
    }

    // 2. Query Supabase DB
    let record: any = null;
    const { data, error } = await supabase
      .from("premium_unlocks")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (!error && data) {
      record = data;
    }

    const activeRecord = record || memRecord;

    if (!activeRecord) {
      // If order not found, check if it's a simulated order
      if (orderId.includes("simulated") || orderId.startsWith("sim-")) {
        return res.json({ status: "paid", simulated: true });
      }
      return res.status(404).json({ error: "Order not found" });
    }

    if (activeRecord.status === "paid") {
      if (memRecord) memRecord.status = "paid";
      return res.json({ status: "paid" });
    }

    const tokenPay = activeRecord.token_pay;

    // Filet de sécurité: If pending, query Money Fusion status verification directly
    if (tokenPay && !tokenPay.startsWith("sim_")) {
      try {
        const verifyUrl = `https://www.pay.moneyfusion.net/paiementNotif/${tokenPay}`;
        console.log(`Querying Money Fusion status verify URL: ${verifyUrl}`);

        const verifyResponse = await fetch(verifyUrl);
        if (verifyResponse.ok) {
          const verifyData = (await verifyResponse.json()) as any;
          console.log("Money Fusion verification payload returned:", verifyData);

          // Check common success indicators
          const isPaid = verifyData && (
            verifyData.status === "success" ||
            verifyData.status === "completed" ||
            verifyData.status === "paid" ||
            verifyData.success === true ||
            verifyData.success === "true" ||
            JSON.stringify(verifyData).toLowerCase().includes("success") ||
            JSON.stringify(verifyData).toLowerCase().includes("completed") ||
            JSON.stringify(verifyData).toLowerCase().includes("paid")
          );

          if (isPaid) {
            // Update local memoryDb
            if (memRecord) memRecord.status = "paid";

            // Update Supabase database
            await supabase
              .from("premium_unlocks")
              .update({ status: "paid" })
              .eq("order_id", orderId);

            console.log(`Verified payment successfully on Money Fusion for order ${orderId}. Status updated to paid.`);
            return res.json({ status: "paid" });
          }
        }
      } catch (verifyErr: any) {
        console.error("Safety net Money Fusion query failed:", verifyErr.message);
      }
    } else if (tokenPay && tokenPay.startsWith("sim_")) {
      // Simulated checkout automatically completes for easy testing
      if (memRecord) memRecord.status = "paid";

      await supabase
        .from("premium_unlocks")
        .update({ status: "paid" })
        .eq("order_id", orderId);
      return res.json({ status: "paid", simulated: true });
    }

    return res.json({ status: activeRecord.status });

  } catch (err: any) {
    console.error("Error fetching payment status:", err);
    return res.status(500).json({ error: "Internal server error querying status" });
  }
});

// Configure Vite and static folders
async function startServer() {
  await checkSupabaseTable();

  if (process.env.NODE_ENV !== "production") {
    console.log("Running in development mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
