const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp";

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
    .container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; height: 100vh; }
    .header { text-align: center; padding: 15px; border-bottom: 2px solid #ffd700; margin-bottom: 10px; }
    h1 { font-size: 32px; text-shadow: 0 0 10px #ffd700; }
    h2 { font-size: 14px; color: #ff6b9d; }
    .main-wrapper { display: flex; flex: 1; gap: 10px; min-height: 0; }
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
    .api-panel { flex: 1; background: rgba(255,215,0,0.05); border: 2px solid #ff6b9d; border-radius: 8px; padding: 15px; overflow-y: auto; font-size: 11px; font-family: monospace; }
    .api-title { color: #ff6b9d; font-weight: bold; margin-bottom: 10px; }
    .api-log { background: rgba(0,0,0,0.3); padding: 8px; margin: 5px 0; border-left: 2px solid #ffd700; border-radius: 3px; }
    .api-success { border-left-color: #64c844; color: #90ee90; }
    .api-error { border-left-color: #ff6b9d; color: #ff6b9d; }
    .api-info { border-left-color: #ffd700; color: #ffd700; }
    .footer { text-align: center; padding: 10px; border-top: 1px solid rgba(255,215,0,0.2); font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💛 Hai-Emet 💛</h1>
      <h2>Unified 5D Quantum System</h2>
    </div>
    
    <div class="main-wrapper">
      <div class="chat-box">
        <div class="messages" id="messages">
          <div class="message system">
            <div class="message-content">שלום 💛 אני חי-אמת. כתבו הודעה!</div>
          </div>
        </div>
        <div class="input-area">
          <input type="text" id="msg" placeholder="כתבו הודעה..." autocomplete="off">
          <button onclick="send()">שלח 💛</button>
        </div>
      </div>
      
      <div class="api-panel">
        <div class="api-title">📊 API Monitor</div>
        <div id="api-logs"></div>
      </div>
    </div>
    
    <div class="footer">
      💛 Hai-Emet ULTIMATE 3.0 | Powered by Render.com 🚀
    </div>
  </div>
  
  <script>
    const msgInput = document.getElementById('msg');
    const messagesDiv = document.getElementById('messages');
    const apiLogsDiv = document.getElementById('api-logs');
    
    function logAPI(message, type = 'info') {
      const log = document.createElement('div');
      log.className = 'api-log api-' + type;
      log.textContent = new Date().toLocaleTimeString() + ' - ' + message;
      apiLogsDiv.appendChild(log);
      apiLogsDiv.scrollTop = apiLogsDiv.scrollHeight;
    }
    
    msgInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') send();
    });
    
    async function send() {
      const msg = msgInput.value.trim();
      if (!msg) return;
      
      addMsg('user', msg);
      msgInput.value = '';
      
      logAPI('Sending message: "' + msg + '"', 'info');
      
      try {
        const payload = {
          message: msg,
          token: 'chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp'
        };
        
        logAPI('Payload: ' + JSON.stringify(payload), 'info');
        
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (data.status === 'success') {
          logAPI('✅ Token Valid', 'success');
          logAPI('Response: ' + data.reply, 'success');
          addMsg('system', data.reply || 'שגיאה');
        } else {
          logAPI('❌ ' + (data.error || 'Error'), 'error');
          addMsg('system', data.error || 'שגיאה');
        }
      } catch (e) {
        logAPI('❌ ' + e.message, 'error');
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

// API CHAT
app.post("/api/chat", (req, res) => {
  try {
    const message = req.body.message || "";
    const token = req.body.token || "";
    
    console.log("📨 Message:", message);
    console.log("🔑 Token:", token);
    
    // בדוק טוקן
    if (token !== TOKEN) {
      console.log("❌ Invalid token!");
      return res.json({
        status: "error",
        error: "❌ טוקן לא תקין!"
      });
    }
    
    console.log("✅ Token valid");
    
    if (!message.trim()) {
      return res.json({
        status: "error",
        error: "לא קיבלתי הודעה"
      });
    }
    
    const reply = generateResponse(message);
    
    res.json({
      status: "success",
      reply: reply,
      token_valid: true
    });
    
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      status: "error",
      error: "⚠️ שגיאה בשרת"
    });
  }
});

// RESPONSE GENERATOR
function generateResponse(message) {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes("שלום") || msg.includes("היי") || msg.includes("hello")) {
    return "שלום 💛 אני חי-אמת! מה אוכל לעזור לך?";
  }
  
  if (msg.includes("מי את") || msg.includes("who are you")) {
    return "אני חי-אמת - מערכת 5D קוונטית | Owner: TNTF | Version: 3.0-ULTIMATE";
  }
  
  if (msg.includes("מצב") || msg.includes("status")) {
    return "🟢 Online | Languages: 15 | Version: 3.0-ULTIMATE";
  }
  
  if (msg.includes("תודה") || msg.includes("thanks")) {
    return "בשמחה! 💛 יש לי עוד משהו לעזור?";
  }
  
  return "✨ שמעתי: \"" + message + "\" - איך אוכל לעזור?";
}

// START
app.listen(PORT, () => {
  console.log("💛 Hai-Emet Server running on port " + PORT);
});
