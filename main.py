import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")
if not BOT_TOKEN:
    print("ERROR: TELEGRAM_TOKEN not set!")
    exit(1)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("שלום חי אמת 💜")

async def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

---

## **איך:**

1. **GitHub → main.py** (לחץ עיפרון)
2. **Select All** (Ctrl+A)
3. **Delete**
4. **Paste את הקוד החדש**
5. **Commit**

---

## **אחרי זה:**
```
Manual Deploy → Clear build cache & deploy
