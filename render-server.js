const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbyKQMY41ArmvpD_cqwejXycStWjG_oXB4JHx7XUC1mX9xAMLi4lUtCXdg7Yv...../exec",
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
    
    if (!message) {
      return res.status(400).json({ reply: "No message" });
    }
    
    console.log("📨 Message:", message);
    console.log("🔐 Token exists:", !!CONFIG.CHAI_EMET_TOKEN);
    
    const gasPayload = {
      message: message,
      token: CONFIG.CHAI_EMET_TOKEN
    };
    
    console.log("📤 Sending to GAS:", gasPayload);
    
    const gasResponse = await axios.post(CONFIG.GAS_URL, gasPayload, {
      timeout: 10000
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
  console.log("🚀 Ready on", CONFIG.PORT);
});
```

---

## **שינויים:**
```
❌ action: "chat" → ✅ removed
✅ {message, token} → ✅ correct format
✅ Added logging
✅ Better error messages
