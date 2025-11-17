const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzBmmyHxq_8j0k_c5T0pX_ST0jTjqH2CqeFmE7ZWEAIcnHSSQqd7dgNbssDqa/exec",
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
  try {
    let message = req.query.msg || req.body.message || "";
    if (!message) return res.status(400).json({ reply: "No message" });
    
    const gasResponse = await axios.post(CONFIG.GAS_URL, {
      action: "chat",
      token: CONFIG.CHAI_EMET_TOKEN,
      message: message
    });
    
    res.json({ reply: gasResponse.data.reply || "Ok" });
  } catch (error) {
    res.status(500).json({ reply: "Error" });
  }
});

app.listen(CONFIG.PORT, () => console.log("Ready on", CONFIG.PORT));
