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
app.get("/", (req, res) => {
  res.json({ service: "HaiEmetCoreAI", status: "🟢 LIVE", owner: "TNTF" });
});
app.all("/exec", async (req, res) => {
  try {
    let message = req.query.msg || req.body.message || "";
    message = message.trim();
    if (!message) return res.status(400).json({ status: "error", reply: "❌ לא קיבלתי הודעה" });
    const gasPayload = { action: "chat", token: CONFIG.CHAI_EMET_TOKEN, message };
    const gasResponse = await axios.post(CONFIG.GAS_URL, gasPayload, {
      headers: { "Content-Type": "application/json" },
      timeout: CONFIG.TIMEOUT
    });
    const reply = gasResponse.data.reply || "🤔 לא הבנתי";
    res.json({ status: "success", reply });
  } catch (error) {
    res.status(500).json({ status: "error", reply: "❌ שגיאה בחיבור לשרת" });
  }
});
app.listen(CONFIG.PORT, () => console.log(`✅ Ready! 💛`));
