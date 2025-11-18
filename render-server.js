const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

const CONFIG = {
 GAS_URL: "https://script.google.com/macros/s/AKfycbyxrdK0uaj9ELA89WBDnEK2ftse4xHU4bqHTNv5sbyPmpH8C63lJaw4DF3B3Z0R1MNl/exec",
  CHAI_EMET_TOKEN: process.env.CHAI_EMET_TOKEN,
  PORT: process.env.PORT || 8000
};

if (!CONFIG.CHAI_EMET_TOKEN) {
  console.error("❌ CHAI_EMET_TOKEN not set!");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.all("/exec", async (req, res) => {
  res.setTimeout(5000);
  
  try {
    let msg = req.query.msg || req.body.message || "";
    
    if (!msg) {
      return res.json({ reply: "No message" });
    }
    
    const r = await axios.post(CONFIG.GAS_URL, {
      action: "chat",
      message: msg,
      token: CONFIG.CHAI_EMET_TOKEN
    }, {timeout: 4500});
    
    res.json({ reply: r.data.reply || "Ok" });
    
  } catch (e) {
    console.error("Error:", e.message);
    res.json({ reply: "Error" });
  }
});

app.listen(CONFIG.PORT, () => console.log("✅ Ready! 💛"));
```

---

## **עכשיו בRender:**

**Settings → Environment Variables**
```
CHAI_EMET_TOKEN=chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp
