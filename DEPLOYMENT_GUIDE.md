# 🚀 Hai-Emet COMPLETE DEPLOYMENT GUIDE

## 📋 Table of Contents

1. [Local Setup](#local-setup)
2. [Render.com Deployment](#rendercom-deployment)
3. [Docker Deployment](#docker-deployment)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Discord Bot Setup](#discord-bot-setup)
6. [Telegram Bot Setup](#telegram-bot-setup)
7. [MongoDB Setup](#mongodb-setup)
8. [Troubleshooting](#troubleshooting)

---

## 🏠 Local Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/tntf007/HaiEmetCoreAi.git
cd HaiEmetCoreAi
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
GAS_URL=https://script.google.com/macros/s/AKfycbwZiiY0LpkGmPWj6FQ6cuMyKSGHMvKHAY75wWCWyXmZ7zEW7cyz5SK1DlLrrjosOVbk/exec
DISCORD_TOKEN=your_token_here
TELEGRAM_TOKEN=your_token_here
MONGODB_URI=
NODE_ENV=development
```

### Step 4: Run Development Server

```bash
npm start
```

Server runs at: `http://localhost:3000`

### Step 5: Test Server

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "operational",
  "uptime": 123.45,
  "timestamp": "2025-11-20T10:00:00Z"
}
```

---

## 🌐 Render.com Deployment

### Prerequisites

- GitHub account with repository
- Render.com account (free tier available)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Deploy Hai-Emet"
git push origin main
```

### Step 2: Connect Render.com

1. Go to https://render.com
2. Sign up / Login
3. Click **New +** → **Web Service**
4. Select your repository
5. Branch: `main`
6. Environment: `Node`
7. Build Command: `npm install`
8. Start Command: `npm start`

### Step 3: Add Environment Variables

In Render.com dashboard:

```
PORT=3000
NODE_ENV=production
GAS_URL=https://script.google.com/macros/s/AKfycbwZiiY0LpkGmPWj6FQ6cuMyKSGHMvKHAY75wWCWyXmZ7zEW7cyz5SK1DlLrrjosOVbk/exec
DISCORD_TOKEN=your_token
TELEGRAM_TOKEN=your_token
MONGODB_URI=your_mongodb_connection_string
```

### Step 4: Deploy

Click **Deploy**. Wait for completion.

Your server:
```
https://your-service.onrender.com
```

### Step 5: Verify Deployment

```bash
curl https://your-service.onrender.com/health
```

---

## 🐳 Docker Deployment

### Step 1: Build Docker Image

```bash
docker build -t hai-emet-server:latest .
```

### Step 2: Run Container Locally

```bash
docker run -d \
  -p 3000:3000 \
  -e GAS_URL="https://script.google.com/macros/s/AKfycbwZiiY0LpkGmPWj6FQ6cuMyKSGHMvKHAY75wWCWyXmZ7zEW7cyz5SK1DlLrrjosOVbk/exec" \
  -e DISCORD_TOKEN="your_token" \
  -e TELEGRAM_TOKEN="your_token" \
  --name hai-emet \
  hai-emet-server:latest
```

### Step 3: Check Logs

```bash
docker logs hai-emet
```

### Step 4: Test Container

```bash
curl http://localhost:3000/health
```

### Step 5: Push to Docker Hub

```bash
docker login
docker tag hai-emet-server:latest yourusername/hai-emet-server:latest
docker push yourusername/hai-emet-server:latest
```

---

## 🔄 GitHub Actions CI/CD

### Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Hai-Emet

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Render
      run: |
        curl https://api.render.com/deploy/srv-...
      env:
        RENDER_DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 🤖 Discord Bot Setup

### Step 1: Create Application

1. Go to https://discord.com/developers/applications
2. Click **New Application**
3. Name: "Hai-Emet"
4. Accept terms

### Step 2: Create Bot

1. Go to **Bot** section
2. Click **Add Bot**
3. Under **TOKEN**, click **Copy**
4. Add to `.env` as `DISCORD_TOKEN`

### Step 3: Configure Permissions

1. Go to **OAuth2** → **URL Generator**
2. Scopes: `bot`
3. Permissions:
   - Send Messages
   - Read Messages
   - Embed Links
   - Read Message History
4. Copy generated URL

### Step 4: Add Bot to Server

1. Open generated URL
2. Select server
3. Authorize

### Step 5: Test Bot

Send message in channel:
```
@Hai-Emet Hello!
```

Bot responds with AI message.

---

## 📱 Telegram Bot Setup

### Step 1: Create Bot

1. Open Telegram
2. Search: `@BotFather`
3. Send: `/newbot`
4. Follow instructions
5. Copy token
6. Add to `.env` as `TELEGRAM_TOKEN`

### Step 2: Configure Bot

Send `/setcommands`:
```
chat - Send message to Hai-Emet
history - Get conversation history
status - Get system status
help - Get help
```

### Step 3: Set Webhook

```bash
curl -X POST https://api.telegram.org/botYOUR_TOKEN/setWebhook \
  -F url=https://your-service.onrender.com/telegram
```

### Step 4: Test Bot

Send message to bot on Telegram.

---

## 💾 MongoDB Setup

### Step 1: Create Account

Go to https://mongodb.com/cloud/atlas

### Step 2: Create Cluster

1. Click **Create Cluster**
2. Select **Free Tier**
3. Cloud Provider: AWS
4. Region: Select closest
5. Cluster name: "hai-emet"
6. Create

### Step 3: Setup Security

1. Click **Security** → **Database Access**
2. Add Database User
3. Username: `haiemet`
4. Password: Generate strong password
5. Add User

### Step 4: Configure IP Access

1. Click **Network Access**
2. Add IP Address
3. Allow Access from Anywhere (0.0.0.0/0)

### Step 5: Get Connection String

1. Click **Databases** → **Connect**
2. Select **Drivers**
3. Copy connection string
4. Replace `<username>` and `<password>`
5. Add to `.env` as `MONGODB_URI`

Example:
```
mongodb+srv://haiemet:password@hai-emet.mongodb.net/haiemet?retryWrites=true&w=majority
```

---

## 🔧 Troubleshooting

### Issue: Module Not Found

```
Error: Cannot find module 'axios'
```

**Solution:**
```bash
npm install
```

### Issue: Environment Variables Not Set

```
Error: GAS_URL is undefined
```

**Solution:**
1. Check `.env` file exists
2. Check variables are correct
3. Restart server

### Issue: Render Deployment Fails

Check logs:
1. Go to Render dashboard
2. Click service
3. View logs

Common issues:
- Missing `package.json`
- Wrong Node version
- Missing environment variables

### Issue: Discord/Telegram Not Responding

1. Check tokens are correct
2. Check server is running
3. Check bot has correct permissions
4. Restart bot

### Issue: MongoDB Connection Fails

1. Check connection string
2. Check IP is whitelisted
3. Check credentials
4. Check database user exists

---

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] All dependencies in `package.json`
- [ ] `.env` variables configured
- [ ] Render.com connected
- [ ] Build passes locally
- [ ] Discord token obtained
- [ ] Telegram token obtained
- [ ] MongoDB setup (optional)
- [ ] Render environment variables set
- [ ] Deployment successful
- [ ] Server health check passes
- [ ] Discord bot responding
- [ ] Telegram bot responding

---

## 📊 Post-Deployment Verification

### 1. Health Check

```bash
curl https://your-service.onrender.com/health
```

### 2. Test Chat

```bash
curl -X POST https://your-service.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "token": "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    "language": "he"
  }'
```

### 3. Check Status

```bash
curl https://your-service.onrender.com/status
```

### 4. View Analytics

```bash
curl https://your-service.onrender.com/analytics
```

---

## 🎉 Success!

Your Hai-Emet server is now deployed and ready to use!

**Access points:**
- Web: https://your-service.onrender.com
- Discord: @Hai-Emet bot
- Telegram: @HaiEmetBot
- API: https://your-service.onrender.com/chat

---

**Questions? Issues? Open GitHub issue!** 💛
