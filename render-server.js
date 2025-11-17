const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbyNITTtnyq_i51pkgsr7uo2X_w_D7ZPGQeE6XEH3CIx_8YkrghKKGAo7AZTHIfAF2LU/exec",
  CHAI_EMET_TOKEN: process.env.CHAI_EMET_TOKEN || "default",
  PORT: process.env.PORT || 8000
};

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.all("/exec", async (req, res) => {
  res.setTimeout(4000);
  try {
    let msg = req.query.msg || req.body.message || "";
    if (!msg) return res.json({ reply: "No message" });
    
    const r = await axios.post(CONFIG.GAS_URL, {message: msg, token: CONFIG.CHAI_EMET_TOKEN}, {timeout: 3900});
    res.json({reply: r.data.reply || "Ok"});
  } catch (e) {
    res.json({reply: "Error"});
  }
});

app.listen(CONFIG.PORT, () => console.log("Ready"));
