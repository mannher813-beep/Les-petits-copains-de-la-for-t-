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
 * Creates/Unlocks a premium session directly via Supabase
 */
app.post("/api/payment/create", async (req, res) => {
  const { 
    phone, 
    childName, 
    orderId, 
    totalPrice, 
    numeroSend, 
    nomclient, 
    unlockedBooks 
  } = req.body;

  const finalPhone = phone || numeroSend;
  const finalChildName = childName || nomclient;
  const finalOrderId = orderId || `order_${Date.now()}`;
  const booksToUnlock = unlockedBooks || ["2", "3", "4", "5", "6"];

  if (!finalPhone || !finalChildName || !finalOrderId) {
    return res.status(400).json({ error: "Missing required fields: phone, childName, orderId" });
  }

  try {
    // Save to memoryDb
    memoryDb.set(finalOrderId, {
      order_id: finalOrderId,
      phone: finalPhone,
      child_name: finalChildName,
      status: "paid",
      created_at: new Date().toISOString()
    });

    // Upsert entry into Supabase premium_unlocks table with paid status
    const { error: insertError } = await supabase
      .from("premium_unlocks")
      .upsert(
        {
          order_id: finalOrderId,
          phone: finalPhone,
          child_name: finalChildName,
          status: "paid",
          unlocked_books: JSON.stringify(booksToUnlock),
          created_at: new Date().toISOString()
        },
        { onConflict: "order_id" }
      );

    if (insertError) {
      console.warn("Supabase insert notice (continuing with In-Memory unlock):", insertError.message || insertError);
    }

    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const redirectUrl = `${appUrl}/?payment=success&order=${finalOrderId}`;

    return res.json({
      url: redirectUrl,
      orderId: finalOrderId,
      status: "paid",
      statut: true,
      message: "Pack Premium activé avec succès !"
    });

  } catch (err: any) {
    console.error("Error creating premium unlock:", err);
    return res.status(500).json({
      error: "Could not activate premium status",
      details: err.message
    });
  }
});

/**
 * 2. POST /api/payment/webhook
 * Generic Webhook endpoint for order updates
 */
app.post("/api/payment/webhook", async (req, res) => {
  const payload = req.body;
  console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

  const orderId = payload.orderId || payload.order_id || payload.tokenPay;
  const status = payload.status === "failed" ? "failed" : "paid";

  if (!orderId) {
    return res.status(400).send("Missing order identifier");
  }

  const record = memoryDb.get(orderId);
  if (record) {
    record.status = status;
  }

  try {
    await supabase
      .from("premium_unlocks")
      .update({ status })
      .eq("order_id", orderId);

    return res.sendStatus(200);
  } catch (err: any) {
    console.error("Error handling webhook:", err);
    return res.status(500).send("Webhook handler internal error");
  }
});

/**
 * 3. GET /api/payment/status/:orderId
 * Fetches current payment status from Memory DB or Supabase.
 */
app.get("/api/payment/status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // 1. Check Memory DB first
    const memRecord = memoryDb.get(orderId);
    if (memRecord) {
      return res.json({ status: memRecord.status });
    }

    // 2. Query Supabase DB
    const { data, error } = await supabase
      .from("premium_unlocks")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (!error && data) {
      return res.json({ status: data.status || "paid" });
    }

    // Fallback for missing/test orders
    return res.json({ status: "paid" });

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
