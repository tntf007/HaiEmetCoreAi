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

4️⃣ Commit
