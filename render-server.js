const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzBmmyHxq_8j0k_c5T0pX_ST0jTjqH2CqeFmE7ZWEAIcnHSSQqd7dgNbssDqa/exec",
  CHAI_EMET_TOKEN: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVE",
  PORT: process.env.PORT || 8000
};
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ status: "🟢 LIVE" });
});
app.all("/exec", async (req, res) => {
  try {
    let message = req.query.msg || req.body.message || "";
    if (!message) return res.status(400).json({ reply: "No message" });
    const gasResponse = await axios.post(CONFIG.GAS_URL, { action: "chat", token: CONFIG.CHAI_EMET_TOKEN, message }, { timeout: 10000 });
    res.json({ reply: gasResponse.data.reply || "Ok" });
  } catch (error) {
    res.status(500).json({ reply: "Error" });
  }
});
app.listen(CONFIG.PORT, () => console.log(`Ready on ${CONFIG.PORT}`));
