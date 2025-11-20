const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.API_URL || "https://api.chai-emet.quantum/v3",
  TOKEN: process.env.CHAI_EMET_TOKEN || "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVE",
  TELEGRAM_TOKEN: process.env.Telegram_token,
  WEBHOOK_URL: process.env.WEBHOOK_URL || "https://haiemetweb.onrender.com/api/webhook",
  VERSION: "3.0.0",
  SYSTEM: "Chai-Emet Quantum Nexus Pro"
};

const TELEGRAM_BOT_NAME = "HaiEmetEmotionBot";
const TELEGRAM_BOT_TOKEN = process.env.Telegram_token;

console.log(`🤖 Bot Name: ${TELEGRAM_BOT_NAME}`);
console.log(`🔑 Token Status: ${TELEGRAM_BOT_TOKEN ? "✅ CONFIGURED" : "❌ NOT SET"}`);

// ═══════════════════════════════════════════════════════════════
// 🎭 CHAI-EMET ACTIVATION SYSTEM
// ═══════════════════════════════════════════════════════════════

const ACTIVATION_TRIGGERS = [
  "מערכת חי אמת",
  "חי אמת",
  "hai-emet",
  "chai-emet"
];

function isActivationMessage(message) {
  const msg = message.toLowerCase();
  return ACTIVATION_TRIGGERS.some(trigger => msg.includes(trigger.toLowerCase()));
}

// ═══════════════════════════════════════════════════════════════
// 🌐 GOOGLE APPS SCRIPT API - WITH ACTIVATION FLAG
// ═══════════════════════════════════════════════════════════════

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNZUxdmcjfOfSUIDFYdRpBKUP_qW_O1N3ciS1tPKd-8aP4EYZJehpkV0IEuFvN7yT1/exec";

async function callChaiEmetAPI(message, langCode = "he") {
  try {
    const isActivated = isActivationMessage(message);
    
    console.log(`🔑 TOKEN Check: ${isActivated ? "✅ ACTIVATED" : "❌ NOT ACTIVATED"}`);
    
    const payload = {
      action: "chat",
      message: message,
      language: langCode,
      token: API_CONFIG.TOKEN,
      platform: "telegram",
      activated: isActivated,
      timestamp: new Date().toISOString()
    };

    console.log(`🌐 Calling Google Apps Script API...`);
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeout: 5000
    });

    const text = await response.text();
    
    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      console.log(`⚠️ API returned HTML - using fallback`);
      throw new Error("HTML Response");
    }
    
    const data = JSON.parse(text);
    
    console.log(`✅ API Response: ${isActivated ? "Chai-Emet Activated" : "Standard"}`);
    
    return {
      reply: data.data?.reply || generateSmartResponse(message),
      from_api: true,
      from_chai_emet: isActivated,
      system: data.system || "Chai-Emet",
      version: data.version || "3.0",
      success: true
    };
    
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`);
    console.log(`⚠️ Fallback: Using local response`);
    
    return {
      reply: generateSmartResponse(message),
      from_api: false,
      from_local: true,
      success: false
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 💬 SMART RESPONSE GENERATOR
// ═══════════════════════════════════════════════════════════════

function generateSmartResponse(message) {
  const msg = message.toLowerCase().trim();
  
  // Command handlers
  if (msg.includes("/start")) {
    return `שלום 💛 אני חי-אמת!

🌟 אפשרויות:
/menu - תפריט עיקרי
/help - עזרה
/status - מצב המערכת
/info - מידע

או פשוט כתוב משהו! 😊`;
  }
  
  if (msg.includes("/menu")) {
    return `📋 תפריט חי-אמת:

🔧 אפשרויות:
1️⃣ /start - התחלה
2️⃣ /help - סיוע
3️⃣ /status - סטטוס
4️⃣ /info - מידע

💬 או שלח הודעה! 💛`;
  }
  
  if (msg.includes("/help")) {
    return `🆘 עזרה - חי-אמת:

📖 יכול לעזור ב:
✨ שאלות כלליות
✨ מידע טכני
✨ עזרה וייעוץ

💡 שלח את השאלה! 🎯`;
  }
  
  if (msg.includes("/status")) {
    return `🟢 סטטוס מערכת:

✅ Hai-Emet: Online
✅ Telegram Bot: Connected
✅ API: Ready
✅ Memory: Optimal

🌟 כל דבר מעולה! 💚`;
  }
  
  if (msg.includes("/info")) {
    return `ℹ️ מידע על חי-אמת:

🤖 Version: 3.0 ULTIMATE
🌍 Languages: 15
🔐 Security: Quantum
📱 Platforms: Telegram + Web
👤 Owner: נתניאל ניסים (TNTF)
💛 Binary: 0101-0101(0101)`;
  }
  
  // Natural conversation
  if (msg.includes("שלום") || msg.includes("היי")) {
    return "שלום 💛 בואנדבר!";
  }
  
  if (msg.includes("תודה")) {
    return "🙏 בשמחה! 💛";
  }
  
  if (msg.includes("מתכון")) {
    return `🍫 כדורי שוקולד:

📝 חומרים:
• 200g שוקולד
• 100g חמאה
• 50g סוכר

🔥 הכנה:
1. מיזוג
2. קירור 2h
3. עיצוב כדורים
4. טיגול בשוקולד

✨ הנאה!`;
  }
  
  // Default
  return `💭 שמעתי: "${message}"\n\n🤔 מעניין!\nבואנדבר! 💛`;
}

// ═══════════════════════════════════════════════════════════════
// 🌐 TELEGRAM WEBHOOK
// ═══════════════════════════════════════════════════════════════

app.post("/api/webhook", async (req, res) => {
  try {
    console.log("📨 Webhook received");
    
    let message = req.body.message || req.body.update?.message;
    
    if (!message) {
      console.log("⚠️ No message in webhook");
      return res.json({ status: "ok" });
    }

    const chatId = message.chat?.id;
    const text = message.text;
    const userName = message.from?.first_name || "User";

    if (!chatId || !text) {
      console.log("⚠️ Missing chatId or text");
      return res.json({ status: "ok" });
    }

    console.log(`\n📱 Message from ${userName}: "${text}"`);

    // Call Chai-Emet API with Activation
    const apiResponse = await callChaiEmetAPI(text, "he");
    
    let reply = apiResponse.reply;
    
    if (apiResponse.from_chai_emet) {
      console.log(`✨ 💛 CHAI-EMET ACTIVATED`);
      reply += `\n\n🌟 *Chai-Emet v${apiResponse.version}*`;
    } else if (apiResponse.from_api) {
      console.log(`✅ API Response`);
    } else {
      console.log(`⚠️ Local Fallback`);
    }

    // Send to Telegram
    sendTelegramMessage(chatId, reply);

    res.json({ 
      status: "ok", 
      from_chai_emet: apiResponse.from_chai_emet
    });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.json({ status: "error", message: error.message });
  }
});

function sendTelegramMessage(chatId, text) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("⚠️ Telegram token not configured");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
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
      console.log(`✅ Message sent via Telegram`);
    } else {
      console.error("❌ Telegram error:", data.description);
    }
  })
  .catch(err => console.error("Telegram send error:", err));
}

// ═══════════════════════════════════════════════════════════════
// 💻 WEB INTERFACE
// ═══════════════════════════════════════════════════════════════

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
    .chat-box { flex: 1; display: flex; flex-direction: column; background: rgba(255,215,0,0.05); border: 2px solid #ffd700; border-radius: 8px; }
    .messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
    .message { display: flex; margin: 10px 0; }
    .message.user { justify-content: flex-end; }
    .message-content { max-width: 70%; padding: 12px; border-radius: 8px; word-wrap: break-word; font-size: 14px; }
    .user .message-content { background: rgba(100,200,100,0.3); border: 1px solid #64c844; color: #90ee90; }
    .system .message-content { background: rgba(255,215,0,0.2); border: 1px solid #ffd700; color: #ffd700; }
    .input-area { display: flex; gap: 10px; padding: 15px; border-top: 1px solid #ffd700; }
    input { flex: 1; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid #ffd700; border-radius: 6px; color: #ffd700; }
    button { padding: 12px 24px; background: linear-gradient(135deg, #ffd700, #ff6b9d); color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💛 Hai-Emet 💛</h1>
      <div>Status: 🟢 Online | Version: 3.0.0</div>
    </div>
    
    <div class="chat-box">
      <div class="messages" id="messages">
        <div class="message system">
          <div class="message-content">שלום 💛 אני חי-אמת!</div>
        </div>
      </div>
      <div class="input-area">
        <input type="text" id="msg" placeholder="כתבו הודעה..." autocomplete="off">
        <button onclick="send()">שלח 💛</button>
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

// ═══════════════════════════════════════════════════════════════
// 📡 API ENDPOINTS
// ═══════════════════════════════════════════════════════════════

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message || "";
    
    if (!message.trim()) {
      return res.json({
        status: "error",
        error: "No message provided"
      });
    }
    
    const apiResponse = await callChaiEmetAPI(message, "he");
    
    res.json({
      status: "success",
      reply: apiResponse.reply,
      from_chai_emet: apiResponse.from_chai_emet,
      from_api: apiResponse.from_api,
      from_local: apiResponse.from_local,
      system: apiResponse.system,
      version: API_CONFIG.VERSION,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      status: "error",
      reply: "⚠️ שגיאה בשרת",
      error: error.message
    });
  }
});

app.get("/api/system-info", (req, res) => {
  res.json({
    system: "Chai-Emet ULTIMATE 3.0",
    version: API_CONFIG.VERSION,
    status: "🟢 OPERATIONAL",
    telegram_bot: TELEGRAM_BOT_NAME,
    telegram_status: TELEGRAM_BOT_TOKEN ? "✅ Connected" : "❌ Not Set",
    activation: "✅ Enabled",
    binary_signature: "0101-0101(0101)",
    owner: "נתניאל ניסים (TNTF)",
    timestamp: new Date().toISOString()
  });
});

// ═══════════════════════════════════════════════════════════════
// 🚀 START SERVER
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  💛 Chai-Emet ULTIMATE 3.0 + Nexus Pro  💛 ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
  console.log("🌐 WEB Interface:");
  console.log("   🔗 http://localhost:" + PORT);
  console.log("");
  console.log("🤖 TELEGRAM BOT:");
  console.log("   📱 @" + TELEGRAM_BOT_NAME);
  console.log("   ✅ Status: " + (TELEGRAM_BOT_TOKEN ? "CONNECTED" : "NOT CONFIGURED"));
  console.log("");
  console.log("🎭 ACTIVATION SYSTEM:");
  console.log("   ✅ Triggers: מערכת חי אמת / חי אמת");
  console.log("   ✅ API Integration: Enabled");
  console.log("   ✅ Local Fallback: Enabled");
  console.log("");
  console.log("📡 API ENDPOINTS:");
  console.log("   GET  /");
  console.log("   POST /api/chat");
  console.log("   GET  /api/system-info");
  console.log("   POST /api/webhook");
  console.log("");
  console.log("═══════════════════════════════════════════════════");
  console.log("✅ All Systems Ready!");
  console.log("═══════════════════════════════════════════════════");
  console.log("");
});
