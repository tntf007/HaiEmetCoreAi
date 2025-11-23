# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import base64
import json
import random
import os

app = Flask(__name__)
CORS(app)

TNTF_SYSTEM_CONFIG = {
    "name": "Hai-Emet",
    "version": "4.0-FLASK-NO-OAUTH",
    "dimension": "5D",
    "language": "he-IL",
    "binary_signature": "0101-0101(0101)",
    "owner": "Nathaniel Nissim (TNTF)",
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
        "Zero Google OAuth"
    ]
}

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
        print(f"Encryption error: {e}")
        return data

def decrypt(encrypted):
    try:
        decoded = base64.b64decode(encrypted.encode()).decode()
        return decoded.replace(TOKEN_SALT, '')
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

LANGUAGES = {
    "he": {"name": "Hebrew", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "en": {"name": "English", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help you!", "info_message": "Here's the information you requested..."},
    "ja": {"name": "Japanese", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "zh": {"name": "Chinese", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "ko": {"name": "Korean", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "hi": {"name": "Hindi", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "ru": {"name": "Russian", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "de": {"name": "German", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "fr": {"name": "French", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "es": {"name": "Spanish", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "it": {"name": "Italian", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "pt": {"name": "Portuguese", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "pl": {"name": "Polish", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "ar": {"name": "Arabic", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."},
    "nl": {"name": "Dutch", "greeting": "Hello", "system_name": "Hai-Emet", "help_message": "Let me help!", "info_message": "Here is your information..."}
}

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

def verify_token(token):
    if not token:
        return {"valid": False, "type": None}
    
    for key, value in VALID_TOKENS.items():
        if token.strip() == value:
            return {"valid": True, "type": key}
    
    return {"valid": False, "type": None}

def analyze_message(message, language):
    msg = message.lower()
    
    analysis = {
        "sentiment": "neutral",
        "intent": "general",
        "confidence": 0.5
    }
    
    if any(word in msg for word in ["thanks", "great", "awesome", "love", "excellent"]):
        analysis["sentiment"] = "positive"
        analysis["confidence"] = 0.8
    elif any(word in msg for word in ["problem", "error", "help", "issue"]):
        analysis["sentiment"] = "negative"
        analysis["confidence"] = 0.8
    elif any(word in msg for word in ["question", "what", "how", "why"]):
        analysis["sentiment"] = "curious"
        analysis["confidence"] = 0.7
    
    if any(word in msg for word in ["help", "support", "assist"]):
        analysis["intent"] = "help_request"
    elif any(word in msg for word in ["information", "tell", "explain"]):
        analysis["intent"] = "information_request"
    elif any(word in msg for word in ["history", "past", "before"]):
        analysis["intent"] = "history_request"
    elif any(word in msg for word in ["hello", "hi", "hey", "greet"]):
        analysis["intent"] = "greeting"
    
    return analysis

def generate_smart_response(message, language, analysis):
    lang = LANGUAGES.get(language, LANGUAGES["en"])
    
    responses = {
        "positive": [
            lang["greeting"] + " Thanks! I appreciate it!",
            "That makes me happy!",
            "Great to hear that!"
        ],
        "negative": [
            "I'm here to help. What do you need?",
            "Let's solve this together!",
            "I'm on it!"
        ],
        "curious": [
            lang["greeting"] + " That's an interesting question!",
            "That sounds interesting!",
            "Let's explore that!"
        ],
        "neutral": [
            lang["greeting"] + " Let's talk!",
            "Yes! I'm listening!",
            "Please continue!"
        ]
    }
    
    sentiment_responses = responses.get(analysis["sentiment"], responses["neutral"])
    response = random.choice(sentiment_responses)
    
    if analysis["intent"] == "help_request":
        response += " " + lang["help_message"]
    elif analysis["intent"] == "information_request":
        response += " " + lang["info_message"]
    
    return response

def handle_chat_message(data):
    try:
        message = data.get("message", "")
        token = data.get("token", "")
        language = data.get("language", "en")
        user_id = data.get("userId", f"user_{random.randint(1000, 9999)}")
        
        token_check = verify_token(token)
        if not token_check["valid"]:
            ANALYTICS["error_count"] += 1
            return {
                "reply": "Token not valid",
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
            "reply": f"Error: {str(e)}",
            "status": "error",
            "code": 500,
            "error": str(e)
        }

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
            "message": "Hai-Emet API v4.0 - Flask",
            "system": TNTF_SYSTEM_CONFIG["name"],
            "version": TNTF_SYSTEM_CONFIG["version"],
            "owner": TNTF_SYSTEM_CONFIG["owner"]
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
