import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")
if not BOT_TOKEN:
    logger.error("ERROR: TELEGRAM_TOKEN not set!")
    exit(1)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    logger.info(f"User {user.id} started bot")
    await update.message.reply_text(
        f"שלום {user.first_name}! 👋\n"
        "ברוך הבא לבוט חי אמת 💜\n"
        "/help - עזרה"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
🤖 בוט חי-אמת

פקודות זמינות:
/start - התחלה
/help - עזרה זו
/status - סטטוס בוט
    """
    await update.message.reply_text(help_text)

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ הבוט רץ כרגע!")

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.info(f"Message from {update.effective_user.id}: {update.message.text}")
    await update.message.reply_text(f"אתה כתבת: {update.message.text}")

async def main():
    logger.info("Starting Hai-Emet Bot...")
    
    app = Application.builder().token(BOT_TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("status", status_command))
    
    logger.info("Bot handlers registered")
    logger.info("Starting polling...")
    
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
```

---

## **איך להעלות:**

1. **GitHub → main.py** (עריכה)
2. **Select All** (Ctrl+A)
3. **Delete**
4. **Paste את הקוד החדש**
5. **Commit**

---

## **אחרי זה:**
```
Manual Deploy → Clear build cache & deploy
