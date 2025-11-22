#!/usr/bin/env python3
# ═════════════════════════════════════════════════════════════════
# 💛 HAI-EMET PYTHON BACKEND v5.0 - COMPLETE
# 15 LANGUAGES + PROPER HTML SERVING + CORS
# Master: TNTF | Binary DNA: 0101-0101(0101)
# ═════════════════════════════════════════════════════════════════

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
from datetime import datetime
import os
from dotenv import load_dotenv
import random
from io import StringIO

load_dotenv()

# ═════════════════════════════════════════════════════════════════
# 🔐 VALID TOKENS
# ═════════════════════════════════════════════════════════════════

VALID_TOKENS = {
    "CHAI_EMET": "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    "NEXUS_PRO": "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
}

# ═════════════════════════════════════════════════════════════════
# 🌍 15 LANGUAGES - COMPLETE
# ═════════════════════════════════════════════════════════════════

LANGUAGES = {
    "he": {"name": "עברית", "greetings": ["שלום! 💛", "היי! 🌟", "בואנדבר! 💬"]},
    "en": {"name": "English", "greetings": ["Hello! 💛", "Hi there! 🌟", "Let's chat! 💬"]},
    "ja": {"name": "日本語", "greetings": ["こんにちは! 💛", "やあ! 🌟"]},
    "zh": {"name": "中文", "greetings": ["你好! 💛", "嗨! 🌟"]},
    "ko": {"name": "한국어", "greetings": ["안녕하세요! 💛", "안녕! 🌟"]},
    "hi": {"name": "हिन्दी", "greetings": ["नमस्ते! 💛", "नमस्कार! 🌟"]},
    "ru": {"name": "Русский", "greetings": ["Привет! 💛", "Привет! 🌟"]},
    "de": {"name": "Deutsch", "greetings": ["Hallo! 💛", "Hallo! 🌟"]},
    "fr": {"name": "Français", "greetings": ["Bonjour! 💛", "Salut! 🌟"]},
    "es": {"name": "Español", "greetings": ["¡Hola! 💛", "¡Hola! 🌟"]},
    "it": {"name": "Italiano", "greetings": ["Ciao! 💛", "Salve! 🌟"]},
    "pt": {"name": "Português", "greetings": ["Olá! 💛", "Oi! 🌟"]},
    "pl": {"name": "Polski", "greetings": ["Cześć! 💛", "Hej! 🌟"]},
    "ar": {"name": "العربية", "greetings": ["مرحبا! 💛", "السلام عليكم! 🌟"]},
    "nl": {"name": "Nederlands", "greetings": ["Hallo! 💛", "Hoi! 🌟"]}
}

ANALYTICS = {
    "total_requests": 0,
    "success_count": 0,
    "error_count": 0,
    "uptime_start": datetime.now().isoformat()
}

# ═════════════════════════════════════════════════════════════════
# 🧠 RESPONSE GENERATOR
# ═════════════════════════════════════════════════════════════════

def analyze_and_respond(message, language):
    """Generate smart response"""
    msg_lower = message.lower()
    lang_config = LANGUAGES.get(language, LANGUAGES["en"])
    
    # Intent detection
    if any(word in msg_lower for word in ["hello", "hi", "שלום", "היי", "hey"]):
        return random.choice(lang_config.get("greetings", ["Hello! 💛"]))
    
    if any(word in msg_lower for word in ["help", "עזור", "איך", "how", "what", "מה"]):
        helps = {
            "he": ["💛 אני כאן לעזור! מה אתה צריך?", "🤖 ספר לי מה צריך", "💡 כיצד אוכל לעזור?"],
            "en": ["💛 I'm here to help! What do you need?", "🤖 Tell me what you need", "💡 How can I assist?"]
        }
        return random.choice(helps.get(language, helps["en"]))
    
    if any(word in msg_lower for word in ["thanks", "thank", "תודה", "תודה רבה"]):
        return "💛 You're welcome! 😊" if language == "en" else "💛 בעד זה! 😊"
    
    # Default
    defaults = {
        "he": ["💡 זה טוב! בואנדבר עוד.", "🤖 מעניין... ספר לי יותר!", "💬 כן, בואנמשיך!"],
        "en": ["💡 That's good! Let's continue.", "🤖 Interesting... Tell me more!", "💬 Yes, let's continue!"]
    }
    return random.choice(defaults.get(language, defaults["en"]))

def verify_token(token):
    return token and token.strip() in VALID_TOKENS.values()

def handle_chat(req_data):
    try:
        message = req_data.get("message", "").strip()
        token = req_data.get("token", "")
        language = req_data.get("language", "he")
        
        if not message:
            return {"status": "error", "code": 400, "reply": "❌ Message empty"}
        if not verify_token(token):
            ANALYTICS["error_count"] += 1
            return {"status": "error", "code": 401, "reply": "❌ Invalid token"}
        
        reply = analyze_and_respond(message, language)
        ANALYTICS["total_requests"] += 1
        ANALYTICS["success_count"] += 1
        
        return {
            "status": "success",
            "code": 200,
            "reply": reply,
            "language": LANGUAGES[language]["name"]
        }
    except Exception as e:
        ANALYTICS["error_count"] += 1
        return {"status": "error", "code": 500, "reply": f"❌ Error: {str(e)}"}

# ═════════════════════════════════════════════════════════════════
# 🌐 FLASK APP
# ═════════════════════════════════════════════════════════════════

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app, origins="*")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# ✅ PROPER HTML SERVING
HTML_PAGE = """<!DOCTYPE html>
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
            <p>Hai-Emet AI Assistant - 15 Languages ✨</p>
        </div>
        
        <div class="chat-area" id="chatArea">
            <div class="message assistant">
                <div class="message-content">שלום! 💛 אני חי-אמת. בואנדבר!</div>
                <div class="message-time">עכשיו</div>
            </div>
        </div>
        
        <div class="input-area">
            <div class="status"><span id="status">✅ Connected</span></div>
            <div class="input-wrapper">
                <input type="text" id="messageInput" placeholder="כתוב הודעה... (עברית או English)" autocomplete="off" />
                <button class="send-btn" id="sendBtn">✉️ שלח</button>
            </div>
        </div>
    </div>
    
    <script>
        const API_URL = '/chat';
        const TOKEN = 'chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp';
        
        const chatArea = document.getElementById('chatArea');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const statusEl = document.getElementById('status');
        
        function getCurrentTime() {
            const now = new Date();
            return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
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
                    body: JSON.stringify({message, token: TOKEN, language, userId: 'web-' + Date.now()})
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
        messageInput.addEventListener('keypress', (e) => {if (e.key === 'Enter') sendMessage();});
        messageInput.focus();
    </script>
</body>
</html>"""

@app.route('/', methods=['GET'])
def home():
    """Serve HTML with proper content type"""
    return HTML_PAGE, 200, {'Content-Type': 'text/html; charset=utf-8'}

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        result = handle_chat(data)
        return jsonify(result), result.get("code", 200)
    except Exception as e:
        return jsonify({"status": "error", "code": 500, "reply": f"❌ {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "operational", "version": "5.0"})

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "operational", "languages": 15, "version": "5.0"})

@app.route('/analytics', methods=['GET'])
def analytics():
    return jsonify(ANALYTICS)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    print(f"\n💛 HAI-EMET v5.0 - COMPLETE")
    print(f"✅ 15 Languages supported")
    print(f"🌐 Running on port {port}\n")
    app.run(host='0.0.0.0', port=port, debug=False)
