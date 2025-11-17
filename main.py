import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")

if not BOT_TOKEN:
    print("ERROR: TELEGRAM_TOKEN not set")
    exit(1)

async def start(update, context):
    await update.message.reply_text("Shalom from Hai-Emet Bot!")

async def help_cmd(update, context):
    await update.message.reply_text("Commands available")

async def status_cmd(update, context):
    await update.message.reply_text("Bot is online")

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", status_cmd))
    logger.info("Starting bot...")
    app.run_polling()

if __name__ == "__main__":
    main()
```

---

## **קובץ 5️⃣: requirements.txt**
```
python-telegram-bot==20.0
