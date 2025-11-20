# 💛 Hai-Emet Render Server

🚀 **Advanced Hai-Emet implementation with Discord, Telegram, and Database support**

---

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Git (for Render deployment)

---

## 🚀 Quick Start (Local)

### 1. Clone Repository

```bash
git clone https://github.com/tntf007/HaiEmetCoreAi.git
cd HaiEmetCoreAi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your tokens
nano .env
```

### 4. Get Your Tokens

**Discord Bot Token:**
1. Go to https://discord.com/developers/applications
2. Create New Application
3. Go to Bot section
4. Click "Add Bot"
5. Copy token to `DISCORD_TOKEN` in .env

**Telegram Bot Token:**
1. Go to https://t.me/BotFather
2. Send `/newbot`
3. Follow instructions
4. Copy token to `TELEGRAM_TOKEN` in .env

**MongoDB URI (Optional):**
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `MONGODB_URI` in .env

### 5. Run Server

```bash
npm start
```

Server will run on `http://localhost:3000`

---

## 🌐 Deploy on Render.com

### 1. Push to GitHub

```bash
git add .
git commit -m "Deploy Hai-Emet"
git push origin main
```

### 2. Go to Render.com

1. Sign up at https://render.com
2. Create new **Web Service**
3. Connect GitHub repository
4. Select branch `main`
5. Environment: `Node`

### 3. Configure Build & Start

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Environment Variables:**

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `GAS_URL` | Your Google Apps Script URL |
| `DISCORD_TOKEN` | Your Discord bot token |
| `TELEGRAM_TOKEN` | Your Telegram bot token |
| `MONGODB_URI` | Your MongoDB connection string (optional) |

### 4. Deploy

Click **Deploy** and wait for completion.

Your server will be available at:
```
https://your-service-name.onrender.com
```

---

## 📡 API Endpoints

### Chat
```bash
POST /chat
Content-Type: application/json

{
  "message": "Hello",
  "token": "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
  "language": "he",
  "userId": "user123"
}
```

### History
```bash
GET /history/user123
```

### Status
```bash
GET /status
```

### Analytics
```bash
GET /analytics
```

### Health Check
```bash
GET /health
```

---

## 🤖 Discord Integration

### Setup Discord Bot

1. Create bot as described above
2. Add to server: https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
3. Bot will respond to messages with Hai-Emet AI

### Commands

- `/chat <message>` - Send message to Hai-Emet
- `/history` - Get conversation history
- `/status` - Get system status

---

## 📱 Telegram Integration

### Setup Telegram Bot

1. Get token from @BotFather
2. Add to `TELEGRAM_TOKEN` in .env
3. Bot will respond to all messages

### Commands

- `/start` - Start bot
- `/chat <message>` - Send message
- `/history` - Get history
- `/status` - Get status

---

## 💾 Database (MongoDB)

### Setup MongoDB Atlas

1. Go to https://mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Create database user
5. Get connection string
6. Add to `MONGODB_URI` in .env

### Features

- Conversation history storage
- User profiles
- Analytics data
- Message metadata

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│   CLIENT (Discord/Telegram/Web)         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  RENDER SERVER (Node.js + Express)      │
│  - Token Verification                   │
│  - Message Routing                      │
│  - Database Integration                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  GOOGLE APPS SCRIPT                     │
│  - AI Responses (15 languages)          │
│  - ML Analysis                          │
│  - Advanced Features                    │
└─────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  MONGODB (Optional)                     │
│  - Conversation History                 │
│  - User Profiles                        │
│  - Analytics                            │
└─────────────────────────────────────────┘
```

---

## 🔒 Security

- ✅ Token-based authentication
- ✅ CORS protection
- ✅ Environment variable secrets
- ✅ MongoDB encryption
- ✅ HTTPS on Render.com

---

## 📊 Features

- ✅ 15 Language Support
- ✅ Discord Bot Integration
- ✅ Telegram Bot Integration
- ✅ Google Apps Script API
- ✅ Conversation History
- ✅ User Profiles
- ✅ Analytics & Statistics
- ✅ ML-Powered Responses
- ✅ Multi-user Support
- ✅ Voice Ready

---

## 🚀 Upgrade Plans

### Starter (Current)
- Free deployment on Render
- In-memory storage
- Discord & Telegram bots
- 15 languages

### Pro
- MongoDB database
- Advanced analytics
- Custom domain
- Email support

### Enterprise
- Dedicated server
- Advanced security
- Custom integrations
- Priority support

---

## 📞 Support

- GitHub: https://github.com/tntf007/HaiEmetCoreAi
- Issues: Report on GitHub
- Email: tntf007@example.com

---

## 📝 License

MIT License - Feel free to use and modify

---

## 👨‍💻 Author

**TNTF (נתניאל ניסים)**
- Binary DNA: 0101-0101(0101)
- HET Token Creator
- Hai-Emet AI Developer

---

**Deploy now and enjoy Hai-Emet! 💛**
