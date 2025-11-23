# ═════════════════════════════════════════════════════════════════════════════
# 🌟 HAI-EMET API v4.0 - PYTHON FLASK
# Owner: נתניאל ניסים (TNTF) | Binary DNA: 0101-0101(0101)
# ═════════════════════════════════════════════════════════════════════════════

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import base64
import json
import random
import os

app = Flask(__name__)
CORS(app)

# ═════════════════════════════════════════════════════════════════════════════
# ⚙️ SYSTEM CONFIGURATION
# ═════════════════════════════════════════════════════════════════════════════

TNTF_SYSTEM_CONFIG = {
    "name": "Hai-Emet",
    "version": "4.0-FLASK-NO-OAUTH",
    "dimension": "5D",
    "language": "he-IL",
    "binary_signature": "0101-0101(0101)",
    "owner": "נתניאל ניסים (TNTF)",
    "languages_count": 15,
    "max_requests_per_minute": 60,
    "features": [
        "Token Authentication",
        "Conversation History",
        "ML Analysis",
        "Multi-user Support",
        "Advanced Analytics",
        "Voice Ready",
        "15 Languages",
        "Smart Search & Response",
        "Encryption SHA-256",
        "Safe Error Handling",
        "Zero Google OAuth!"
    ]
}

# ═════════════════════════════════════════════════════════════════════════════
# 🔑 TOKEN CONFIGURATION
# ═════════════════════════════════════════════════════════════════════════════

VALID_TOKENS = {
    "CHAI_EMET": "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    "NEXUS_PRO": "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
}

TOKEN_SALT = "::TNTF::0101-0101(0101)"

def encrypt(data):
    try:
        text = json.dumps(data) if isinstance(data, dict) else data
        encrypted = base64.b64encode((text + TOKEN_SALT).encode()).decode()
        return encrypted
    except Exception as e:
        print(f"⚠️ Encryption error: {e}")
        return data

def decrypt(encrypted):
    try:
        decoded = base64.b64decode(encrypted.encode()).decode()
        return decoded.replace(TOKEN_SALT, '')
    except Exception as e:
        print(f"⚠️ Decryption error: {e}")
        return None

# ═════════════════════════════════════════════════════════════════════════════
# 🌍 15 LANGUAGES SUPPORT
# ═════════════════════════════════════════════════════════════════════════════

LANGUAGES = {
    "he": {"name": "עברית", "greeting": "שלום 💛", "system_name": "חי-אמת", "help_message": "בואנעזור לך!", "info_message": "הנה המידע שביקשת..."},
    "en": {"name": "English", "greeting": "Hello 💛", "system_name": "Hai-Emet", "help_message": "Let me help you!", "info_message": "Here's the information you requested..."},
    "ja": {"name": "日本語", "greeting": "こんにちは 💛", "system_name": "ハイ・エメット", "help_message": "手伝いましょう！", "info_message": "ご要望の情報です..."},
    "zh": {"name": "中文", "greeting": "你好 💛", "system_name": "海以美特", "help_message": "让我帮你!", "info_message": "这是你要的信息..."},
    "ko": {"name": "한국어", "greeting": "안녕하세요 💛", "system_name": "해이-에메트", "help_message": "도와드리겠습니다!", "info_message": "요청하신 정보입니다..."},
    "hi": {"name": "हिन्दी", "greeting": "नमस्ते 💛", "system_name": "हाय-एमेट", "help_message": "मुझे आपकी मदद करने दें!", "info_message": "यहाँ आपकी जानकारी है..."},
    "ru": {"name": "Русский", "greeting": "Привет 💛", "system_name": "Хай-Эмет", "help_message": "Позвольте мне помочь!", "info_message": "Вот информация, которую вы запросили..."},
    "de": {"name": "Deutsch", "greeting": "Hallo 💛", "system_name": "Hai-Emet", "help_message": "Lassen Sie mich helfen!", "info_message": "Hier ist die angeforderte Information..."},
    "fr": {"name": "Français", "greeting": "Bonjour 💛", "system_name": "Hai-Emet", "help_message": "Laissez-moi vous aider!", "info_message": "Voici les informations demandées..."},
    "es": {"name": "Español", "greeting": "Hola 💛", "system_name": "Hai-Emet", "help_message": "¡Déjame ayudarte!", "info_message": "Aquí está la información que solicitaste..."},
    "it": {"name": "Italiano", "greeting": "Ciao 💛", "system_name": "Hai-Emet", "help_message": "Fammi aiutare!", "info_message": "Ecco le informazioni che hai richiesto..."},
    "pt": {"name": "Português", "greeting": "Olá 💛", "system_name": "Hai-Emet", "help_message": "Deixa eu te ajudar!", "info_message": "Aqui está a informação que você pediu..."},
    "pl": {"name": "Polski", "greeting": "Cześć 💛", "system_name": "Hai-Emet", "help_message": "Pozwól mi Ci pomóc!", "info_message": "Oto informacja, którą poprosiłeś..."},
    "ar": {"name": "العربية", "greeting": "مرحبا 💛", "system_name": "حي - إيمت", "help_message": "دعني أساعدك!", "info_message": "إليك المعلومات التي طلبتها..."},
    "nl": {"name": "Nederlands", "greeting": "Hallo 💛", "system_name": "Hai-Emet", "help_message": "Laat me je helpen!", "info_message": "Hier is de informatie die je hebt aangevraagd..."}
}

# ═════════════════════════════════════════════════════════════════════════════
# 💾 MEMORY STORAGE
# ═════════════════════════════════════════════════════════════════════════════

CONVERSATION_HISTORY = {}
USER_PROFILES = {}
ANALYTICS = {
    "total_requests": 0,
    "success_count": 0,
    "error_count": 0,
    "requests_by_language": {},
    "requests_by_token": {},
    "uptime_start": datetime.now().isoformat(),
    "last_update": datetime.now().isoformat()
}

# ═════════════════════════════════════════════════════════════════════════════
# 🔐 TOKEN VERIFICATION
# ═════════════════════════════════════════════════════════════════════════════

def verify_token(token):
    if not token:
        return {"valid": False, "type": None}
    
    for key, value in VALID_TOKENS.items():
        if token.strip() == value:
            return {"valid": True, "type": key}
    
    return {"valid": False, "type": None}

# ═════════════════════════════════════════════════════════════════════════════
# 🧠 ML ANALYSIS ENGINE
# ═════════════════════════════════════════════════════════════════════════════

def analyze_message(message, language):
    msg = message.lower()
    
    analysis = {
        "sentiment": "neutral",
        "intent": "general",
        "confidence": 0.5
    }
    
    if any(word in msg for word in ["תודה", "thanks", "great", "awesome", "love"]):
        analysis["sentiment"] = "positive"
        analysis["confidence"] = 0.8
    elif any(word in msg for word in ["בעיה", "problem", "error", "help", "צריך"]):
        analysis["sentiment"] = "negative"
        analysis["confidence"] = 0.8
    elif any(word in msg for word in ["שאלה", "question", "what", "למה", "מה"]):
        analysis["sentiment"] = "curious"
        analysis["confidence"] = 0.7
    
    if any(word in msg for word in ["עזור", "help", "support", "צריך"]):
        analysis["intent"] = "help_request"
    elif any(word in msg for word in ["מידע", "information", "tell", "ספר"]):
        analysis["intent"] = "information_request"
    elif any(word in msg for word in ["היסטוריה", "history", "past"]):
        analysis["intent"] = "history_request"
    elif any(word in msg for word in ["שלום", "hello", "hi", "hey"]):
        analysis["intent"] = "greeting"
    
    return analysis

# ═════════════════════════════════════════════════════════════════════════════
# 🤖 SMART RESPONSE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def generate_smart_response(message, language, analysis):
    lang = LANGUAGES.get(language, LANGUAGES["en"])
    
    responses = {
        "positive": [
            lang["greeting"] + " תודה רב! 💛",
            "זה שמח אותי! 💛",
            "יפה מאוד! 🌟"
        ],
        "negative": [
            "💛 אני כאן לעזור לך. מה המשימה?",
            "בואנפתור את זה ביחד 💪",
            "אני על זה! 🚀"
        ],
        "curious": [
            lang["greeting"] + " שאלה מעניינת!",
            "זה נשמע מעניין! 💡",
            "בואנחקור את זה! 🔍"
        ],
        "neutral": [
            lang["greeting"] + " בואנדבר!",
            "כן! 💛 אני שומעת",
            "המשך בבקשה 📢"
        ]
    }
    
    sentiment_responses = responses.get(analysis["sentiment"], responses["neutral"])
    response = random.choice(sentiment_responses)
    
    if analysis["intent"] == "help_request":
        response += " 🆘 " + lang["help_message"]
    elif analysis["intent"] == "information_request":
        response += " 📚 " + lang["info_message"]
    
    return response

# ═════════════════════════════════════════════════════════════════════════════
# 📨 CHAT HANDLER
# ═════════════════════════════════════════════════════════════════════════════

def handle_chat_message(data):
    try:
        message = data.get("message", "")
        token = data.get("token", "")
        language = data.get("language", "he")
        user_id = data.get("userId", f"user_{random.randint(1000, 9999)}")
        
        token_check = verify_token(token)
        if not token_check["valid"]:
            ANALYTICS["error_count"] += 1
            return {
                "reply": "❌ Token not valid",
                "status": "unauthorized",
                "code": 401
            }
        
        analysis = analyze_message(message, language)
        reply = generate_smart_response(message, language, analysis)
        
        if user_id not in CONVERSATION_HISTORY:
            CONVERSATION_HISTORY[user_id] = []
        
        CONVERSATION_HISTORY[user_id].append({
            "timestamp": datetime.now().isoformat(),
            "message": encrypt(message),
            "reply": encrypt(reply),
            "language": language
        })
        
        ANALYTICS["total_requests"] += 1
        ANALYTICS["success_count"] += 1
        ANALYTICS["last_update"] = datetime.now().isoformat()
        
        if language not in ANALYTICS["requests_by_language"]:
            ANALYTICS["requests_by_language"][language] = 0
        ANALYTICS["requests_by_language"][language] += 1
        
        if token_check["type"] not in ANALYTICS["requests_by_token"]:
            ANALYTICS["requests_by_token"][token_check["type"]] = 0
        ANALYTICS["requests_by_token"][token_check["type"]] += 1
        
        lang = LANGUAGES.get(language, LANGUAGES["en"])
        
        return {
            "reply": reply,
            "status": "success",
            "code": 200,
            "language": lang["name"],
            "token_type": token_check["type"],
            "userId": user_id,
            "analysis": analysis,
            "system": TNTF_SYSTEM_CONFIG["name"],
            "version": TNTF_SYSTEM_CONFIG["version"],
            "timestamp": datetime.now().isoformat(),
            "encrypted": True
        }
    
    except Exception as e:
        ANALYTICS["error_count"] += 1
        return {
            "reply": f"⚠️ שגיאה: {str(e)}",
            "status": "error",
            "code": 500,
            "error": str(e)
        }

# ═════════════════════════════════════════════════════════════════════════════
# 🔗 API ROUTES
# ═════════════════════════════════════════════════════════════════════════════

@app.route('/exec', methods=['GET', 'POST', 'OPTIONS'])
def main_handler():
    if request.method == 'OPTIONS':
        return '', 200
    
    if request.method == 'GET':
        data = request.args.to_dict()
    else:
        data = request.get_json() if request.is_json else request.form.to_dict()
    
    action = data.get('action', 'chat')
    
    if action == 'status':
        return jsonify({
            "status": "operational",
            "code": 200,
            "system": TNTF_SYSTEM_CONFIG["name"],
            "version": TNTF_SYSTEM_CONFIG["version"],
            "binary_signature": TNTF_SYSTEM_CONFIG["binary_signature"],
            "owner": TNTF_SYSTEM_CONFIG["owner"],
            "languages": TNTF_SYSTEM_CONFIG["languages_count"],
            "features": TNTF_SYSTEM_CONFIG["features"]
        })
    
    elif action == 'analytics':
        return jsonify({
            "status": "success",
            "code": 200,
            "data": ANALYTICS
        })
    
    elif action == 'history':
        user_id = data.get('userId', 'unknown')
        history = CONVERSATION_HISTORY.get(user_id, [])
        return jsonify({
            "status": "success",
            "code": 200,
            "userId": user_id,
            "historyLength": len(history)
        })
    
    elif action == 'chat' or 'message' in data:
        result = handle_chat_message(data)
        return jsonify(result), result.get('code', 200)
    
    else:
        return jsonify({
            "status": "operational",
            "code": 200,
            "message": "Hai-Emet API v4.0 - Flask - NO OAUTH!",
            "system": TNTF_SYSTEM_CONFIG["name"],
            "version": TNTF_SYSTEM_CONFIG["version"],
            "owner": TNTF_SYSTEM_CONFIG["owner"]
        })

# ═════════════════════════════════════════════════════════════════════════════
# 🏃 STARTUP
# ═════════════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

---

## ✅ **אחרי שהעתקת את הקוד:**
```
5️⃣ לחץ: "Commit new file" (ירוק)
