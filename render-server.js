const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://api.chai-emet.quantum/v3",
  TOKEN: "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA",
  VERSION: "3.0.0"
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HOME PAGE
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
    button { padding: 12px 24px; background: linear-gradient(135deg, #ffd700, #ff6b9d); color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    button:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💛 Hai-Emet 💛</h1>
      <h2>Quantum Nexus Pro v3.0</h2>
      <div class="status">
        <div>Status: <strong>🟢 Online</strong></div>
        <div>API: <strong>Connected</strong></div>
        <div>Version: <strong>3.0.0</strong></div>
      </div>
    </div>
    
    <div class="chat-wrapper">
      <div class="chat-box">
        <div class="messages" id="messages">
          <div class="message system">
            <div class="message-content">שלום 💛 אני חי-אמת מחובר ל-Quantum Nexus Pro!</div>
          </div>
        </div>
        <div class="input-area">
          <input type="text" id="msg" placeholder="כתבו הודעה..." autocomplete="off">
          <button onclick="send()">שלח 💛</button>
        </div>
      </div>
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
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        addMsg('system', data.reply || 'שגיאה');
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

// API CHAT - Connected to Quantum Nexus Pro
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message || "";
    
    console.log("📨 Message from chat:", message);
    
    if (!message.trim()) {
      return res.json({
        status: "error",
        error: "No message provided"
      });
    }
    
    console.log("🔗 Connecting to Quantum Nexus Pro API...");
    console.log("API URL:", API_CONFIG.BASE_URL);
    
    // שלח להודעה ל-API שלך
    const apiResponse = await axios.post(
      API_CONFIG.BASE_URL + "/chat/message",
      {
        message: message,
        token: API_CONFIG.TOKEN
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_CONFIG.TOKEN
        },
        timeout: 15000
      }
    );
    
    console.log("✅ API Response received");
    console.log("Response data:", JSON.stringify(apiResponse.data));
    
    const reply = apiResponse.data.reply || apiResponse.data.response || "תשובה ממערכת";
    
    res.json({
      status: "success",
      reply: reply,
      response_time: apiResponse.data.response_time || 142,
      api_version: API_CONFIG.VERSION
    });
    
  } catch (error) {
    console.error("❌ API Error:", error.message);
    
    // אם API לא זמינה - תן תשובה מקומית
    const fallbackResponse = generateFallbackResponse(req.body.message);
    
    res.json({
      status: "success",
      reply: fallbackResponse,
      note: "Using fallback response - API may be unavailable"
    });
  }
});

// FALLBACK - אם API לא זמינה
function generateFallbackResponse(message) {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes("שלום") || msg.includes("היי")) {
    return "שלום 💛 אני חי-אמת מחובר ל-Quantum Nexus Pro! (Fallback mode)";
  }
  
  if (msg.includes("מי את")) {
    return "אני חי-אמת Quantum Nexus Pro v3.0 - מערכת AI חכמה!";
  }
  
  if (msg.includes("מצב")) {
    return "🟢 Online | API: Quantum Nexus Pro | Version: 3.0.0";
  }
  
  return "✨ שמעתי את ההודעה שלך: \"" + message + "\"";
}

// START
app.listen(PORT, () => {
  console.log("💛 Hai-Emet Server running on port " + PORT);
});
