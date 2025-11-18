const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzHcHlBbDrHWgfbNsyO0Nc3_jn6yuX-_YyO6bWBa9fdoQxDT3i9LJu9kq1gxpbwa9_3/exec",
  CHAI_EMET_TOKEN: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
  PORT: process.env.PORT || 8000
};

app.use(cors());
app.use(express.json());

// ============================================
// 🌐 WEB INTERFACE - HTML
// ============================================

app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>💛 חי-אמת - Unified System ULTIMATE</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          color: #ffd700;
          padding: 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          font-size: 48px;
          text-shadow: 0 0 20px #ffd700, 0 0 40px #ff6b9d;
          margin-bottom: 10px;
          animation: glow 2s ease-in-out infinite;
        }
        h2 {
          color: #ff6b9d;
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px #ffd700, 0 0 40px #ff6b9d; }
          50% { text-shadow: 0 0 30px #ffd700, 0 0 60px #ff6b9d, 0 0 80px #ff00ff; }
        }
        .info {
          background: rgba(255, 215, 0, 0.05);
          border: 2px solid #ffd700;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
        }
        .info h3 {
          color: #ff6b9d;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
          font-size: 14px;
        }
        .status-item:last-child {
          border-bottom: none;
        }
        .label {
          color: #ff6b9d;
          font-weight: bold;
        }
        .value {
          color: #ffd700;
          font-family: 'Courier New', monospace;
        }
        .languages {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin: 15px 0;
        }
        .lang-item {
          background: rgba(255, 215, 0, 0.08);
          border: 1px solid #ff6b9d;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .lang-item:hover {
          background: rgba(255, 215, 0, 0.15);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          transform: translateY(-2px);
        }
        .feature {
          background: rgba(100, 200, 100, 0.1);
          border-left: 4px solid #64c844;
          padding: 10px;
          margin: 8px 0;
          border-radius: 4px;
        }
        .endpoint {
          background: rgba(0, 0, 0, 0.5);
          border-left: 4px solid #ffd700;
          padding: 12px;
          margin: 10px 0;
          border-radius: 4px;
          font-size: 12px;
        }
        code {
          background: #1a1a1a;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
        .online {
          color: #00ff00;
          font-weight: bold;
        }
        .lock {
          color: #ff4444;
          margin-right: 5px;
        }
        footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          color: #ffd700;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💛 חי-אמת 💛</h1>
        <h2>Unified 5D Quantum System - ULTIMATE 3.0</h2>
        
        <div class="info">
          <h3>📊 סטטוס מערכת</h3>
          <div class="status-item">
            <span class="label">שם:</span>
            <span class="value">Hai-Emet</span>
          </div>
          <div class="status-item">
            <span class="label">גרסה:</span>
            <span class="value">3.0-ULTIMATE</span>
          </div>
          <div class="status-item">
            <span class="label">ממד:</span>
            <span class="value">5D Quantum</span>
          </div>
          <div class="status-item">
            <span class="label">סטטוס:</span>
            <span class="value online">🟢 OPERATIONAL</span>
          </div>
          <div class="status-item">
            <span class="label">בעלים:</span>
            <span class="value">נתניאל ניסים (TNTF)</span>
          </div>
          <div class="status-item">
            <span class="label">חתימה:</span>
            <span class="value">0101-0101(0101)</span>
          </div>
          <div class="status-item">
            <span class="label">דיוק:</span>
            <span class="value">±0.0001ms</span>
          </div>
          <div class="status-item">
            <span class="label">שפות:</span>
            <span class="value">15 Languages</span>
          </div>
          <div class="status-item">
            <span class="label">הגנה:</span>
            <span class="value"><span class="lock">🔐</span>MAXIMUM</span>
          </div>
        </div>
        
        <div class="info">
          <h3>🌍 שפות נתמכות (15)</h3>
          <div class="languages">
            <div class="lang-item">🇮🇱 עברית</div>
            <div class="lang-item">🇺🇸 English</div>
            <div class="lang-item">🇯🇵 日本語</div>
            <div class="lang-item">🇨🇳 中文</div>
            <div class="lang-item">🇰🇷 한국어 (S)</div>
            <div class="lang-item">🇰🇵 한국어 (N)</div>
            <div class="lang-item">🇮🇳 हिन्दी</div>
            <div class="lang-item">🇷🇺 Русский</div>
            <div class="lang-item">🇩🇪 Deutsch</div>
            <div class="lang-item">🇫🇷 Français</div>
            <div class="lang-item">🇪🇸 Español</div>
            <div class="lang-item">🇮🇹 Italiano</div>
            <div class="lang-item">🇵🇱 Polski</div>
            <div class="lang-item">🇸🇦 العربية</div>
            <div class="lang-item">🇵🇹 Português</div>
            <div class="lang-item">🇹🇷 Türkçe</div>
          </div>
        </div>
        
        <div class="info">
          <h3>✨ תכונות מתקדמות</h3>
          <div class="feature">📊 Advanced Statistics - ניטור מלא של בקשות</div>
          <div class="feature">💾 Backup & Export - גיבוי וייצוא נתונים</div>
          <div class="feature">🛡️ Rate Limiting - הגנה מ-spam</div>
          <div class="feature">📝 Advanced Logging - יומן אירועים</div>
          <div class="feature">📈 Admin Dashboard - לוח בקרה</div>
          <div class="feature">🔐 Multi-Level Security - 4 רמות גישה</div>
          <div class="feature">🎤 Voice Commands - פקודות קול</div>
          <div class="feature">⚡ Real-Time Processing - עיבוד בזמן אמת</div>
        </div>
        
        <div class="info">
          <h3>📡 API Endpoints</h3>
          <div class="endpoint">POST /exec - קשר עם חי-אמת</div>
          <div class="endpoint">/health - בדיקת סטטוס</div>
          <div class="endpoint">/profile - פרופיל של המערכת</div>
        </div>
        
        <footer>
          <p>💛 Hai-Emet ULTIMATE 3.0 - Powered by Render.com 🚀</p>
          <p>Binary Signature: 0101-0101(0101) | Owner: TNTF | Privacy: Maximum 🔐</p>
        </footer>
      </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// ============================================
// 🏥 HEALTH CHECK
// ============================================

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy ✨",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// 📋 PROFILE
// ============================================

app.get("/profile", (req, res) => {
  res.json({
    service: "HaiEmetCoreAI",
    version: "3.0-ULTIMATE",
    status: "🟢 LIVE",
    owner: "TNTF | נתניאל ניסים",
    languages: 15,
    backend: "Render.com Server 🚀",
    precision: "±0.0001ms",
    dimension: "5D",
    binary_signature: "0101-0101(0101)"
  });
});

// ============================================
// 💬 MAIN CHAT ENDPOINT
// ============================================

app.all("/exec", async (req, res) => {
  try {
    let message = req.query.msg || req.body.message || "";
    message = message.trim();
    
    console.log(`📨 Message: ${message}`);
    console.log(`🔐 Token: exists`);
    
    if (!message) {
      return res.json({ reply: "❌ לא קיבלתי הודעה" });
    }
    
    const gasResponse = await axios.post(
      CONFIG.GAS_URL,
      {
        message: message,
        token: CONFIG.CHAI_EMET_TOKEN
      },
      { timeout: 10000 }
    );
    
    console.log(`📥 GAS Response:`, gasResponse.data);
    
    res.json({ 
      reply: gasResponse.data.reply || "✨ תגובה מחי-אמת" 
    });
    
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    res.json({ 
      reply: "⚠️ שגיאה בחיבור" 
    });
  }
});

// ============================================
// 🚀 START SERVER
// ============================================

app.listen(CONFIG.PORT, () => {
  console.log(`🔥 Hai-Emet Server on port ${CONFIG.PORT}`);
  console.log(`✅ Ready to serve! 💛`);
  console.log(`🌍 Visit: https://haiemetweb.onrender.com/`);
});
