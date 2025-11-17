import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")

if not BOT_TOKEN:
    logger.error("TELEGRAM_TOKEN not set")
    exit(1)

async def start(update, context):
    await update.message.reply_text("Hello from Hai-Emet Bot!")

async def help_cmd(update, context):
    await update.message.reply_text("Commands: /start /help /status")

async def status_cmd(update, context):
    await update.message.reply_text("Bot is online")

async def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", status_cmd))
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

---

## **🎯 בדיוק!**

1. **GitHub → main.py**
2. **Delete הכל**
3. **Paste את הקוד (בלי הוראות!)**
4. **Commit**

---

## **אחרי:**
```
Manual Deploy → Clear build cache
