<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💛 חי-אמת | Hai-Emet AI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #333;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            height: 90vh;
            max-height: 600px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.95;
        }
        
        .chat-area {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 15px;
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .message.user {
            text-align: left;
        }
        
        .message.assistant {
            text-align: right;
        }
        
        .message-content {
            display: inline-block;
            padding: 12px 18px;
            border-radius: 15px;
            max-width: 70%;
            word-wrap: break-word;
        }
        
        .message.user .message-content {
            background: #667eea;
            color: white;
            border-bottom-right-radius: 0;
        }
        
        .message.assistant .message-content {
            background: #e9ecef;
            color: #333;
            border-bottom-left-radius: 0;
        }
        
        .message-time {
            font-size: 0.8em;
            color: #999;
            margin-top: 5px;
        }
        
        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 20px 20px;
        }
        
        .input-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        input[type="text"] {
            flex: 1;
            padding: 12px 18px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .send-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .send-btn:active {
            transform: translateY(0);
        }
        
        .status {
            text-align: center;
            padding: 10px;
            font-size: 0.9em;
            color: #666;
            background: #f8f9fa;
        }
        
        .error {
            color: #dc3545;
            background: #f8d7da;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
        }
        
        .loading {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            animation: loading 1.4s infinite;
        }
        
        @keyframes loading {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    </style>
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
        const API_URL = '/chat';
        const TOKEN = 'chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp';
        
        const chatArea = document.getElementById('chatArea');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const statusEl = document.getElementById('status');
        
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
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('he-IL');
            
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
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        token: TOKEN,
                        language: language,
                        userId: 'web-user-' + Date.now()
                    })
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    addMessage(data.reply, false);
                    statusEl.textContent = '✅ Connected';
                } else {
                    addMessage('❌ ' + (data.reply || 'שגיאה בשליחת ההודעה'), false);
                    statusEl.textContent = '⚠️ Error';
                }
            } catch (error) {
                addMessage('❌ Connection error: ' + error.message, false);
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
</html>
