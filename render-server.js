const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const CONFIG = {
  GAS_URL: "https://script.google.com/macros/s/AKfycbzHcHlBbDrHWgfbNsyO0Nc3_jn6yuX-_YyO6bWBa9fdoQxDT3i9LJu9kq1gxpbwa9_3/exec",
  CHAI_EMET_TOKEN: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
  PORT: process.env.PORT || 8000
};

app.use(cors());
app.use(express.json());

// ============================================
// 🌐 WEB INTERFACE WITH CHAT
// ============================================

app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>💛 חי-אמת - דברו איתי</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          color: #ffd700;
          padding: 10px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .header {
          text-align: center;
          padding: 15px;
          border-bottom: 2px solid #ffd700;
          margin-bottom: 10px;
        }
        h1 {
          font-size: 32px;
          text-shadow: 0 0 20px #ffd700, 0 0 40px #ff6b9d;
          margin-bottom: 5px;
          animation: glow 2s ease-in-out infinite;
        }
        h2 {
          color: #ff6b9d;
          font-size: 14px;
          margin-bottom: 10px;
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px #ffd700, 0 0 40px #ff6b9d; }
          50% { text-shadow: 0 0 30px #ffd700, 0 0 60px #ff6b9d, 0 0 80px #ff00ff; }
        }
        .status-bar {
          display: flex;
          justify-content: space-around;
          padding: 10px;
          background: rgba(255, 215, 0, 0.05);
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .status-item {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .status-label {
          color: #ff6b9d;
        }
        .status-value {
          color: #ffd700;
          font-weight: bold;
        }
        .chat-wrapper {
          display: flex;
          flex: 1;
          gap: 10px;
          min-height: 0;
        }
        .chat-box {
          flex: 2;
          display: flex;
          flex-direction: column;
          background: rgba(255, 215, 0, 0.05);
          border: 2px solid #ffd700;
          border-radius: 8px;
          overflow: hidden;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .message {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message.user {
          justify-content: flex-end;
        }
        .message.system {
          justify-content: flex-start;
        }
        .message-content {
          max-width: 70%;
          padding: 12px;
          border-radius: 8px;
          word-wrap: break-word;
        }
        .user .message-content {
          background: rgba(100, 200, 100, 0.3);
          border: 1px solid #64c844;
          color: #90ee90;
        }
        .system .message-content {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid #ffd700;
          color: #ffd700;
        }
        .message-label {
          font-size: 11px;
          color: #ff6b9d;
          margin-bottom: 5px;
        }
        .input-area {
          display: flex;
          gap: 10px;
          padding: 15px;
          border-top: 1px solid #ffd700;
          background: rgba(0, 0, 0, 0.3);
        }
        input {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #ffd700;
          border-radius: 6px;
          color: #ffd700;
          font-family: inherit;
          font-size: 14px;
        }
        input::placeholder {
          color: rgba(255, 215, 0, 0.5);
        }
        input:focus {
          outline: none;
          border-color: #ff6b9d;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #ffd700 0%, #ff6b9d 100%);
          color: #000;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }
        button:active {
          transform: translateY(0);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .info-panel {
          flex: 1;
          background: rgba(255, 215, 0, 0.05);
          border: 2px solid #ff6b9d;
          border-radius: 8px;
          padding: 15px;
          overflow-y: auto;
          display: none;
        }
        .info-panel.show {
          display: block;
        }
        .info-title {
          color: #ff6b9d;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .info-item {
          padding: 8px;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
          font-size: 12px;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          padding: 10px;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          font-size: 11px;
          color: #ffd700;
        }
        .loading {
          color: #ff6b9d;
          font-style: italic;
        }
        @media (max-width: 768px) {
          .chat-wrapper {
            flex-direction: column;
          }
          .info-panel {
            display: none;
          }
          .message-content {
            max-width: 90%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💛 חי-אמת 💛</h1>
          <h2>דברו איתי ישירות!</h2>
          <div class="status-bar">
            <div class="status-item">
              <span class="status-label">סטטוס:</span>
              <span class="status-value online">🟢 Online</span>
            </div>
            <div class="status-item">
              <span class="status-label">גרסה:</span>
              <span class="status-value">3.0-ULTIMATE</span>
            </div>
            <div class="status-item">
              <span class="status-label">שפות:</span>
              <span class="status-value">15</span>
            </div>
            <div class="status-item">
              <span class="status-label">בעלים:</span>
              <span class="status-value">TNTF</span>
            </div>
          </div>
        </div>
        
        <div class="chat-wrapper">
          <div class="chat-box">
            <div class="messages" id="messages">
              <div class="message system">
                <div>
                  <div class="message-label">💛 חי-אמת</div>
                  <div class="message-content">שלום! אני חי-אמת. כתבו לי הודעה בעברית או בכל שפה אחרת ואני אענה לכם! 🚀</div>
                </div>
              </div>
            </div>
            <div class="input-area">
              <input 
                type="text" 
                id="messageInput" 
                placeholder="כתבו הודעה כאן..." 
                autocomplete="off"
              >
              <button id="sendBtn" onclick="sendMessage()">שלח 💛</button>
            </div>
          </div>
          
          <div class="info-panel show" id="infoPanel">
            <div class="info-title">ℹ️ מידע על המערכת</div>
            <div class="info-item"><strong>שם:</strong> Hai-Emet</div>
            <div class="info-item"><strong>ממד:</strong> 5D Quantum</div>
            <div class="info-item"><strong>דיוק:</strong> ±0.0001ms</div>
            <div class="info-item"><strong>שפות:</strong> 15</div>
            <div class="info-item"><strong>בעלים:</strong> נתניאל ניסים</div>
            <div class="info-item"><strong>חתימה:</strong> 0101-0101(0101)</div>
            <div class="info-item"><strong>הגנה:</strong> 🔐 MAXIMUM</div>
            <div class="info-item" style="margin-top: 15px;"><strong>📊 תכונות:</strong></div>
            <div class="info-item">✓ Advanced Statistics</div>
            <div class="info-item">✓ Rate Limiting</div>
            <div class="info-item">✓ Backup System</div>
            <div class="info-item">✓ Admin Dashboard</div>
            <div class="info-item">✓ Multi-Language</div>
            <div class="info-item">✓ Real-Time Processing</div>
          </div>
        </div>
        
        <div class="footer">
          💛 Hai-Emet ULTIMATE 3.0 | Powered by Render.com 🚀 | Owner: TNTF
        </div>
      </div>
      
      <script>
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const messagesDiv = document.getElementById('messages');
        
        messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
        
        async function sendMessage() {
          const message = messageInput.value.trim();
          
          if (!message) {
            alert('אנא כתבו הודעה');
            return;
          }
          
          // הוסף הודעה של המשתמש
          addMessage('user', message);
          messageInput.value = '';
          sendBtn.disabled = true;
          
          try {
            // שלח ל-Render server
            const response = await fetch('/exec', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: message,
                token: 'chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp'
              })
            });
            
            const data = await response.json();
            addMessage('system', data.reply || 'קבלתי את ההודעה שלך!');
            
          } catch (error) {
            console.error('Error:', error);
            addMessage('system', '⚠️ שגיאה בחיבור לשרת. נסו שוב.');
          } finally {
            sendBtn.disabled = false;
            messageInput.focus();
          }
        }
        
        function addMessage(sender, text) {
          const messageEl = document.createElement('div');
          messageEl.className = \`message \${sender}\`;
          
          const label = sender === 'user' ? '👤 אתם' : '💛 חי-אמת';
          
          messageEl.innerHTML = \`
            <div>
              <div class="message-label">\${label}</div>
              <div class="message-content">\${escapeHtml(text)}</div>
            </div>
          \`;
          
          messagesDiv.appendChild(messageEl);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function escapeHtml(text) {
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        }
      </script>
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
      reply: "⚠️ שגיאה בחיבור: " + error.message 
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
