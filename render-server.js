const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzmO1zxytDyq5p02hBfbv1xDKnesGI_fzZb0AiusTg8LFLDwqdig9AV-ks5UvUWww7lpw/exec",
  TOKENS: {
    CHAI_EMET: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    NEXUS_PRO: "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
  },
  PORT: process.env.PORT || 8000
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🌐 HOME PAGE
// ============================================

app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Hai-Emet Chat</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial; background: #000; color: #ffd700; padding: 10px; min-height: 100vh; }
    .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; height: 100vh; }
    .header { text-align: center; padding: 15px; border-bottom: 2px solid #ffd700; margin-bottom: 10px; }
    h1 { font-size: 32px; text-shadow: 0 0 10px #ffd700; }
    h2 { font-size: 14px; color: #ff6b9d; }
    .status { display: flex; justify-content: space-around; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 6px; font-size: 12px; margin: 10px 0; flex-wrap: wrap; gap: 10px; }
    .chat-wrapper { display: flex; flex: 1; gap: 10px; min-height: 0; }
    .chat-box { flex: 2; display: flex; flex-direction: column; background: rgba(255,215,0,0.05); border: 2px solid #ffd700; border-radius: 8px; }
    .messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
    .message { display: flex; margin: 10px 0; animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .message.user { justify-content: flex-end; }
    .message-content { max-width: 70%; padding: 12px; border-radius: 8px; word-wrap: break-word; font-size: 14px; }
    .user .message-content { background: rgba(100,200,100,0.3); border: 1px solid #64c844; color: #90ee90; }
    .system .message-content { background: rgba(255,215,0,0.2); border: 1px solid #ffd700; color: #ffd700; }
    .input-area { display: flex; gap: 10px; padding: 15px; border-top: 1px solid #ffd700; }
    input { flex: 1; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid #ffd700; border-radius: 6px; color: #ffd700; }
    input:focus { outline: none; border-color: #ff6b9d; }
    button { padding: 12px 24px; background: linear-gradient(135deg, #ffd700, #ff6b9d); color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    button:hover { transform: translateY(-2px); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .info { flex: 1; background: rgba(255,215,0,0.05); border: 2px solid #ff6b9d; border-radius: 8px; padding: 15px; overflow-y: auto; font-size: 12px; }
    .footer { text-align: center; padding: 10px; border-top: 1px solid rgba(255,215,0,0.2); font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💛 Hai-Emet 💛</h1>
      <h2>Unified 5D Quantum System</h2>
      <div class="status">
        <div>Status: <strong>🟢 Online</strong></div>
        <div>Version: <strong>3.0-ULTIMATE</strong></div>
        <div>Languages: <strong>15</strong></div>
        <div>Tokens: <strong>2</strong></div>
      </div>
    </div>
    
    <div class="chat-wrapper">
      <div class="chat-box">
        <div class="messages" id="messages">
          <div class="message system">
            <div class="message-content">שלום 💛 אני חי-אמת. כתבו הודעה וקבלו תשובה!</div>
          </div>
        </div>
        <div class="input-area">
          <input type="text" id="msg" placeholder="כתבו הודעה..." autocomplete="off">
          <button onclick="send()">שלח 💛</button>
        </div>
      </div>
      
      <div class="info">
        <h3 style="color: #ff6b9d; margin-bottom: 10px;">📊 Info</h3>
        <div style="padding: 8px; border-bottom: 1px solid rgba(255,215,0,0.2);"><strong>Name:</strong> Hai-Emet</div>
        <div style="padding: 8px; border-bottom: 1px solid rgba(255,215,0,0.2);"><strong>Version:</strong> 3.0-ULTIMATE</div>
        <div style="padding: 8px; border-bottom: 1px solid rgba(255,215,0,0.2);"><strong>Owner:</strong> TNTF</div>
        <div style="padding: 8px; border-bottom: 1px solid rgba(255,215,0,0.2);"><strong>Status:</strong> 🟢 Online</div>
        <h3 style="color: #ff6b9d; margin-top: 15px; margin-bottom: 10px;">🔑 Tokens: 2</h3>
        <div style="padding: 8px; background: rgba(100,200,100,0.1); border-radius: 4px; margin-bottom: 10px;">✅ Chai-Emet Classic</div>
        <div style="padding: 8px; background: rgba(100,200,100,0.1); border-radius: 4px;">✅ Nexus Pro API</div>
      </div>
    </div>
    
    <div class="footer">
      💛 Hai-Emet ULTIMATE 3.0 | Powered by Render.com 🚀
    </div>
  </div>
  
  <script>
    const msgInput = document.getElementById('msg');
    const messagesDiv = document.getElementById('messages');
    
    msgInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') send();
    });
    
    async function send() {
      const msg = msgInput.value.trim();
      if (!msg) return;
      
      addMsg('user', msg);
      msgInput.value = '';
      
      try {
        const res = await fetch('/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: msg,
            token: 'chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp'
          })
        });
        const data = await res.json();
        addMsg('system', data.reply || 'OK');
      } catch (e) {
        addMsg('system', 'Error: ' + e.message);
      }
    }
    
    function addMsg(sender, text) {
      const div = document.createElement('div');
      div.className = 'message ' + sender;
      div.innerHTML = '<div class="message-content">' + text + '</div>';
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  </script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// ============================================
// 🏥 HEALTH
// ============================================

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ============================================
// 💬 CHAT ENDPOINT - FIXED
// ============================================

app.all("/exec", async (req, res) => {
  try {
    console.log("=== RENDER REQUEST ===");
    console.log("Method:", req.method);
    console.log("Body:", JSON.stringify(req.body));
    console.log("Query:", JSON.stringify(req.query));
    
    // Get message and token from body or query
    const message = req.body.message || req.query.message || "";
    const token = req.body.token || req.query.token || "";
    
    console.log("Message:", message);
    console.log("Token:", token);
    
    if (!message.trim()) {
      return res.json({ reply: "No message received" });
    }
    
    // Create payload for GAS
    const payload = {
      message: message,
      token: token
    };
    
    console.log("Sending to GAS:", JSON.stringify(payload));
    
    // Send to Google Apps Script with proper headers
    const gasRes = await axios.post(
      CONFIG.GAS_URL,
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      }
    );
    
    console.log("GAS Response:", JSON.stringify(gasRes.data));
    
    res.json({
      reply: gasRes.data.reply || "Response from Hai-Emet"
    });
    
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.json({
      reply: "Error: " + error.message
    });
  }
});

// ============================================
// 🚀 START
// ============================================

app.listen(CONFIG.PORT, () => {
  console.log("Hai-Emet Server running on port " + CONFIG.PORT);
  console.log("Visit: https://haiemetweb.onrender.com/");
  console.log("GAS URL: " + CONFIG.GAS_URL);
});
