#!/usr/bin/env python3
# ═════════════════════════════════════════════════════════════════
# 💛 HAI-EMET PYTHON BACKEND v4.0 - FINAL & COMPLETE
# Direct HTML serving - NO Template folder needed!
# Master: TNTF | Binary DNA: 0101-0101(0101)
# ═════════════════════════════════════════════════════════════════

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import os
from dotenv import load_dotenv
import random

load_dotenv()

# ═════════════════════════════════════════════════════════════════
# 🔐 VALID TOKENS
# ═════════════════════════════════════════════════════════════════

VALID_TOKENS = {
    "CHAI_EMET": "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    "NEXUS_PRO": "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
}

# ═════════════════════════════════════════════════════════════════
# 🌍 15 LANGUAGES
# ═════════════════════════════════════════════════════════════════

LANGUAGES = {
    "he": {
        "name": "עברית",
        "greetings": ["שלום! 💛", "היי! 🌟", "בואנדבר! 💬"],
        "help_responses": [
            "💛 אני כאן לעזור! מה אתה צריך?",
            "🤖 אנא ספר לי - איך אוכל לעזור?",
            "💡 מהו השאלה שלך?"
        ]
    },
    "en": {
        "name": "English",
        "greetings": ["Hello! 💛", "Hi there! 🌟", "Let's chat! 💬"],
        "help_responses": [
            "💛 I'm here to help! What do you need?",
            "🤖 Please tell me - how can I assist?",
            "💡 What is your question?"
        ]
    }
}

ANALYTICS = {
    "total_requests": 0,
    "success_count": 0,
    "error_count": 0,
    "uptime_start": datetime.now().isoformat()
}

# ═════════════════════════════════════════════════════════════════
# 🧠 MESSAGE ANALYSIS & RESPONSE
# ═════════════════════════════════════════════════════════════════

def analyze_and_respond(message, language):
    """Analyze message and generate response"""
    
    msg_lower = message.lower()
    lang_config = LANGUAGES.get(language, LANGUAGES["en"])
    
    # Intent detection
    if any(word in msg_lower for word in ["hello", "hi", "שלום", "היי", "hey"]):
        return random.choice(lang_config.get("greetings", ["Hello! 💛"]))
    
    if any(word in msg_lower for word in ["help", "עזור", "איך", "how", "what", "מה"]):
        return random.choice(lang_config.get("help_responses", ["I'm here to help!"]))
    
    if any(word in msg_lower for word in ["תודה", "thanks", "thank", "great", "excellent"]):
        return "💛 You're welcome! 😊" if language == "en" else "💛 בעד זה! 😊"
    
    # Default responses
    default_responses = {
        "he": [
            "💡 זה הערה טובה! בואנדבר עוד.",
            "🤖 אני מבינה. המשיכי בבקשה!",
            "💬 תגידי לי עוד על זה."
        ],
        "en": [
            "💡 That's a good point! Let's discuss more.",
            "🤖 I understand. Please continue!",
            "💬 Tell me more about that."
        ]
    }
    
    resp_list = default_responses.get(language, default_responses["en"])
    return random.choice(resp_list)

# ═════════════════════════════════════════════════════════════════
# 🔐 TOKEN VERIFICATION
# ═════════════════════════════════════════════════════════════════

def verify_token(token):
    """Verify token"""
    if not token:
        return False
    return token.strip() in VALID_TOKENS.values()

# ═════════════════════════════════════════════════════════════════
# 💬 CHAT HANDLER
# ═════════════════════════════════════════════════════════════════

def handle_chat(req_data):
    """Handle chat message"""
    start_time = datetime.now()
    
    try:
        message = req_data.get("message", "").strip()
        token = req_data.get("token", "")
        language = req_data.get("language", "he")
        
        if not message:
            return {"status": "error", "code": 400, "reply": "❌ Message is empty"}
        
        if not verify_token(token):
            ANALYTICS["error_count"] += 1
            return {"status": "error", "code": 401, "reply": "❌ Invalid token"}
        
        reply = analyze_and_respond(message, language)
        
        ANALYTICS["total_requests"] += 1
        ANALYTICS["success_count"] += 1
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "status": "success",
            "code": 200,
            "reply": reply,
            "language": LANGUAGES[language]["name"],
            "duration": f"{duration:.0f}ms",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        ANALYTICS["error_count"] += 1
        return {"status": "error", "code": 500, "reply": f"❌ Error: {str(e)}"}

# ═════════════════════════════════════════════════════════════════
# 🌐 FLASK APP
# ═════════════════════════════════════════════════════════════════

app = Flask(__name__, static_folder='static', static_url_path='/static')

# CORS
CORS(app, origins="*", allow_headers=["Content-Type"], methods=["GET", "POST", "OPTIONS"])

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

print("\n╔════════════════════════════════════════════════════════╗")
print("║   💛 HAI-EMET v4.0 STARTING                          ║")
print("║   ✅ Direct HTML serving (NO templates folder)       ║")
print("║   ✅ CORS ENABLED                                    ║")
print("╚════════════════════════════════════════════════════════╝\n")

# ═════════════════════════════════════════════════════════════════
# 📡 API ROUTES
# ═════════════════════════════════════════════════════════════════

# HTML content (inline)
HTML_CONTENT = """<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💛 חי-אמת | Hai-Emet AI</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💛 חי-אמת</h1>
            <p>Hai-Emet AI Assistant - 15 Languages</p>
        </div>
        
        <div class="chat-area" id="chatArea">
            <div class="message assistant">
                <div class="message-content">
                    שלום! 💛 אני חי-אמת. בואנדבר!
                </div>
                <div class="message-time">עכשיו</div>
            </div>
        </div>
        
        <div class="input-area">
            <div class="status">
                <span id="status">✅ Connected</span>
            </div>
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="messageInput" 
                    placeholder="כתוב הודעה... (עברית או English)"
                    autocomplete="off"
                />
                <button class="send-btn" id="sendBtn">✉️ שלח</button>
            </div>
        </div>
    </div>
    
    <script>
        console.log('✅ Hai-Emet Chat Interface Loaded!');
        
        const API_URL = '/chat';
        const TOKEN = 'chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp';
        
        const chatArea = document.getElementById('chatArea');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const statusEl = document.getElementById('status');
        
        function getCurrentTime() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
        
        function detectLanguage(text) {
            const hebrewRegex = /[\u0590-\u05FF]/g;
            const hebrewChars = text.match(hebrewRegex) || [];
            return hebrewChars.length > text.length / 2 ? 'he' : 'en';
        }
        
        function addMessage(text, isUser = false) {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${isUser ? 'user' : 'assistant'}`;
            
            const contentEl = document.createElement('div');
            contentEl.className = 'message-content';
            contentEl.textContent = text;
            
            const timeEl = document.createElement('div');
            timeEl.className = 'message-time';
            timeEl.textContent = getCurrentTime();
            
            messageEl.appendChild(contentEl);
            messageEl.appendChild(timeEl);
            
            chatArea.appendChild(messageEl);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;
            
            addMessage(message, true);
            messageInput.value = '';
            
            statusEl.innerHTML = '<span class="loading"></span> שולח...';
            
            try {
                const language = detectLanguage(message);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: JSON.stringify({
                        message: message,
                        token: TOKEN,
                        language: language,
                        userId: 'web-' + Date.now()
                    })
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    addMessage(data.reply, false);
                    statusEl.textContent = '✅ Connected';
                } else {
                    addMessage('❌ ' + (data.reply || 'שגיאה'), false);
                    statusEl.textContent = '⚠️ Error';
                }
            } catch (error) {
                addMessage('❌ Connection error', false);
                statusEl.textContent = '❌ Disconnected';
            }
        }
        
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        
        messageInput.focus();
    </script>
</body>
</html>"""

@app.route('/', methods=['GET'])
def home():
    """Serve HTML directly"""
    return HTML_CONTENT, 200, {'Content-Type': 'text/html; charset=utf-8'}

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    """Chat endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        result = handle_chat(data)
        return jsonify(result), result.get("code", 200)
    except Exception as e:
        ANALYTICS["error_count"] += 1
        return jsonify({"status": "error", "code": 500, "reply": f"❌ {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "operational", "service": "hai-emet-v4"})

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "status": "operational",
        "system": "Hai-Emet",
        "version": "4.0",
        "binary_signature": "0101-0101(0101)"
    })

@app.route('/analytics', methods=['GET'])
def analytics():
    return jsonify(ANALYTICS)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    print(f"✅ Server running on port {port}")
    print(f"🌐 https://haiemetweb.onrender.com\n")
    app.run(host='0.0.0.0', port=port, debug=False)
