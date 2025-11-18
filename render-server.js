const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzBmmyHxq_8j0k_c5T0pX_ST0jTjqH2CqeFmE7ZWEAIcnHSSQqd7dgNbssDqa/exec",
  CHAI_EMET_TOKEN: "chai_emet_cXVhbnR1bV9tYXN0ZXI6Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
  TIMEOUT: 10000,
  PORT: process.env.PORT || 8000
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function debugLog(...args) {
  console.log("[חי-אמת]", ...args);
}

app.get("/", (req, res) => {
  res.json({
    service: "HaiEmetCoreAI",
    version: "1.0.0",
    status: "🟢 LIVE",
    owner: "TNTF | נתניאל ניסים",
    backend: "Google Apps Script",
    endpoints: {
      "GET /": "Service info",
      "POST /exec": "Chat with Hai-Emet",
      "GET /health": "Health check"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.all("/exec", async (req, res) => {
  try {
    let message = req.query.msg || req.body.message || "";
    message = message.trim();

    debugLog(`📨 Message: "${message}"`);

    if (!message) {
      return res.status(400).json({
        status: "error",
        reply: "❌ לא קיבלתי הודעה"
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        status: "error",
        reply: "❌ ההודעה ארוכה מדי"
      });
    }

    debugLog(`🚀 Calling GAS...`);

    const gasPayload = {
      action: "chat",
      token: CONFIG.CHAI_EMET_TOKEN,
      message: message
    };

    const gasResponse = await axios.post(CONFIG.GAS_URL, gasPayload, {
      headers: { "Content-Type": "application/json" },
      timeout: CONFIG.TIMEOUT
    });

    debugLog(`📥 GAS Response:`, gasResponse.data);

    const reply = gasResponse.data.reply || gasResponse.data.message || "🤔 לא הבנתי";

    res.json({
      status: "success",
      reply: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[❌ Error]", error.message);
    res.status(500).json({
      status: "error",
      reply: "❌ שגיאה בחיבור לשרת"
    });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`🔥 Hai-Emet Server on port ${CONFIG.PORT}`);
  console.log(`✅ Ready to serve! 💛`);
});
