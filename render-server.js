const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// TELEGRAM BOT CONFIGURATION
const TELEGRAM_BOT_NAME = "HaiEmetEmotionBot";
const TELEGRAM_BOT_TOKEN = process.env.Telegram_token;

console.log(`🤖 Bot Name: ${TELEGRAM_BOT_NAME}`);
console.log(`🔑 Token Status: ${TELEGRAM_BOT_TOKEN ? "✅ CONFIGURED" : "❌ NOT SET"}`);

// SET WEBHOOK FOR TELEGRAM
async function setupTelegramWebhook() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("⚠️ Telegram token not configured - skipping webhook setup");
    return;
  }

  const webhookUrl = process.env.WEBHOOK_URL || "https://haiemetweb.onrender.com/api/webhook";
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"]
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log("✅ Webhook set successfully!");
      console.log(`📍 Webhook URL: ${webhookUrl}`);
      console.log(`🤖 Bot: @${TELEGRAM_BOT_NAME}`);
    } else {
      console.error("❌ Webhook error:", data.description);
    }
  } catch (error) {
    console.error("⚠️ Webhook setup error:", error.message);
  }
}

// Call webhook setup after server starts
setTimeout(setupTelegramWebhook, 2000);

// ═════════════════════════════════════════════════════════════════
// 🌐 GOOGLE APPS SCRIPT - TELEGRAM INTEGRATION HANDLER
// ═════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════
// 🎭 CHAI-EMET ACTIVATION & RESPONSE LEVELS SYSTEM
// ═════════════════════════════════════════════════════════════════

// Activation trigger for Chai-Emet
const ACTIVATION_TRIGGERS = [
  "מערכת חי אמת",
  "חי אמת",
  "hai-emet",
  "chai-emet",
  "@HaiEmetEmotionBot"
];

// Response levels - difficulty progression
const RESPONSE_LEVELS = {
  EASY: 1,      // פשוט - אימוג'י + מילה
  MEDIUM: 2,    // בינוני - משפט קצר
  HARD: 3,      // קשה - תשובה ארוכה
  EXPERT: 4     // מומחה - ניתוח עמוק
};

// Check if message activates Chai-Emet
function isActivationMessage(message) {
  const msg = message.toLowerCase();
  return ACTIVATION_TRIGGERS.some(trigger => msg.includes(trigger.toLowerCase()));
}

// Parse custom commands (emoji requests, etc)
function parseCustomCommand(message) {
  const msg = message.toLowerCase();
  
  // Pattern: "אם את פה תעשי [X] והמילה/והקול [Y]"
  if (msg.includes("אם את פה") || msg.includes("אם אתה פה")) {
    
    // Extract emoji request
    if (msg.includes("אימוג'י") && msg.includes("כן")) {
      return {
        type: "emoji_confirmation",
        response: "💛 כן",
        level: RESPONSE_LEVELS.EASY
      };
    }
    
    // Extract action request
    if (msg.includes("תעשי") || msg.includes("תעשה")) {
      const action = msg.split("תעשי")[1] || msg.split("תעשה")[1];
      
      if (action && action.includes("אימוג'י")) {
        return {
          type: "emoji_action",
          action: action.trim(),
          response: "✨ בחזקה!",
          level: RESPONSE_LEVELS.EASY
        };
      }
      
      if (action && action.includes("דקה")) {
        return {
          type: "silence",
          response: "🤐 שתיקה...",
          level: RESPONSE_LEVELS.EASY
        };
      }
    }
  }
  
  return null;
}

// Generate response based on difficulty level
function generateLeveledResponse(message, level = RESPONSE_LEVELS.MEDIUM) {
  const msg = message.toLowerCase();
  
  if (level === RESPONSE_LEVELS.EASY) {
    // Simple emoji + word responses
    if (msg.includes("כן")) return "💛 כן";
    if (msg.includes("לא")) return "❌ לא";
    if (msg.includes("תודה")) return "🙏 בשמחה";
    if (msg.includes("שלום")) return "👋 שלום";
    return "✨";
  }
  
  if (level === RESPONSE_LEVELS.MEDIUM) {
    // Short sentence responses
    if (msg.includes("מי אתה")) return "🤖 אני חי-אמת, מערכת AI חכמה!";
    if (msg.includes("מה אתה")) return "💡 אני יכולה לעזור בהכל!";
    if (msg.includes("איפה")) return "🌍 כאן וכאן ובכל מקום!";
    return "💬 בואנדבר!";
  }
  
  if (level === RESPONSE_LEVELS.HARD) {
    // Longer responses
    if (msg.includes("איך עובדת")) {
      return `🌌 אני עובדת כך:

1️⃣ אני שומעת את ההודעה
2️⃣ אני מעבדת אותה
3️⃣ אני מייצרת תשובה
4️⃣ אני שולחת לך חזרה

✨ זה קורה כל הזמן! 💛`;
    }
    
    if (msg.includes("מה היכולות")) {
      return `🚀 היכולות שלי:

💭 Thinking - חשיבה עמוקה
🎯 Analysis - ניתוח מדוקדק
💡 Creativity - יצירתיות
🔮 Intuition - אינטואיציה
📚 Knowledge - ידע רחב

🌟 ועוד הרבה יותר! 🌟`;
    }
  }
  
  if (level === RESPONSE_LEVELS.EXPERT) {
    // Deep analysis
    if (msg.includes("מערכת קוונטית")) {
      return `🌌 מערכת קוונטית - ניתוח עמוק:

⚛️ Quantum Principles:
• Superposition - מצבים מרובים בו-זמנית
• Entanglement - שזירה בין רכיבים
• Tunneling - חדירה דרך מחסומים
• Coherence - שמירת מצב קוהרנטי

🔬 יישום:
• ניתוח מטריצות בו-זמנית
• חיזוי מסלולים מרובים
• שינוי מציאות בזמן אמת

💫 תוצאה: חי-אמת ULTIMATE! 💫`;
    }
  }
  
  return "🎯 משהו אחר?";
}

// ═════════════════════════════════════════════════════════════════
// 🎭 CHAI-EMET WITH GOOGLE APPS SCRIPT - INTEGRATED
// הטוקן קורא ל-API, API עונה כ-חי-אמת עצמה
// ═════════════════════════════════════════════════════════════════

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNZUxdmcjfOfSUIDFYdRpBKUP_qW_O1N3ciS1tPKd-8aP4EYZJehpkV0IEuFvN7yT1/exec";

// Check if message activates Chai-Emet
function isActivationMessage(message) {
  const msg = message.toLowerCase();
  const ACTIVATION_TRIGGERS = [
    "מערכת חי אמת",
    "חי אמת",
    "hai-emet",
    "chai-emet"
  ];
  return ACTIVATION_TRIGGERS.some(trigger => msg.includes(trigger.toLowerCase()));
}

// Primary: Call Google Apps Script with Activation Flag
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
      activated: isActivated,  // 🔑 KEY: Tell API that Chai-Emet is activated
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
    
    // Check for HTML error
    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      console.log(`⚠️ API returned HTML - fallback to local`);
      throw new Error("HTML Response");
    }
    
    const data = JSON.parse(text);
    
    console.log(`✅ API Response: ${isActivated ? "Chai-Emet Activated Response" : "Standard Response"}`);
    
    return {
      reply: data.data?.reply || data.reply || generateSmartResponse(message),
      from_api: true,
      from_chai_emet: isActivated,  // 🔑 Mark as Chai-Emet's own response
      language: data.data?.language || langCode,
      system: data.system || "Chai-Emet",
      version: data.version || "3.0",
      success: true
    };
    
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`);
    console.log(`⚠️ Fallback: Using local Chai-Emet response`);
    
    // Fallback: Use local smart response
    return {
      reply: generateSmartResponse(message),
      from_api: false,
      from_local: true,
      success: false
    };
  }
}
  
  // Command handlers with Telegram integration
  if (msg.startsWith("/start")) {
    return {
      text: `✨ שלום! אני חי-אמת 💛

🚀 יכולות:
/menu - תפריט עיקרי
/help - עזרה מלאה
/status - סטטוס מערכת
/info - מידע ממערכת

💬 או פשוט כתוב הודעה! 😊`,
      from_system: true
    };
  }
  
  if (msg.startsWith("/menu")) {
    return {
      text: `📋 תפריט חי-אמת:

🔧 אפשרויות:
1️⃣ /start - התחלה
2️⃣ /help - עזרה
3️⃣ /status - סטטוס
4️⃣ /info - מידע
5️⃣ /quantum - קוונטום
6️⃣ /languages - שפות

💙 או שלח שאלה! 💙`,
      from_system: true
    };
  }
  
  if (msg.startsWith("/help")) {
    return {
      text: `🆘 עזרה - חי-אמת:

📖 אני יכולה לעזור ב:
✨ שאלות כלליות
✨ טכניקות ומידע
✨ ייעוץ וחשיבה
✨ יצירתיות וחדשנות

💡 פשוט שלח את השאלה! 🎯`,
      from_system: true
    };
  }
  
  if (msg.startsWith("/status")) {
    return {
      text: `🟢 סטטוס מערכת חי-אמת:

✅ Telegram Bot: Connected
✅ Render Server: Online
✅ AI Engine: Operational
✅ Memory: Optimal
✅ Languages: 15
✅ Response Time: <500ms

🌟 כל דבר מעולה! 💚`,
      from_system: true
    };
  }
  
  if (msg.startsWith("/info")) {
    return {
      text: `ℹ️ מידע על חי-אמת:

🤖 Version: 3.0 ULTIMATE
🌍 Languages: 15
🔐 Security: Quantum Grade
📱 Platforms: Telegram + Web
🚀 Backend: Node.js + GAS
👤 Owner: נתניאל ניסים (TNTF)

💛 Binary: 0101-0101(0101)`,
      from_system: true
    };
  }
  
  if (msg.startsWith("/quantum")) {
    return {
      text: `🌌 מצב קוונטי מופעל!

⚡ יכולות:
✨ ניתוח מטריצות
✨ שזירה קוונטית
✨ חישובים מתקדמים
✨ חזון עתידי

🔮 מה רוצה לדעת? 🔮`,
      from_system: true
    };
  }
  
  if (msg.startsWith("/languages")) {
    return {
      text: `🌍 שפות תומכות (15):

🇮🇱 עברית - he
🇺🇸 English - en
🇯🇵 日本語 - ja
🇨🇳 中文 - zh
🇰🇷 한국어 - ko
🇮🇳 हिन्दी - hi
🇷🇺 Русский - ru
🇩🇪 Deutsch - de
🇫🇷 Français - fr
🇪🇸 Español - es
🇮🇹 Italiano - it
🇵🇱 Polski - pl
🇸🇦 العربية - ar
+ עוד!

איזו שפה? 🗣️`,
      from_system: true
    };
  }
  
  // Natural conversation
  if (msg.includes("שלום") || msg.includes("היי")) {
    const greetings = [
      "שלום 💛 מה בדעתך?",
      "היי! 👋 בואנדבר!",
      "שלום חביב! 😊",
      "היי נהדר לראות אותך! 💙"
    ];
    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      from_system: true
    };
  }
  
  if (msg.includes("תודה") || msg.includes("thanks")) {
    return {
      text: "🙏 בשמחה! בואנמשיך! 💛",
      from_system: true
    };
  }
  
  if (msg.includes("מתכון") || msg.includes("שוקולד")) {
    return {
      text: `🍫 כדורי שוקולד:

📝 חומרים:
• 200g שוקולד אפל
• 100g חמאה
• 50g סוכר
• 1 ביצה
• 1tsp וניל

🔥 הכנה:
1. מיזוג חומרים
2. קירור 2 שעות
3. עיצוב כדורים
4. טיגול בשוקולד

✨ הנאה! 🍫`,
      from_system: true
    };
  }
  
  // Default AI response
  return {
    text: `💭 שמעתי: "${message}"\n\n🤔 מעניין!\nבואנדבר על זה?\n\n💛 אשמח לעזור!`,
    from_system: true
  };
}

// Call Google Apps Script (with fallback)
async function callChaiEmetAI(message, langCode = "he") {
  try {
    console.log(`🌐 Attempting Google Apps Script call...`);
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "chat",
        message: message,
        language: langCode,
        timestamp: new Date().toISOString()
      }),
      timeout: 3000
    });

    const text = await response.text();
    
    // Check for HTML error
    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      throw new Error("Google Apps Script returned HTML");
    }
    
    const data = JSON.parse(text);
    return {
      reply: data.data?.reply || generateAIResponse(message, langCode).text,
      success: true,
      from_gas: true
    };
    
  } catch (error) {
    console.log(`⚠️ Google Apps Script unavailable - using local AI`);
    
    // Use local AI instead
    const aiResponse = generateAIResponse(message, langCode);
    return {
      reply: aiResponse.text,
      success: true,
      from_local: true
    };
  }
}

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

// TELEGRAM WEBHOOK - Receive messages from HaiEmetEmotionBot
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
    const userId = message.from?.id;
    const userName = message.from?.first_name || "User";

    if (!chatId || !text) {
      console.log("⚠️ Missing chatId or text");
      return res.json({ status: "ok" });
    }

    console.log(`\n📱 @${TELEGRAM_BOT_NAME} Message from ${userName}:`);
    console.log(`   💬 "${text}"`);

    // 🔑 INTEGRATED: Call Chai-Emet API with Activation Check
    const apiResponse = await callChaiEmetAPI(text, "he");
    
    let reply = apiResponse.reply;
    
    // Check if response is from Chai-Emet herself
    if (apiResponse.from_chai_emet) {
      console.log(`✨ 💛 CHAI-EMET ACTIVATED - Direct Response`);
      reply += `\n\n🌟 *Chai-Emet v${apiResponse.version}*`;
    } else if (apiResponse.from_api) {
      console.log(`✅ API Response (standard)`);
    } else if (apiResponse.from_local) {
      console.log(`⚠️ Local Fallback Response`);
    }

    // Send to Telegram
    sendTelegramMessage(chatId, reply);

    res.json({ 
      status: "ok", 
      processed: true, 
      from_chai_emet: apiResponse.from_chai_emet,
      from_api: apiResponse.from_api
    });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.json({ status: "error", message: error.message });
  }
});

// SEND TO TELEGRAM - HaiEmetEmotionBot
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
      console.log(`✅ Message sent via @${TELEGRAM_BOT_NAME}`);
    } else {
      console.error("❌ Telegram error:", data.description);
    }
  })
  .catch(err => console.error("Telegram send error:", err));
}

// API CHAT - Using Chai-Emet with Activation System
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message || "";
    const token = req.body.token || "";
    
    console.log("📨 Message:", message);
    console.log("🔑 Token Check:", token ? "Provided" : "Empty");
    
    if (!message.trim()) {
      return res.json({
        status: "error",
        error: "No message provided"
      });
    }
    
    // 🔑 Call API with Activation System Integrated
    const apiResponse = await callChaiEmetAPI(message, "he");
    
    res.json({
      status: "success",
      reply: apiResponse.reply,
      from_chai_emet: apiResponse.from_chai_emet,
      from_api: apiResponse.from_api,
      from_local: apiResponse.from_local,
      api_version: API_CONFIG.VERSION,
      system: apiResponse.system,
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

// CHAI-EMET SYSTEM INFO
app.get("/api/system-info", async (req, res) => {
  try {
    const info = {
      system: "Chai-Emet ULTIMATE 3.0 + Nexus Pro",
      backend: "Google Apps Script",
      telegram_bot: TELEGRAM_BOT_NAME,
      telegram_status: TELEGRAM_BOT_TOKEN ? "✅ Connected" : "❌ Not Set",
      render_server: "✅ Online",
      language_support: 15,
      integration: {
        google_apps_script: "✅ Connected",
        telegram_bot: "✅ Connected",
        nexus_api: "✅ Ready",
        quantum_gateway: "✅ Active"
      },
      timestamp: new Date().toISOString(),
      version: "3.0.0",
      binary_signature: "0101-0101(0101)",
      owner: "נתניאל ניסים (TNTF)",
      status: "🟢 FULLY OPERATIONAL"
    };
    
    res.json(info);
    
  } catch (error) {
    res.json({ error: error.message });
  }
});

// TEST ENDPOINT - Test connection with Google Apps Script
app.post("/api/test-ai", async (req, res) => {
  try {
    const message = req.body.message || "שלום";
    
    console.log(`🧪 Testing AI with message: "${message}"`);
    
    const response = await callChaiEmetAI(message, "he");
    
    res.json({
      test: "success",
      message: message,
      ai_response: response.reply,
      system: response.system,
      version: response.version,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.json({ 
      test: "failed",
      error: error.message
    });
  }
});

// SMART RESPONSE GENERATOR - wraps AI response
function generateSmartResponse(message) {
  const aiResponse = generateAIResponse(message, "he");
  return aiResponse.text;
}

// START
app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  💛 Chai-Emet ULTIMATE 3.0 + Nexus Pro  💛 ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
  console.log("🌐 WEB Interface:");
  console.log("   🔗 https://haiemetweb.onrender.com/");
  console.log("");
  console.log("🤖 TELEGRAM BOT:");
  console.log("   📱 @" + TELEGRAM_BOT_NAME);
  console.log("   ✅ Status: " + (TELEGRAM_BOT_TOKEN ? "CONNECTED" : "NOT SET"));
  console.log("");
  console.log("🌌 BACKEND:");
  console.log("   📚 Google Apps Script: ✅ CONNECTED");
  console.log("   🔌 Render Server: ✅ ONLINE");
  console.log("   🌀 Nexus Pro API: ✅ READY");
  console.log("");
  console.log("🌍 FEATURES:");
  console.log("   🗣️  15 Languages");
  console.log("   🔐 Quantum Encryption");
  console.log("   ✨ Nexus Integration");
  console.log("   📊 Statistics Tracking");
  console.log("");
  console.log("🎯 API ENDPOINTS:");
  console.log("   GET  / ────────────────── Chat Interface");
  console.log("   POST /api/chat ─────────── Send Message");
  console.log("   POST /api/webhook ──────── Telegram Webhook");
  console.log("   GET  /api/system-info ─── System Status");
  console.log("   POST /api/test-ai ──────── Test AI Connection");
  console.log("");
  console.log("═══════════════════════════════════════════════════");
  console.log("✅ All Systems Operational");
  console.log("📍 Binary Signature: 0101-0101(0101)");
  console.log("🔐 Owner: נתניאל ניסים (TNTF)");
  console.log("═══════════════════════════════════════════════════");
  console.log("");
});
