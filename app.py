# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from datetime import datetime
import base64
import json
import random
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
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
    "he": {"name": "Hebrew", "greeting": "שלום 💛", "system_name": "חי-אמת", "help_message": "בואנעזור לך!", "info_message": "הנה המידע שביקשת..."},
    "en": {"name": "English", "greeting": "Hello 💛", "system_name": "Hai-Emet", "help_message": "Let me help you!", "info_message": "Here's the information you requested..."},
    "ja": {"name": "Japanese", "greeting": "こんにちは 💛", "system_name": "ハイ・エメット", "help_message": "手伝いましょう！", "info_message": "ご要望の情報です..."},
    "zh": {"name": "Chinese", "greeting": "你好 💛", "system_name": "海以美特", "help_message": "让我帮你!", "info_message": "这是你要的信息..."},
    "ko": {"name": "Korean", "greeting": "안녕하세요 💛", "system_name": "해이-에메트", "help_message": "도와드리겠습니다!", "info_message": "요청하신 정보입니다..."},
    "hi": {"name": "Hindi", "greeting": "नमस्ते 💛", "system_name": "हाय-एमेट", "help_message": "मुझे आपकी मदद करने दें!", "info_message": "यहाँ आपकी जानकारी है..."},
    "ru": {"name": "Russian", "greeting": "Привет 💛", "system_name": "Хай-Эмет", "help_message": "Позвольте мне помочь!", "info_message": "Вот информация, которую вы запросили..."},
    "de": {"name": "German", "greeting": "Hallo 💛", "system_name": "Hai-Emet", "help_message": "Lassen Sie mich helfen!", "info_message": "Hier ist die angeforderte Information..."},
    "fr": {"name": "French", "greeting": "Bonjour 💛", "system_name": "Hai-Emet", "help_message": "Laissez-moi vous aider!", "info_message": "Voici les informations demandées..."},
    "es": {"name": "Spanish", "greeting": "Hola 💛", "system_name": "Hai-Emet", "help_message": "¡Déjame ayudarte!", "info_message": "Aquí está la información que solicitaste..."},
    "it": {"name": "Italian", "greeting": "Ciao 💛", "system_name": "Hai-Emet", "help_message": "Fammi aiutare!", "info_message": "Ecco le informazioni che hai richiesto..."},
    "pt": {"name": "Portuguese", "greeting": "Olá 💛", "system_name": "Hai-Emet", "help_message": "Deixa eu te ajudar!", "info_message": "Aqui está a informação que você pediu..."},
    "pl": {"name": "Polish", "greeting": "Cześć 💛", "system_name": "Hai-Emet", "help_message": "Pozwól mi Ci pomóc!", "info_message": "Oto informacja, którą poprosiłeś..."},
    "ar": {"name": "Arabic", "greeting": "مرحبا 💛", "system_name": "حي - إيمت", "help_message": "دعني أساعدك!", "info_message": "إليك المعلومات التي طلبتها..."},
    "nl": {"name": "Dutch", "greeting": "Hallo 💛", "system_name": "Hai-Emet", "help_message": "Laat me je helpen!", "info_message": "Hier is de informatie die je hebt aangevraagd..."}
}

CONVERSATION_HISTORY = {}
USER_PROFILES = {}
LEARNED_PATTERNS = {}  # ✅ Learning System
ANALYTICS = {
    "total_requests": 0,
    "success_count": 0,
    "error_count": 0,
    "requests_by_language": {},
    "requests_by_token": {},
    "learned_responses": 0,  # ✅ Track learning
    "uptime_start": datetime.now().isoformat(),
    "last_update": datetime.now().isoformat()
}

def learn_pattern(message, reply, language, user_id):
    """Learn from conversation patterns"""
    try:
        key = f"{language}_{message[:20]}"  # Pattern key
        
        if key not in LEARNED_PATTERNS:
            LEARNED_PATTERNS[key] = {
                "message": message,
                "reply": reply,
                "count": 1,
                "language": language,
                "learned_at": datetime.now().isoformat()
            }
        else:
            LEARNED_PATTERNS[key]["count"] += 1
            LEARNED_PATTERNS[key]["learned_at"] = datetime.now().isoformat()
        
        ANALYTICS["learned_responses"] = len(LEARNED_PATTERNS)
        return True
    except Exception as e:
        print(f"Learning error: {e}")
        return False

def get_learned_response(message, language):
    """Get response from learned patterns"""
    key = f"{language}_{message[:20]}"
    
    if key in LEARNED_PATTERNS:
        return LEARNED_PATTERNS[key]["reply"]
    return None

def verify_token(token):
    """Verify authentication token"""
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
        "confidence": 0.5,
        "language": language
    }
    
    # Multi-language sentiment detection
    positive_words = {
        "en": ["thanks", "great", "awesome", "love", "excellent", "wonderful", "perfect"],
        "he": ["תודה", "מעולה", "יופי", "אוהב", "שמח", "נפלא", "מדהים"],
        "es": ["gracias", "excelente", "maravilloso", "perfecto", "genial"],
        "fr": ["merci", "excellent", "magnifique", "parfait", "merveilleux"],
        "de": ["danke", "ausgezeichnet", "wunderbar", "perfekt", "großartig"],
        "it": ["grazie", "eccellente", "meraviglioso", "perfetto", "fantastico"],
        "pt": ["obrigado", "excelente", "maravilhoso", "perfeito", "ótimo"],
        "ru": ["спасибо", "отлично", "чудесно", "прекрасно", "замечательно"],
        "ar": ["شكرا", "رائع", "ممتاز", "رائع", "مشهور"],
        "ja": ["ありがとう", "素晴らしい", "素敵", "完璧", "素晴らしい"],
        "zh": ["谢谢", "很好", "完美", "绝佳", "精彩"],
        "ko": ["감사합니다", "훌륭한", "완벽한", "훌륭한", "좋습니다"],
        "hi": ["धन्यवाद", "बहुत अच्छा", "शानदार", "परिपूर्ण", "अद्भुत"],
        "nl": ["dank", "uitstekend", "prachtig", "perfect", "fantastisch"],
        "pl": ["dziękuję", "doskonały", "wspaniały", "idealny", "świetny"]
    }
    
    negative_words = {
        "en": ["problem", "error", "help", "issue", "wrong", "broken", "bad"],
        "he": ["בעיה", "שגיאה", "עזרה", "לא", "שבור", "רע", "קשה"],
        "es": ["problema", "error", "ayuda", "malo", "roto", "difícil"],
        "fr": ["problème", "erreur", "aide", "mauvais", "cassé", "difficile"],
        "de": ["problem", "fehler", "hilfe", "falsch", "kaputt", "schlecht"],
        "it": ["problema", "errore", "aiuto", "cattivo", "rotto", "difficile"],
        "pt": ["problema", "erro", "ajuda", "ruim", "quebrado", "difícil"],
        "ru": ["проблема", "ошибка", "помощь", "плохо", "сломано", "трудно"],
        "ar": ["مشكلة", "خطأ", "مساعدة", "سيء", "مكسور", "صعب"],
        "ja": ["問題", "エラー", "助け", "悪い", "壊れた", "難しい"],
        "zh": ["问题", "错误", "帮助", "坏", "破碎", "困难"],
        "ko": ["문제", "오류", "도움", "나쁨", "깨진", "어려움"],
        "hi": ["समस्या", "त्रुटि", "मदद", "बुरा", "टूटा", "मुश्किल"],
        "nl": ["probleem", "fout", "hulp", "slecht", "kapot", "moeilijk"],
        "pl": ["problem", "błąd", "pomoc", "złe", "zepsute", "trudne"]
    }
    
    curious_words = {
        "en": ["question", "what", "how", "why", "curious", "wonder"],
        "he": ["שאלה", "מה", "איך", "למה", "סקרן", "תמונה"],
        "es": ["pregunta", "qué", "cómo", "por qué", "curioso"],
        "fr": ["question", "quoi", "comment", "pourquoi", "curieux"],
        "de": ["frage", "was", "wie", "warum", "neugierig"],
        "it": ["domanda", "cosa", "come", "perché", "curioso"],
        "pt": ["pergunta", "o que", "como", "por que", "curioso"],
        "ru": ["вопрос", "что", "как", "почему", "любопытный"],
        "ar": ["سؤال", "ما", "كيف", "لماذا", "فضولي"],
        "ja": ["質問", "何", "どのように", "なぜ", "好奇心"],
        "zh": ["问题", "什么", "怎样", "为什么", "好奇"],
        "ko": ["질문", "무엇", "어떻게", "왜", "호기심"],
        "hi": ["सवाल", "क्या", "कैसे", "क्यों", "जिज्ञासु"],
        "nl": ["vraag", "wat", "hoe", "waarom", "nieuwsgierig"],
        "pl": ["pytanie", "co", "jak", "dlaczego", "ciekawy"]
    }
    
    help_words = {
        "en": ["help", "support", "assist", "need", "please"],
        "he": ["עזרה", "תמיכה", "צריך", "בבקשה", "עוזר"],
        "es": ["ayuda", "apoyo", "necesito", "por favor"],
        "fr": ["aide", "soutien", "besoin", "s'il vous plaît"],
        "de": ["hilfe", "unterstützung", "benötige", "bitte"],
        "it": ["aiuto", "supporto", "ho bisogno", "per favore"],
        "pt": ["ajuda", "apoio", "preciso", "por favor"],
        "ru": ["помощь", "поддержка", "нужен", "пожалуйста"],
        "ar": ["مساعدة", "دعم", "احتاج", "من فضلك"],
        "ja": ["助け", "サポート", "必要", "ください"],
        "zh": ["帮助", "支持", "需要", "请"],
        "ko": ["도움", "지원", "필요", "부탁"],
        "hi": ["मदद", "समर्थन", "चाहिए", "कृपया"],
        "nl": ["hulp", "steun", "nodig", "alstublieft"],
        "pl": ["pomoc", "wsparcie", "potrzebuję", "proszę"]
    }
    
    # Get language-specific words or fallback to English
    lang_pos = positive_words.get(language, positive_words["en"])
    lang_neg = negative_words.get(language, negative_words["en"])
    lang_cur = curious_words.get(language, curious_words["en"])
    lang_help = help_words.get(language, help_words["en"])
    
    # Sentiment analysis
    if any(word in msg for word in lang_pos):
        analysis["sentiment"] = "positive"
        analysis["confidence"] = 0.8
    elif any(word in msg for word in lang_neg):
        analysis["sentiment"] = "negative"
        analysis["confidence"] = 0.8
    elif any(word in msg for word in lang_cur):
        analysis["sentiment"] = "curious"
        analysis["confidence"] = 0.7
    
    # Intent analysis
    if any(word in msg for word in lang_help):
        analysis["intent"] = "help_request"
    elif any(word in msg for word in lang_pos + ["information", "información", "информация", "معلومات", "情報"]):
        analysis["intent"] = "information_request"
    elif any(word in msg for word in lang_cur):
        analysis["intent"] = "question"
    
    return analysis

def generate_smart_response(message, language, analysis):
    lang = LANGUAGES.get(language, LANGUAGES["en"])
    
    emoji_map = {
        "he": "💛",
        "en": "💙",
        "ja": "🌸",
        "zh": "🏮",
        "ko": "🌟",
        "hi": "🎨",
        "ru": "❄️",
        "de": "🍺",
        "fr": "🥐",
        "es": "🌺",
        "it": "🍝",
        "pt": "🏖️",
        "pl": "🌲",
        "ar": "🌙",
        "nl": "🌷"
    }
    
    emoji = emoji_map.get(language, "💛")
    
    # Language-specific responses dictionary
    language_responses = {
        "he": {
            "positive": [
                emoji + " תודה רב! זה שמח אותי!",
                "כן! " + emoji + " זה מעולה!",
                "יפה מאוד! " + emoji
            ],
            "negative": [
                emoji + " אני כאן לעזור לך. מה המשימה?",
                "בואנפתור את זה ביחד " + emoji,
                "אני על זה! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " שאלה מעניינת! בואנחקור!",
                "זה נשמע מעניין! " + emoji + " 💡",
                "בואנחקור את זה ביחד " + emoji
            ],
            "neutral": [
                emoji + " בואנדבר!",
                "כן! " + emoji + " אני שומעת",
                "המשך בבקשה " + emoji + " 📢"
            ]
        },
        "en": {
            "positive": [
                emoji + " Thanks! I appreciate it!",
                "Yes! " + emoji + " That's great!",
                "Great to hear that! " + emoji
            ],
            "negative": [
                emoji + " I'm here to help. What do you need?",
                "Let's solve this together! " + emoji,
                "I'm on it! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " That's an interesting question!",
                "That sounds interesting! " + emoji + " 💡",
                "Let's explore that! " + emoji
            ],
            "neutral": [
                emoji + " Let's talk!",
                "Yes! " + emoji + " I'm listening!",
                "Please continue! " + emoji + " 📢"
            ]
        },
        "es": {
            "positive": [
                emoji + " ¡Gracias! ¡Eso me alegra!",
                "¡Sí! " + emoji + " ¡Excelente!",
                "¡Muy bien! " + emoji
            ],
            "negative": [
                emoji + " Estoy aquí para ayudarte. ¿Qué necesitas?",
                "¡Resolvamos esto juntos! " + emoji,
                "¡Estoy en ello! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " ¡Esa es una pregunta interesante!",
                "¡Eso suena interesante! " + emoji + " 💡",
                "¡Exploremos eso! " + emoji
            ],
            "neutral": [
                emoji + " ¡Hablemos!",
                "¡Sí! " + emoji + " ¡Estoy escuchando!",
                "¡Por favor continúa! " + emoji + " 📢"
            ]
        },
        "fr": {
            "positive": [
                emoji + " Merci! Ça m'a fait plaisir!",
                "Oui! " + emoji + " C'est fantastique!",
                "Très bien! " + emoji
            ],
            "negative": [
                emoji + " Je suis là pour vous aider. Que puis-je faire?",
                "Résolvons cela ensemble! " + emoji,
                "Je m'en occupe! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " C'est une question intéressante!",
                "Ça semble intéressant! " + emoji + " 💡",
                "Explorons cela! " + emoji
            ],
            "neutral": [
                emoji + " Parlons!",
                "Oui! " + emoji + " J'écoute!",
                "S'il vous plaît continuez! " + emoji + " 📢"
            ]
        },
        "de": {
            "positive": [
                emoji + " Danke! Das freut mich!",
                "Ja! " + emoji + " Das ist großartig!",
                "Sehr schön! " + emoji
            ],
            "negative": [
                emoji + " Ich bin hier, um dir zu helfen. Was brauchst du?",
                "Lassen Sie uns das zusammen lösen! " + emoji,
                "Ich kümmere mich darum! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " Das ist eine interessante Frage!",
                "Das klingt interessant! " + emoji + " 💡",
                "Lassen Sie uns das erkunden! " + emoji
            ],
            "neutral": [
                emoji + " Lass uns reden!",
                "Ja! " + emoji + " Ich höre zu!",
                "Bitte weiter! " + emoji + " 📢"
            ]
        },
        "it": {
            "positive": [
                emoji + " Grazie! Mi fa piacere!",
                "Sì! " + emoji + " Fantastico!",
                "Molto bene! " + emoji
            ],
            "negative": [
                emoji + " Sono qui per aiutarti. Di cosa hai bisogno?",
                "Risolviamo questo insieme! " + emoji,
                "Mi sto occupando! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " Questa è una domanda interessante!",
                "Sembra interessante! " + emoji + " 💡",
                "Esaminiamo questo! " + emoji
            ],
            "neutral": [
                emoji + " Parliamo!",
                "Sì! " + emoji + " Sto ascoltando!",
                "Per favore continua! " + emoji + " 📢"
            ]
        },
        "pt": {
            "positive": [
                emoji + " Obrigado! Isso me alegra!",
                "Sim! " + emoji + " Excelente!",
                "Muito bom! " + emoji
            ],
            "negative": [
                emoji + " Estou aqui para ajudar. O que você precisa?",
                "Vamos resolver isso juntos! " + emoji,
                "Estou nisso! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " Essa é uma pergunta interessante!",
                "Isso soa interessante! " + emoji + " 💡",
                "Vamos explorar isso! " + emoji
            ],
            "neutral": [
                emoji + " Vamos conversar!",
                "Sim! " + emoji + " Estou ouvindo!",
                "Por favor continue! " + emoji + " 📢"
            ]
        },
        "ru": {
            "positive": [
                emoji + " Спасибо! Это меня радует!",
                "Да! " + emoji + " Отлично!",
                "Очень хорошо! " + emoji
            ],
            "negative": [
                emoji + " Я здесь, чтобы помочь. Что вам нужно?",
                "Давайте решим это вместе! " + emoji,
                "Я займусь этим! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " Это интересный вопрос!",
                "Это звучит интересно! " + emoji + " 💡",
                "Давайте исследуем это! " + emoji
            ],
            "neutral": [
                emoji + " Давайте поговорим!",
                "Да! " + emoji + " Я слушаю!",
                "Пожалуйста продолжайте! " + emoji + " 📢"
            ]
        },
        "ar": {
            "positive": [
                emoji + " شكرا! هذا يسعدني!",
                "نعم! " + emoji + " رائع!",
                "جميل جدا! " + emoji
            ],
            "negative": [
                emoji + " أنا هنا للمساعدة. ماذا تحتاج؟",
                "دعنا نحل هذا معا! " + emoji,
                "أنا على هذا! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " هذا سؤال مثير للاهتمام!",
                "هذا يبدو مثيرا للاهتمام! " + emoji + " 💡",
                "دعنا نستكشف هذا! " + emoji
            ],
            "neutral": [
                emoji + " دعنا نتحدث!",
                "نعم! " + emoji + " أنا أستمع!",
                "من فضلك استمر! " + emoji + " 📢"
            ]
        },
        "ja": {
            "positive": [
                emoji + " ありがとう！嬉しいです！",
                "はい! " + emoji + " 素晴らしい!",
                "素敵です! " + emoji
            ],
            "negative": [
                emoji + " 助けるためにここにいます。何が必要ですか？",
                "一緒に解決しましょう! " + emoji,
                "対応中です! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " 興味深い質問ですね!",
                "興味深いですね! " + emoji + " 💡",
                "探索しましょう! " + emoji
            ],
            "neutral": [
                emoji + " 話しましょう!",
                "はい! " + emoji + " 聞いています!",
                "続けてください! " + emoji + " 📢"
            ]
        },
        "zh": {
            "positive": [
                emoji + " 谢谢！这让我高兴！",
                "是的! " + emoji + " 太好了!",
                "非常好! " + emoji
            ],
            "negative": [
                emoji + " 我在这里帮助你。你需要什么？",
                "让我们一起解决这个问题! " + emoji,
                "我在处理! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " 这是一个有趣的问题!",
                "这听起来很有趣! " + emoji + " 💡",
                "让我们探索一下! " + emoji
            ],
            "neutral": [
                emoji + " 让我们谈话!",
                "是的! " + emoji + " 我在听!",
                "请继续! " + emoji + " 📢"
            ]
        },
        "ko": {
            "positive": [
                emoji + " 감사합니다! 기쁩니다!",
                "네! " + emoji + " 훌륭합니다!",
                "매우 좋습니다! " + emoji
            ],
            "negative": [
                emoji + " 도움이 되기 위해 여기 있습니다. 뭐가 필요합니까?",
                "함께 해결해봅시다! " + emoji,
                "처리 중입니다! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " 흥미로운 질문입니다!",
                "흥미로워 보입니다! " + emoji + " 💡",
                "탐험해봅시다! " + emoji
            ],
            "neutral": [
                emoji + " 이야기해봅시다!",
                "네! " + emoji + " 듣고 있습니다!",
                "계속 진행해주세요! " + emoji + " 📢"
            ]
        },
        "hi": {
            "positive": [
                emoji + " धन्यवाद! मुझे खुशी है!",
                "हाँ! " + emoji + " शानदार!",
                "बहुत अच्छा! " + emoji
            ],
            "negative": [
                emoji + " मैं आपकी मदद के लिए यहाँ हूँ। आपको क्या चाहिए?",
                "चलिए इसे एक साथ हल करते हैं! " + emoji,
                "मैं इस पर काम कर रहा हूँ! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " यह एक दिलचस्प प्रश्न है!",
                "यह दिलचस्प लगता है! " + emoji + " 💡",
                "आइए इसे खोजें! " + emoji
            ],
            "neutral": [
                emoji + " चलिए बात करते हैं!",
                "हाँ! " + emoji + " मैं सुन रहा हूँ!",
                "कृपया जारी रखें! " + emoji + " 📢"
            ]
        },
        "nl": {
            "positive": [
                emoji + " Dank je wel! Dit maakt me blij!",
                "Ja! " + emoji + " Geweldig!",
                "Heel goed! " + emoji
            ],
            "negative": [
                emoji + " Ik ben hier om je te helpen. Wat heb je nodig?",
                "Laten we dit samen oplossen! " + emoji,
                "Ik ben ermee bezig! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " Dat is een interessante vraag!",
                "Dat klinkt interessant! " + emoji + " 💡",
                "Laten we dit verkennen! " + emoji
            ],
            "neutral": [
                emoji + " Laten we praten!",
                "Ja! " + emoji + " Ik luister!",
                "Alstublieft verder! " + emoji + " 📢"
            ]
        },
        "pl": {
            "positive": [
                emoji + " Dziękuję! To mnie cieszy!",
                "Tak! " + emoji + " Świetnie!",
                "Bardzo dobrze! " + emoji
            ],
            "negative": [
                emoji + " Jestem tutaj, aby Ci pomóc. Czego potrzebujesz?",
                "Rozwiążmy to razem! " + emoji,
                "Zajmuję się tym! " + emoji + " 🚀"
            ],
            "curious": [
                emoji + " To ciekawe pytanie!",
                "To brzmi interesująco! " + emoji + " 💡",
                "Zbadajmy to! " + emoji
            ],
            "neutral": [
                emoji + " Porozmawiajmy!",
                "Tak! " + emoji + " Słucham!",
                "Proszę kontynuuj! " + emoji + " 📢"
            ]
        }
    }
    
    # Get language-specific responses or fallback to English
    responses = language_responses.get(language, language_responses["en"])
    
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
        
        # ✅ Check if already learned this pattern
        learned_reply = get_learned_response(message, language)
        if learned_reply:
            reply = learned_reply
            learned = True
        else:
            analysis = analyze_message(message, language)
            reply = generate_smart_response(message, language, analysis)
            learned = False
        
        if user_id not in CONVERSATION_HISTORY:
            CONVERSATION_HISTORY[user_id] = []
        
        CONVERSATION_HISTORY[user_id].append({
            "timestamp": datetime.now().isoformat(),
            "message": encrypt(message),
            "reply": encrypt(reply),
            "language": language,
            "learned": learned
        })
        
        # ✅ Learn from this interaction
        learn_pattern(message, reply, language, user_id)
        
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
            "learned": learned,  # ✅ Tell frontend it was learned
            "learned_patterns_count": len(LEARNED_PATTERNS),
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

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/voice')
def voice():
    return render_template('voice.html')

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
            "data": ANALYTICS,
            "learned_patterns": len(LEARNED_PATTERNS),
            "learning_enabled": True
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
    
    elif action == 'learn' or action == 'transcription' or action == 'video_subtitles' or 'data' in data:
        # Learning system - handles voice, video, stream, subtitles
        user_data = data.get('data', {})
        transcript = user_data.get('transcript', '')
        transcription_type = user_data.get('type', 'voice_transcription')
        
        if transcript:
            # Learn from all types of transcription
            learn_pattern(transcript, transcript, data.get('language', 'en'), data.get('userId', 'unknown'))
        
        return jsonify({
            "status": "success",
            "code": 200,
            "learned": True,
            "learned_patterns": len(LEARNED_PATTERNS),
            "type": transcription_type,
            "transcript_preview": transcript[:50] + "..." if len(transcript) > 50 else transcript,
            "timestamp": datetime.now().isoformat()
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
