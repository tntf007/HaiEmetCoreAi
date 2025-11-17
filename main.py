import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

if not TELEGRAM_TOKEN:
    logger.error("TELEGRAM_TOKEN not set!")
    exit(1)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Shalom from Hai-Emet Bot!")

async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Commands available")

async def status_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Bot is online")

def main():
    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", status_cmd))
    logger.info("Starting bot...")
    app.run_polling()

if __name__ == "__main__":
    main()
```

---

## **איפה להכניס בGitHub:**

1. **HaiEmetCoreAi → render-server.js** - Replace
2. **HaiEmetCoreAi → main.py** - Replace

---

## **איפה להכניס בRender:**

### **HaiEmetWeb Service:**

**Settings → Environment Variables**
```
chai_emet_cXVhbnR1bV9tYXN0ZXI6Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp
```


---

### **HaiEmetCoreAi Worker:**

**Settings → Environment Variables**
```
TELEGRAM_TOKEN = [TOKEN שלך מ-BotFather]
