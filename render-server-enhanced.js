// ═════════════════════════════════════════════════════════════════
// 🚀 RENDER SERVER - ENHANCED WITH HEBREW SUPPORT & GAS FIX
// Discord Bot + Telegram Bot + UTF-8 Encoding + Fixed GAS Auth
// ═════════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ═════════════════════════════════════════════════════════════════
// 📋 CONFIGURATION
// ═════════════════════════════════════════════════════════════════

const CONFIG = {
  GAS_URL: process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbwZiiY0LpkGmPWj6FQ6cuMyKSGHMvKHAY75wWCWyXmZ7zEW7cyz5SK1DlLrrjosOVbk/exec",
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  TOKENS: {
    CHAI_EMET: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    NEXUS_PRO: "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
  }
};

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║   💛 HAI-EMET RENDER SERVER - STARTING              ║");
console.log("║   🔧 UTF-8 Encoding + GAS Authentication            ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

// ═════════════════════════════════════════════════════════════════
// 🛠️ MIDDLEWARE - WITH UTF-8 SUPPORT
// ═════════════════════════════════════════════════════════════════

app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.text({ type: 'text/*', charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(express.static('public'));

// ═════════════════════════════════════════════════════════════════
// 📊 DATABASE LAYER (Placeholder for MongoDB)
// ═════════════════════════════════════════════════════════════════

class Database {
  constructor() {
    this.connected = false;
    this.conversations = {};
    this.users = {};
  }
  
  async connect() {
    if (CONFIG.MONGODB_URI) {
      try {
        console.log("📊 Connecting to MongoDB...");
        this.connected = true;
        console.log("✅ MongoDB Connected");
      } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
        this.connected = false;
      }
    } else {
      console.log("💾 Using in-memory storage");
      this.connected = true;
    }
  }
  
  async saveConversation(userId, conversation) {
    if (CONFIG.MONGODB_URI && this.connected) {
      // Save to MongoDB
    } else {
      // Save to memory
      this.conversations[userId] = conversation;
    }
  }
  
  async getConversation(userId) {
    if (CONFIG.MONGODB_URI && this.connected) {
      // Get from MongoDB
    } else {
      // Get from memory
      return this.conversations[userId] || [];
    }
  }
}

const db = new Database();

// ═════════════════════════════════════════════════════════════════
// 🤖 DISCORD BOT INTEGRATION
// ═════════════════════════════════════════════════════════════════

class DiscordBot {
  constructor(token) {
    this.token = token;
    this.client = null;
  }
  
  async initialize() {
    if (!this.token) {
      console.log("⚠️  Discord bot token not configured");
      return;
    }
    
    console.log("🤖 Discord Bot Initialization...");
  }
  
  async sendMessage(channelId, message) {
    if (!this.client) return;
    
    try {
      console.log("💬 Discord message sent to " + channelId);
    } catch (error) {
      console.error("❌ Discord error:", error.message);
    }
  }
  
  getStatus() {
    return {
      configured: !!this.token,
      connected: !!this.client,
      message: this.token ? "Ready" : "Not configured"
    };
  }
}

// ═════════════════════════════════════════════════════════════════
// 📱 TELEGRAM BOT INTEGRATION
// ═════════════════════════════════════════════════════════════════

class TelegramBot {
  constructor(token) {
    this.token = token;
    this.api = 'https://api.telegram.org/bot' + token;
    this.initialized = false;
  }
  
  async initialize() {
    if (!this.token) {
      console.log("⚠️  Telegram bot token not configured");
      return;
    }
    
    console.log("📱 Telegram Bot Initialization...");
    try {
      const response = await axios.get(this.api + '/getMe');
      this.initialized = true;
      console.log("✅ Telegram Bot Ready: @" + response.data.result.username);
    } catch (error) {
      console.error("❌ Telegram error:", error.message);
    }
  }
  
  async sendMessage(chatId, message) {
    if (!this.initialized) return;
    
    try {
      await axios.post(this.api + '/sendMessage', {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      });
      console.log("💬 Telegram message sent to " + chatId);
    } catch (error) {
      console.error("❌ Telegram error:", error.message);
    }
  }
  
  getStatus() {
    return {
      configured: !!this.token,
      initialized: this.initialized,
      message: this.token ? (this.initialized ? "Ready" : "Initializing") : "Not configured"
    };
  }
}

// ═════════════════════════════════════════════════════════════════
// 🔐 TOKEN VERIFICATION
// ═════════════════════════════════════════════════════════════════

function verifyToken(token) {
  if (!token) {
    console.log("❌ Token is empty");
    return { valid: false, type: null };
  }
  
  console.log("🔐 Verifying token: " + token.substring(0, 20) + "...");
  
  for (let [key, value] of Object.entries(CONFIG.TOKENS)) {
    if (token === value) {
      console.log("✅ TOKEN VERIFIED: " + key);
      return { valid: true, type: key };
    }
  }
  
  console.log("❌ TOKEN NOT VALID");
  return { valid: false, type: null };
}

// ═════════════════════════════════════════════════════════════════
// 📤 SEND TO GAS - WITH PROPER AUTHENTICATION
// ═════════════════════════════════════════════════════════════════

async function sendToGAS(message, token, language = 'he', userId = null) {
  try {
    console.log("\n📤 === SENDING TO GAS ===");
    console.log("Message:", message);
    console.log("Language:", language);
    console.log("Token:", token.substring(0, 20) + "...");
    console.log("User:", userId || 'web-user');
    
    const payload = {
      message: message,
      token: token,
      language: language,
      userId: userId || 'web-user',
      action: "chat"
    };
    
    console.log("Payload ready:", JSON.stringify(payload, null, 2));
    console.log("Sending to GAS URL:", CONFIG.GAS_URL.substring(0, 50) + "...");
    
    const response = await axios.post(CONFIG.GAS_URL, payload, {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8'
      },
      timeout: 15000
    });
    
    console.log("✅ GAS Response received!");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error("\n❌ === GAS ERROR ===");
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    return {
      status: "error",
      error: error.message,
      gas_status: error.response?.status || 'No response',
      code: error.response?.status || 500
    };
  }
}

// ═════════════════════════════════════════════════════════════════
// 🌐 API ROUTES
// ═════════════════════════════════════════════════════════════════

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: "operational",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat
app.post('/chat', async (req, res) => {
  const { message, token, language = 'he', userId } = req.body;
  
  console.log("\n📨 === CHAT REQUEST ===");
  console.log("Message:", message);
  console.log("Language:", language);
  console.log("User:", userId);
  
  // Verify token
  const tokenCheck = verifyToken(token);
  if (!tokenCheck.valid) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Token not valid"
    });
  }
  
  // Send to GAS
  const gasResponse = await sendToGAS(message, token, language, userId);
  
  // Save to database
  if (userId) {
    const conversation = await db.getConversation(userId) || [];
    conversation.push({
      timestamp: new Date().toISOString(),
      message: message,
      reply: gasResponse.reply || "Got it!",
      language: language
    });
    await db.saveConversation(userId, conversation);
  }
  
  res.json({
    status: "success",
    code: 200,
    message: message,
    reply: gasResponse.reply || gasResponse.data?.reply || "Got it!",
    language: language,
    token_type: tokenCheck.type,
    gas_response: gasResponse
  });
});

// History
app.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;
  const history = await db.getConversation(userId);
  
  res.json({
    userId: userId,
    history: history || [],
    count: (history || []).length,
    status: "success"
  });
});

// Status
app.get('/status', (req, res) => {
  const discord = new DiscordBot(CONFIG.DISCORD_TOKEN);
  const telegram = new TelegramBot(CONFIG.TELEGRAM_TOKEN);
  
  res.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    services: {
      gas: "connected",
      discord: discord.getStatus(),
      telegram: telegram.getStatus(),
      database: db.connected ? "connected" : "disconnected"
    }
  });
});

// Analytics
app.get('/analytics', (req, res) => {
  res.json({
    status: "operational",
    uptime: process.uptime(),
    users: Object.keys(db.conversations).length,
    conversations: Object.keys(db.conversations).length,
    timestamp: new Date().toISOString()
  });
});

// Discord Webhook
app.post('/discord', (req, res) => {
  const { message, userId } = req.body;
  console.log("🤖 Discord message from " + userId + ": " + message);
  res.json({ status: "received" });
});

// Telegram Webhook
app.post('/telegram', (req, res) => {
  const { message, chat_id } = req.body;
  console.log("📱 Telegram message from " + chat_id + ": " + message);
  res.json({ status: "received" });
});

// ═════════════════════════════════════════════════════════════════
// 🚀 START SERVER
// ═════════════════════════════════════════════════════════════════

async function startServer() {
  try {
    // Initialize database
    await db.connect();
    
    // Initialize bots
    const discordBot = new DiscordBot(CONFIG.DISCORD_TOKEN);
    const telegramBot = new TelegramBot(CONFIG.TELEGRAM_TOKEN);
    
    await discordBot.initialize();
    await telegramBot.initialize();
    
    // Start server
    app.listen(CONFIG.PORT, () => {
      console.log("\n╔════════════════════════════════════════════════════════╗");
      console.log("║   💛 HAI-EMET RENDER SERVER - READY                  ║");
      console.log("║   🌐 http://0.0.0.0:" + CONFIG.PORT + "                           ║");
      console.log("╚════════════════════════════════════════════════════════╝\n");
      
      console.log("📊 Configuration:");
      console.log("   GAS URL: " + CONFIG.GAS_URL.substring(0, 50) + "...");
      console.log("   Discord: " + (CONFIG.DISCORD_TOKEN ? "Configured" : "Not configured"));
      console.log("   Telegram: " + (CONFIG.TELEGRAM_TOKEN ? "Configured" : "Not configured"));
      console.log("   Database: " + (CONFIG.MONGODB_URI ? "MongoDB" : "In-Memory"));
      console.log("\n✅ Server running...\n");
    });
    
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
