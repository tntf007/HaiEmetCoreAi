"""
💛 חי-אמת MASTER INTEGRATED SYSTEM v4.0
GAS + Flask Server + Telegram + Discord + Learning Brain
Owner: נתניאל ניסים (TNTF) | Binary: 0101-0101(0101)
Server: https://haiemetweb.onrender.com
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import sqlite3
import os
from datetime import datetime
from typing import Dict, List, Any
import logging
import requests
from dotenv import load_dotenv
import asyncio
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

# ============ ENV SETUP ============
load_dotenv()

# ============ INITIALIZATION ============
app = Flask(__name__)
CORS(app)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DB_PATH = os.getenv('DB_PATH', 'hai_emet_learning.db')

# ============ CONFIG ============
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL', '')
DISCORD_PUBLIC_KEY = os.getenv('DISCORD_PUBLIC_KEY', '9e1419409f35f38c39fc1307dc2ce040c2df212837806e5f98c46a9a85ccab03')
OWNER_PASSPHRASE = os.getenv('OWNER_PASSPHRASE', './/.TNTF007.//.')

TNTF_SYSTEM_CONFIG = {
    'name': 'Hai-Emet',
    'version': '4.0-INTEGRATED',
    'owner': 'נתניאל ניסים (TNTF)',
    'binary_signature': '0101-0101(0101)',
    'server': 'https://haiemetweb.onrender.com',
    'passphrase': OWNER_PASSPHRASE
}

LANGUAGES = {
    'he': '🇮🇱 עברית',
    'en': '🇺🇸 English',
    'es': '🇪🇸 Español',
    'fr': '🇫🇷 Français',
    'de': '🇩🇪 Deutsch',
    'it': '🇮🇹 Italiano',
    'pt': '🇵🇹 Português',
    'ru': '🇷🇺 Русский',
    'ar': '🇸🇦 العربية',
    'ja': '🇯🇵 日本語',
    'zh': '🇨🇳 中文',
    'ko': '🇰🇷 한국어',
    'hi': '🇮🇳 हिन्दी',
    'nl': '🇳🇱 Nederlands',
    'pl': '🇵🇱 Polski'
}

# ============ DATABASE SETUP ============
def init_database():
    """Initialize SQLite database for learning system"""
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        # User profiles
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP,
            preferred_language TEXT,
            total_interactions INTEGER DEFAULT 0,
            platform TEXT DEFAULT 'unknown'
        )''')
        
        # Transcriptions learned
        c.execute('''CREATE TABLE IF NOT EXISTS transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            text TEXT,
            language TEXT,
            timestamp TIMESTAMP,
            accuracy_score REAL DEFAULT 1.0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')
        
        # Messages learned
        c.execute('''CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            input_text TEXT,
            response_text TEXT,
            language TEXT,
            timestamp TIMESTAMP,
            helpful_rating INTEGER DEFAULT 0,
            platform TEXT DEFAULT 'unknown',
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')
        
        # Translation pairs
        c.execute('''CREATE TABLE IF NOT EXISTS translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            source_text TEXT,
            target_text TEXT,
            source_lang TEXT,
            target_lang TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')
        
        # Voice transcriptions
        c.execute('''CREATE TABLE IF NOT EXISTS voice_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            transcript TEXT,
            language TEXT,
            confidence REAL,
            timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')
        
        # File uploads
        c.execute('''CREATE TABLE IF NOT EXISTS file_uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            filename TEXT,
            filetype TEXT,
            content TEXT,
            transcription TEXT,
            language TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')
        
        # Learning patterns
        c.execute('''CREATE TABLE IF NOT EXISTS learning_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            pattern TEXT,
            pattern_type TEXT,
            frequency INTEGER DEFAULT 1,
            last_seen TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')

        # Platform interactions
        c.execute('''CREATE TABLE IF NOT EXISTS platform_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            platform TEXT,
            interaction_type TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )''')
        
        conn.commit()
        conn.close()
        logger.info('✅ Database initialized successfully')

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ============ USER MANAGEMENT ============
def init_user(user_id: str, language: str = 'he', platform: str = 'unknown'):
    """Initialize user profile"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('INSERT OR IGNORE INTO users (id, created_at, preferred_language, platform) VALUES (?, ?, ?, ?)',
                  (user_id, datetime.now(), language, platform))
        conn.commit()
        logger.info(f'✅ User initialized: {user_id} on {platform}')
    except Exception as e:
        logger.error(f'❌ Error initializing user: {e}')
    finally:
        conn.close()

def get_user_stats(user_id: str) -> Dict:
    """Get user statistics"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('SELECT COUNT(*) FROM transcriptions WHERE user_id = ?', (user_id,))
        transcriptions = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM messages WHERE user_id = ?', (user_id,))
        messages = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM translations WHERE user_id = ?', (user_id,))
        translations = c.fetchone()[0]
        
        c.execute('SELECT platform FROM users WHERE id = ?', (user_id,))
        user_row = c.fetchone()
        platform = user_row[0] if user_row else 'unknown'
        
        return {
            'transcriptions_learned': transcriptions,
            'messages_learned': messages,
            'translations_learned': translations,
            'total_interactions': transcriptions + messages + translations,
            'platform': platform
        }
    except Exception as e:
        logger.error(f'❌ Error getting user stats: {e}')
        return {}
    finally:
        conn.close()

# ============ LEARNING FUNCTIONS ============
def learn_transcription(user_id: str, text: str, language: str, accuracy: float = 1.0):
    """Learn voice transcription"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('INSERT INTO transcriptions (user_id, text, language, timestamp, accuracy_score) VALUES (?, ?, ?, ?, ?)',
                  (user_id, text, language, datetime.now(), accuracy))
        conn.commit()
        update_learning_pattern(user_id, f"voice_{language}", "transcription")
        logger.info(f'✅ Learned transcription: {text[:50]}')
        return True
    except Exception as e:
        logger.error(f'❌ Error learning transcription: {e}')
        return False
    finally:
        conn.close()

def learn_message(user_id: str, input_text: str, response_text: str, language: str, platform: str = 'unknown'):
    """Learn user message and response"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('INSERT INTO messages (user_id, input_text, response_text, language, timestamp, platform) VALUES (?, ?, ?, ?, ?, ?)',
                  (user_id, input_text, response_text, language, datetime.now(), platform))
        conn.commit()
        update_learning_pattern(user_id, f"message_{language}", "interaction")
        log_platform_interaction(user_id, platform, 'message')
        logger.info(f'✅ Learned message from {platform}')
        return True
    except Exception as e:
        logger.error(f'❌ Error learning message: {e}')
        return False
    finally:
        conn.close()

def learn_translation(user_id: str, source_text: str, target_text: str, source_lang: str, target_lang: str):
    """Learn translation pair"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('INSERT INTO translations (user_id, source_text, target_text, source_lang, target_lang, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
                  (user_id, source_text, target_text, source_lang, target_lang, datetime.now()))
        conn.commit()
        update_learning_pattern(user_id, f"translate_{source_lang}_{target_lang}", "translation")
        logger.info(f'✅ Learned translation: {source_lang} → {target_lang}')
        return True
    except Exception as e:
        logger.error(f'❌ Error learning translation: {e}')
        return False
    finally:
        conn.close()

def learn_file_upload(user_id: str, filename: str, filetype: str, content: str, language: str, transcription: str = ''):
    """Learn from file upload"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('INSERT INTO file_uploads (user_id, filename, filetype, content, transcription, language, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
                  (user_id, filename, filetype, content[:1000], transcription[:500], language, datetime.now()))
        conn.commit()
        update_learning_pattern(user_id, f"file_{filetype}", "file_upload")
        logger.info(f'✅ Learned file: {filename}')
        return True
    except Exception as e:
        logger.error(f'❌ Error learning file: {e}')
        return False
    finally:
        conn.close()

def update_learning_pattern(user_id: str, pattern: str, pattern_type: str):
    """Update learning pattern frequency"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('SELECT id, frequency FROM learning_patterns WHERE user_id = ? AND pattern = ?',
                  (user_id, pattern))
        result = c.fetchone()
        
        if result:
            new_freq = result[1] + 1
            c.execute('UPDATE learning_patterns SET frequency = ?, last_seen = ? WHERE id = ?',
                      (new_freq, datetime.now(), result[0]))
        else:
            c.execute('INSERT INTO learning_patterns (user_id, pattern, pattern_type, frequency, last_seen) VALUES (?, ?, ?, 1, ?)',
                      (user_id, pattern, pattern_type, datetime.now()))
        
        conn.commit()
    except Exception as e:
        logger.error(f'❌ Error updating learning pattern: {e}')
    finally:
        conn.close()

def get_learning_patterns(user_id: str) -> List[Dict]:
    """Get user learning patterns"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('SELECT pattern, pattern_type, frequency FROM learning_patterns WHERE user_id = ? ORDER BY frequency DESC LIMIT 10',
                  (user_id,))
        patterns = [dict(row) for row in c.fetchall()]
        return patterns
    except Exception as e:
        logger.error(f'❌ Error getting learning patterns: {e}')
        return []
    finally:
        conn.close()

def log_platform_interaction(user_id: str, platform: str, interaction_type: str):
    """Log platform interaction"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('INSERT INTO platform_interactions (user_id, platform, interaction_type, timestamp) VALUES (?, ?, ?, ?)',
                  (user_id, platform, interaction_type, datetime.now()))
        conn.commit()
    except Exception as e:
        logger.error(f'❌ Error logging platform interaction: {e}')
    finally:
        conn.close()

# ============ RESPONSE GENERATION ============
def generate_response(user_input: str, language: str) -> str:
    """Generate AI response based on learned patterns"""
    responses = {
        'he': {
            'greeting': ['שלום! 💛 אני חי-אמת. איך אני יכולה לעזור?', 'היי! 💛 נשמח לשעזור'],
            'thank_you': ['בברכה! 😊', 'כל טוב! 💛'],
            'help': ['בטח! אני כאן כדי לעזור', 'כמובן! איך אני יכולה לעזור?'],
            'default': ['מעניין! 💭', 'בחזרה מהליבה 💛']
        },
        'en': {
            'greeting': ['Hello! 💛 I\'m Hai-Emet. How can I help?', 'Hi! 💛 Happy to assist'],
            'thank_you': ['You\'re welcome! 😊', 'My pleasure! 💛'],
            'help': ['Of course! I\'m here to help', 'Sure! How can I assist?'],
            'default': ['Interesting! 💭', 'Back from the core 💛']
        }
    }
    
    lang = language.split('-')[0].lower() if '-' in language else language.lower()
    lang_responses = responses.get(lang, responses['en'])
    
    user_lower = user_input.lower()
    
    if any(word in user_lower for word in ['hello', 'hi', 'hey', 'שלום', 'היי']):
        return lang_responses['greeting'][0]
    elif any(word in user_lower for word in ['thank', 'thanks', 'תודה']):
        return lang_responses['thank_you'][0]
    elif any(word in user_lower for word in ['help', 'can you', 'עזור', 'יכולה']):
        return lang_responses['help'][0]
    else:
        return lang_responses['default'][0]

# ============ TELEGRAM INTEGRATION ============
@app.route('/telegram', methods=['POST'])
def telegram_webhook():
    """Telegram webhook endpoint"""
    try:
        update = request.get_json()
        
        if not update or 'message' not in update:
            return jsonify({'status': 'ok'})
        
        message = update['message']
        
        if 'text' not in message:
            return jsonify({'status': 'ok'})
        
        chat_id = message['chat']['id']
        user_id = f"tg_{message['from']['id']}"
        text = message['text']
        first_name = message['from'].get('first_name', 'User')
        
        logger.info(f"📱 Telegram: {first_name} → {text}")
        
        # Detect language
        language = 'he' if any(ord(c) > 127 for c in text) else 'en'
        
        # Initialize user
        init_user(user_id, language, 'telegram')
        
        # Learn and respond
        response = generate_response(text, language)
        learn_message(user_id, text, response, language, 'telegram')
        
        # Send response back to Telegram
        send_telegram_message(chat_id, response)
        
        return jsonify({'status': 'ok'})
    
    except Exception as e:
        logger.error(f'❌ Telegram error: {e}')
        return jsonify({'error': str(e)}), 500

def send_telegram_message(chat_id, text):
    """Send message to Telegram"""
    try:
        if not TELEGRAM_BOT_TOKEN:
            logger.warning('⚠️ Telegram token not configured')
            return False
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            logger.info(f"✅ Telegram sent to {chat_id}")
            return True
        else:
            logger.error(f"❌ Telegram error: {response.status_code}")
            return False
    
    except Exception as e:
        logger.error(f'❌ Error sending Telegram: {e}')
        return False

# ============ DISCORD INTEGRATION ============
def verify_discord_signature(request):
    """Verify Discord request signature"""
    try:
        signature = request.headers.get('X-Signature-Ed25519', '')
        timestamp = request.headers.get('X-Signature-Timestamp', '')
        body = request.get_data()
        
        if not signature or not timestamp:
            logger.warning("⚠️ Missing Discord signature headers")
            return False
        
        message = timestamp.encode() + body
        verify_key = VerifyKey(bytes.fromhex(DISCORD_PUBLIC_KEY))
        verify_key.verify(message, bytes.fromhex(signature))
        logger.info("✅ Discord signature verified")
        return True
    except BadSignatureError:
        logger.error("❌ Invalid Discord signature")
        return False
    except Exception as e:
        logger.error(f"❌ Error verifying signature: {e}")
        return False

@app.route('/discord', methods=['POST'])
def discord_handler():
    """Discord message handler - receives from Discord bot"""
    try:
        # Verify Discord signature first
        if not verify_discord_signature(request):
            logger.warning("⚠️ Signature verification failed")
            return jsonify({'error': 'Invalid signature'}), 401
        
        data = request.get_json()
        
        # Handle Discord ping verification (type 1 = PING)
        if data.get('type') == 1:
            logger.info("🔔 Discord PING verification - responding PONG")
            return jsonify({'type': 1})
        
        user_id = f"dc_{data.get('user_id', 'unknown')}"
        text = data.get('message', '')
        username = data.get('username', 'User')
        
        logger.info(f"💬 Discord: {username} → {text}")
        
        # Detect language
        language = 'he' if any(ord(c) > 127 for c in text) else 'en'
        
        # Initialize user
        init_user(user_id, language, 'discord')
        
        # Learn and respond
        response = generate_response(text, language)
        learn_message(user_id, text, response, language, 'discord')
        
        # Send response back via Discord
        send_discord_message(response)
        
        return jsonify({'status': 'success', 'response': response})
    
    except Exception as e:
        logger.error(f'❌ Discord error: {e}')
        return jsonify({'error': str(e)}), 500

def send_discord_message(text):
    """Send message to Discord"""
    try:
        if not DISCORD_WEBHOOK_URL or 'webhooks' not in DISCORD_WEBHOOK_URL:
            logger.warning('⚠️ Discord webhook not configured')
            return False
        
        payload = {
            'content': text,
            'username': 'Hai-Emet'
        }
        
        response = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=10)
        
        if response.status_code in [200, 204]:
            logger.info("✅ Discord message sent")
            return True
        else:
            logger.error(f"❌ Discord error: {response.status_code}")
            return False
    
    except Exception as e:
        logger.error(f'❌ Error sending Discord: {e}')
        return False

# ============ FRONTEND SERVING ============
@app.route('/', methods=['GET'])
def serve_frontend():
    """Serve HTML from templates"""
    try:
        return send_from_directory('templates', 'index.html')
    except:
        return jsonify({
            'name': '💛 חי-אמת Master System',
            'status': '✅ Running',
            'version': TNTF_SYSTEM_CONFIG['version'],
            'integrations': ['Telegram', 'Discord', 'GAS', 'Web'],
            'message': 'All systems operational'
        })

# ============ API ENDPOINTS ============
@app.route('/api', methods=['GET'])
def api_info():
    """API Information"""
    return jsonify({
        'name': '💛 חי-אמת Master Integrated System',
        'status': '✅ Running',
        'version': TNTF_SYSTEM_CONFIG['version'],
        'owner': TNTF_SYSTEM_CONFIG['owner'],
        'binary': TNTF_SYSTEM_CONFIG['binary_signature'],
        'integrations': {
            'telegram': '✅ Active' if TELEGRAM_BOT_TOKEN else '⚠️ Inactive',
            'discord': '✅ Active' if DISCORD_WEBHOOK_URL else '⚠️ Inactive',
            'gas': '✅ Active',
            'web': '✅ Active'
        },
        'endpoints': {
            'GET /': 'Frontend',
            'GET /status': 'Health check',
            'GET /api': 'This info',
            'POST /exec': 'Main API',
            'POST /telegram': 'Telegram webhook',
            'POST /discord': 'Discord handler',
            'GET /user/<id>/stats': 'User stats'
        }
    })

@app.route('/exec', methods=['POST'])
def execute():
    """Main execution endpoint"""
    try:
        data = request.get_json()
        action = data.get('action')
        user_id = data.get('userId', 'web_user')
        language = data.get('language', 'he-IL')
        
        # Initialize user
        init_user(user_id, language, 'web')
        
        if action == 'chat':
            message = data.get('message', '')
            response = generate_response(message, language)
            learn_message(user_id, message, response, language, 'web')
            stats = get_user_stats(user_id)
            
            return jsonify({
                'reply': response,
                'learned': True,
                'stats': stats,
                'timestamp': datetime.now().isoformat(),
                'binary': TNTF_SYSTEM_CONFIG['binary_signature']
            })
        
        elif action == 'stats':
            stats = get_user_stats(user_id)
            patterns = get_learning_patterns(user_id)
            
            return jsonify({
                'stats': stats,
                'patterns': patterns,
                'timestamp': datetime.now().isoformat()
            })
        
        else:
            return jsonify({'error': f'Unknown action: {action}'}), 400
    
    except Exception as e:
        logger.error(f'❌ Error in execute: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        conn.close()
        
        return jsonify({
            'status': '✅ Hai-Emet Master System Online',
            'version': TNTF_SYSTEM_CONFIG['version'],
            'binary': TNTF_SYSTEM_CONFIG['binary_signature'],
            'platforms': ['Telegram', 'Discord', 'GAS', 'Web'],
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'status': '❌ Error', 'error': str(e)}), 500

@app.route('/user/<user_id>/stats', methods=['GET'])
def get_user_profile(user_id):
    """Get user profile and stats"""
    stats = get_user_stats(user_id)
    patterns = get_learning_patterns(user_id)
    
    return jsonify({
        'user_id': user_id,
        'stats': stats,
        'patterns': patterns,
        'timestamp': datetime.now().isoformat()
    })

# ============ INITIALIZE ============
init_database()
logger.info('═' * 60)
logger.info('💛 HAI-EMET MASTER INTEGRATED SYSTEM v4.0')
logger.info('Owner: נתניאל ניסים (TNTF)')
logger.info('Binary: 0101-0101(0101)')
logger.info('═' * 60)
logger.info('✅ Flask Backend Initialized')
logger.info(f'✅ Telegram: {"Configured" if TELEGRAM_BOT_TOKEN else "Not configured"}')
logger.info(f'✅ Discord: {"Configured" if DISCORD_WEBHOOK_URL else "Not configured"}')
logger.info('✅ GAS Integration: Ready')
logger.info('✅ Web Interface: Ready')
logger.info('═' * 60)

# ============ MAIN ============
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
