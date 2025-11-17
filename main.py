import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")

if not BOT_TOKEN:
    logger.error("TELEGRAM_TOKEN not set!")
    exit(1)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("שלום וברוך הבא לבוט חי אמת 💜")

async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🤖 בוט חי-אמת\n/start - התחלה")

async def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

---

## **איך לעדכן:**

1. **GitHub → main.py** 
2. **עריכה** (עיפרון)
3. **מחק הכל**
4. **Paste את הקוד החדש**
5. **Commit**

---

## **אחרי זה בRender:**
```
Manual Deploy → Clear build cache & deploy
