import os
import logging
import requests
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
RENDER_API = os.getenv("RENDER_API_URL", "http://localhost:8000")

if not TELEGRAM_TOKEN:
    logger.error("TELEGRAM_TOKEN not set!")
    exit(1)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        response = requests.get(f"{RENDER_API}/")
        await update.message.reply_text(f"Hai-Emet is alive! 💛")
    except:
        await update.message.reply_text("❌ Server offline")

async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
🎯 חי-אמת Commands:
/start - Start bot
/help - Show this
/status - Server status
/ask - Ask a question
"""
    await update.message.reply_text(help_text)

async def status_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        response = requests.get(f"{RENDER_API}/")
        await update.message.reply_text("✅ Server is online 💛")
    except:
        await update.message.reply_text("❌ Server is offline")

async def ask_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = " ".join(context.args)
    if not msg:
        await update.message.reply_text("שלח הודעה עם /ask")
        return
    
    try:
        response = requests.post(f"{RENDER_API}/exec", json={"message": msg})
        data = response.json()
        reply = data.get("reply", "❌ No response")
        await update.message.reply_text(reply)
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

def main():
    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", status_cmd))
    app.add_handler(CommandHandler("ask", ask_cmd))
    logger.info("Starting bot...")
    app.run_polling()

if __name__ == "__main__":
    main()
```

---

## **✅ מה התוקן:**

- ✅ שורה 3: `import requests` - **הוסף!**
- ✅ שורה 11: `RENDER_API = os.getenv(...)` - **חיבור לRender!**
- ✅ שורה 19-22: פונקציה `start` - **עם connection!**
- ✅ שורה 24-32: פונקציה `help_cmd` - **עם הוראות!**
- ✅ שורה 34-40: פונקציה `status_cmd` - **בדיקת שרת!**
- ✅ שורה 42-51: פונקציה `ask_cmd` - **חדשה! עבור /ask!**
- ✅ שורה 57: `app.add_handler(CommandHandler("ask", ask_cmd))` - **הוסף!**

---

## **🎯 איפה להכניס:**

### **1️⃣ GitHub:**
```
HaiEmetCoreAi → main.py → Replace
```

### **2️⃣ Render - HaiEmetCoreAi Worker:**
```
Settings → Environment Variables:

TELEGRAM_TOKEN=[שלך מ-BotFather]
RENDER_API_URL=https://haiemetweb.onrender.com
