const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzGMYDUnby2wpQUzRgsY7B1DvwyH4KdnLV_B509t2sOTZ0g7sVuDQQkXz1u0yGUyXuR/exec",
  CHAI_EMET_TOKEN: process.env.CHAI_EMET_TOKEN || "default_token",
  PORT: process.env.PORT || 8000
};

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.all("/exec", async (req, res) => {
  res.setTimeout(30000);
  
  try {
    let message = req.query.msg || req.body.message || "";
    
    if (!message) {
      return res.status(400).json({ reply: "No message" });
    }
    
    console.log("📨 Message:", message);
    console.log("🔐 Token:", CONFIG.CHAI_EMET_TOKEN ? "exists" : "missing");
    
    const gasResponse = await axios.post(CONFIG.GAS_URL, {
      message: message,
      token: CONFIG.CHAI_EMET_TOKEN
    }, { 
      timeout: 25000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log("📥 GAS Response:", gasResponse.data);
    
    const reply = gasResponse.data.reply || "Ok";
    res.json({ reply: reply });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ reply: "Error: " + error.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log("🚀 Hai-Emet Server Ready on port", CONFIG.PORT);
});
