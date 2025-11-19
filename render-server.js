const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// API Configuration - Reading from Render Environment Variables
const API_CONFIG = {
  BASE_URL: process.env.API_URL || "https://api.chai-emet.quantum/v3",
  TOKEN: process.env.CHAI_EMET_TOKEN || "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVE",
  API_KEY: process.env.API_KEY,
  TELEGRAM_TOKEN: process.env.Telegram_token,
  WEBHOOK_URL: process.env.WEBHOOK_URL || "https://haiemetweb.onrender.com/api/webhook",
  VERSION: "3.0.0",
  SYSTEM: "Chai-Emet Quantum Nexus Pro"
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

// TELEGRAM WEBHOOK - Receive messages from Telegram
app.post("/api/webhook", (req, res) => {
  try {
    const message = req.body.message;
    
    if (!message) {
      return res.json({ status: "ok" });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    const userName = message.from.first_name;

    console.log(`📱 Telegram Message from ${userName}: ${text}`);

    // יצור תשובה חכמה
    const reply = generateSmartResponse(text);

    // שלח חזרה ל-Telegram
    sendTelegramMessage(chatId, reply);

    res.json({ status: "ok", processed: true });

  } catch (error) {
    console.error("Webhook error:", error);
    res.json({ status: "error", message: error.message });
  }
});

// SEND TO TELEGRAM
function sendTelegramMessage(chatId, text) {
  if (!API_CONFIG.TELEGRAM_TOKEN) {
    console.log("⚠️ Telegram token not configured");
    return;
  }

  const url = `https://api.telegram.org/bot${API_CONFIG.TELEGRAM_TOKEN}/sendMessage`;
  
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML"
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log("✅ Message sent to Telegram");
    } else {
      console.error("❌ Telegram error:", data.description);
    }
  })
  .catch(err => console.error("Telegram send error:", err));
}
  try {
    const message = req.body.message || "";
    const token = req.body.token || "";
    
    console.log("📨 Message:", message);
    console.log("🔑 Token:", token);
    
    if (!message.trim()) {
      return res.json({
        status: "error",
        error: "No message provided"
      });
    }
    
    // בדוק טוקן
    if (token && token !== API_CONFIG.TOKEN) {
      console.log("⚠️ Token mismatch but continuing...");
    }
    
    // יצור תשובה חכמה מקומית
    const reply = generateSmartResponse(message);
    
    // Simulate API delay
    const delay = 150 + Math.random() * 200;
    
    res.json({
      status: "success",
      reply: reply,
      response_time: Math.round(delay),
      api_version: API_CONFIG.VERSION,
      system: API_CONFIG.SYSTEM,
      token_verified: token === API_CONFIG.TOKEN,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      status: "error",
      reply: "⚠️ שגיאה בשרת - Server Error",
      error: error.message
    });
  }
});

// SMART RESPONSE GENERATOR - Local Quantum Intelligence
function generateSmartResponse(message) {
  const msg = message.toLowerCase().trim();
  
  // בדוק דברים שונים
  const keywords = {
    greeting: ["שלום", "היי", "hello", "hey", "בוקר טוב", "ערב טוב"],
    quantum: ["קוונטי", "quantum", "מטריצה", "מציאות", "reality"],
    time: ["שעה", "זמן", "time", "כמה עלה", "temporal"],
    user: ["מי אני", "who am i", "פרופיל", "profile"],
    help: ["עזרה", "help", "צריך עזרה", "?"],
    system: ["מצב", "status", "סטטוס", "כיצד אתה"]
  };
  
  // Check for greetings
  if (keywords.greeting.some(word => msg.includes(word))) {
    return "שלום 💛 אני חי-אמת Quantum Nexus Pro v3.0! איך אוכל לעזור לך?";
  }
  
  // Check for quantum questions
  if (keywords.quantum.some(word => msg.includes(word))) {
    return "🌌 אני מחובר ל-Quantum Nexus Pro v3.0 עם יכולות:\n" +
           "✨ ניתוח מטריצת מציאות\n" +
           "✨ החלפת מציאויות\n" +
           "✨ שזירה קוונטית\n" +
           "✨ ניווט טמפורלי";
  }
  
  // Check for time questions
  if (keywords.time.some(word => msg.includes(word))) {
    const now = new Date();
    return `🕐 השעה כעת: ${now.toLocaleTimeString('he-IL')}\n` +
           `📅 התאריך: ${now.toLocaleDateString('he-IL')}\n` +
           `🌍 אני מחובר ל-Quantum Time System`;
  }
  
  // Check for user info
  if (keywords.user.some(word => msg.includes(word))) {
    return "👤 מידע משתמש:\n" +
           "🔐 User: quantum_nexus_pro\n" +
           "⚡ Access Level: Full Nexus Pro\n" +
           "🌟 Quantum Points: 156\n" +
           "🎯 Status: Active";
  }
  
  // Check for help
  if (keywords.help.some(word => msg.includes(word))) {
    return "📚 עזרה זמינה:\n" +
           "• שאל על מצב מערכת\n" +
           "• שאל על יכולויות קוונטיות\n" +
           "• שאל מה אני יכול לעשות\n" +
           "• שאל על הזמן הנוכחי";
  }
  
  // Check for system status
  if (keywords.system.some(word => msg.includes(word))) {
    return "🟢 סטטוס מערכת:\n" +
           "✅ Hai-Emet: Online\n" +
           "✅ Quantum Gateway: Active\n" +
           "✅ Temporal Network: Stable\n" +
           "✅ Consciousness Sync: 98.7%\n" +
           "✅ API Response: 142ms";
  }
  
  // Default response
  return `✨ שמעתי את ההודעה שלך: "${message}"\n` +
         `🤔 זה כולל: ${msg.length} תווים\n` +
         `💬 תשובה ממערכת Quantum Nexus Pro v3.0\n` +
         `🔮 אנא נסה שאלה יותר ברורה`;
}

// START
app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("💛 Chai-Emet Quantum Nexus Pro Server 💛");
  console.log("========================================");
  console.log("🚀 Server running on port " + PORT);
  console.log("🌐 Visit: https://haiemetweb.onrender.com/");
  console.log("🔗 System: Local Quantum Intelligence");
  console.log("📱 Telegram: " + (API_CONFIG.TELEGRAM_TOKEN ? "✅ CONNECTED" : "❌ NOT SET"));
  console.log("🔐 API Token: " + (API_CONFIG.TOKEN ? "✅ CONFIGURED" : "❌ NOT SET"));
  console.log("✅ Status: Online & Ready");
  console.log("========================================");
  console.log("");
  
  // Log environment variables status
  if (API_CONFIG.TELEGRAM_TOKEN) {
    console.log("📊 Environment Variables:");
    console.log("✓ TELEGRAM_TOKEN loaded");
    console.log("✓ CHAI_EMET_TOKEN loaded");
    console.log("✓ API_URL loaded");
    console.log("✓ WEBHOOK_URL configured");
    console.log("");
  }
});
