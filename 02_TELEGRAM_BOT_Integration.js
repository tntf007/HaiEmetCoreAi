// ═════════════════════════════════════════════════════════════════════════════
// 🤖 TELEGRAM BOT INTEGRATION - חי-אמת Telegram
// Add this section to your Code.gs file
// ═════════════════════════════════════════════════════════════════════════════

const TELEGRAM_CONFIG = {
  // ⚠️ GET YOUR TOKEN FROM @BotFather IN TELEGRAM
  BOT_TOKEN: "YOUR_TELEGRAM_BOT_TOKEN_HERE",
  
  // Get from @userinfobot - your Telegram user ID
  OWNER_ID: 123456789,
  
  // Store user brains separately
  TELEGRAM_BRAINS_PREFIX: "TELEGRAM_BRAIN_",
  
  // Enable Telegram
  ENABLED: false  // Set to true when you have a token!
};

// ═════════════════════════════════════════════════════════════════════════════
// 🧠 GET TELEGRAM USER BRAIN
// ═════════════════════════════════════════════════════════════════════════════

function getTelegramUserBrain(telegramUserId) {
  Logger.log("\n🧠 === LOADING TELEGRAM USER BRAIN ===");
  Logger.log("   User ID: " + telegramUserId);
  
  try {
    const storageKey = TELEGRAM_CONFIG.TELEGRAM_BRAINS_PREFIX + telegramUserId;
    const stored = PropertiesService.getUserProperties().getProperty(storageKey);
    
    if (stored) {
      const brain = JSON.parse(stored);
      Logger.log("   ✅ Brain loaded! Words: " + brain.learned_words.length);
      return brain;
    } else {
      Logger.log("   🆕 Creating new brain for Telegram user");
      return createNewBrain();
    }
  } catch (e) {
    Logger.log("❌ Error loading Telegram brain: " + e.toString());
    return createNewBrain();
  }
}

function saveTelegramUserBrain(telegramUserId, brain) {
  try {
    const storageKey = TELEGRAM_CONFIG.TELEGRAM_BRAINS_PREFIX + telegramUserId;
    const json = JSON.stringify(brain);
    PropertiesService.getUserProperties().setProperty(storageKey, json);
    Logger.log("✅ Telegram brain saved for user: " + telegramUserId);
    return true;
  } catch (e) {
    Logger.log("❌ Error saving Telegram brain: " + e.toString());
    return false;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 📨 TELEGRAM MESSAGE HANDLER
// ═════════════════════════════════════════════════════════════════════════════

function handleTelegramMessage(update) {
  Logger.log("\n📱 === TELEGRAM MESSAGE HANDLER ===");
  
  try {
    const message = update.message;
    if (!message || !message.text) {
      Logger.log("   ⚠️ No message text");
      return;
    }

    const chatId = message.chat.id;
    const telegramUserId = message.from.id;
    const userName = message.from.first_name || "Friend";
    const messageText = message.text;

    Logger.log("   From: " + userName + " (" + telegramUserId + ")");
    Logger.log("   Chat: " + chatId);
    Logger.log("   Text: " + messageText);

    // Handle commands
    if (messageText.startsWith('/')) {
      handleTelegramCommand(messageText, chatId, telegramUserId, userName);
      return;
    }

    // Load user's brain
    let brain = getTelegramUserBrain(telegramUserId);

    // Analyze message
    const analysis = analyzeMessage(messageText, "he");

    // Learn from message
    const learningResult = learn(messageText, brain, "he", analysis.sentiment);
    Logger.log("   🧠 Learned: " + learningResult.new_words_count + " words");

    // Generate response
    const response = generateSmartResponse(messageText, "he", analysis, [], { 
      userId: "telegram_" + telegramUserId 
    });

    // Learn from response
    learn(response.response, brain, "he", "neutral");

    // Save brain
    saveTelegramUserBrain(telegramUserId, brain);

    // Send to Telegram
    sendTelegramMessage(chatId, response.response);

  } catch (e) {
    Logger.log("❌ Telegram handler error: " + e.toString());
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🎯 TELEGRAM COMMANDS HANDLER
// ═════════════════════════════════════════════════════════════════════════════

function handleTelegramCommand(command, chatId, userId, userName) {
  Logger.log("\n🎯 === TELEGRAM COMMAND ===");
  Logger.log("   Command: " + command);

  let response = "";

  switch (command) {
    case '/start':
      response = `👋 שלום ${userName}!\n\nאני חי-אמת 💛\nבואנדבר! 🌟\n\nCommands:\n/status - Brain status\n/reset - Reset brain\n/help - Help`;
      break;

    case '/status':
      const brain = getTelegramUserBrain(userId);
      response = `📊 🧠 Brain Status:\n\n` +
        `🧠 Intelligence: ${brain.intelligence_percentage}%\n` +
        `📚 Words: ${brain.learned_words.length}\n` +
        `💬 Messages: ${brain.conversation_count}\n` +
        `📅 Last: ${new Date(brain.last_update).toLocaleTimeString('he-IL')}`;
      break;

    case '/reset':
      PropertiesService.getUserProperties().deleteProperty(TELEGRAM_CONFIG.TELEGRAM_BRAINS_PREFIX + userId);
      response = "🆕 Brain reset! Starting fresh...";
      break;

    case '/help':
      response = `💡 Help:\n\n` +
        `• Just chat with me\n` +
        `• /status - See my brain\n` +
        `• /reset - New brain\n` +
        `• /help - This help\n\n` +
        `Binary DNA: 0101-0101(0101) 💛`;
      break;

    default:
      response = "❓ Unknown command. Try /help";
  }

  sendTelegramMessage(chatId, response);
}

// ═════════════════════════════════════════════════════════════════════════════
// 📤 SEND MESSAGE TO TELEGRAM
// ═════════════════════════════════════════════════════════════════════════════

function sendTelegramMessage(chatId, text) {
  Logger.log("\n📤 === SENDING TELEGRAM MESSAGE ===");
  Logger.log("   Chat: " + chatId);
  Logger.log("   Text: " + text.substring(0, 50) + "...");

  try {
    const url = "https://api.telegram.org/bot" + TELEGRAM_CONFIG.BOT_TOKEN + "/sendMessage";
    
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML"
    };

    const options = {
      method: "post",
      payload: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    if (result.ok) {
      Logger.log("   ✅ Message sent!");
      return { status: "success" };
    } else {
      Logger.log("   ❌ Telegram error: " + result.description);
      return { status: "error", error: result.description };
    }
  } catch (e) {
    Logger.log("❌ Error sending Telegram message: " + e.toString());
    return { status: "error", error: e.toString() };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🔗 TELEGRAM WEBHOOK (Add this to your doPost function)
// ═════════════════════════════════════════════════════════════════════════════

function handleTelegramWebhook(e) {
  Logger.log("\n🔗 === TELEGRAM WEBHOOK ===");

  try {
    if (!TELEGRAM_CONFIG.ENABLED) {
      Logger.log("   ⚠️ Telegram bot disabled");
      return;
    }

    const data = JSON.parse(e.postData.contents);
    Logger.log("   📨 Update ID: " + data.update_id);

    if (data.message) {
      handleTelegramMessage(data);
    } else if (data.callback_query) {
      Logger.log("   📌 Callback query received");
    }

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    Logger.log("❌ Webhook error: " + error.toString());
    return ContentService.createTextOutput("ERROR").setMimeType(ContentService.MimeType.TEXT);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🚀 TELEGRAM SETUP FUNCTION (Run once to set webhook)
// ═════════════════════════════════════════════════════════════════════════════

function setupTelegramWebhook() {
  Logger.log("\n🚀 === TELEGRAM WEBHOOK SETUP ===");

  if (!TELEGRAM_CONFIG.BOT_TOKEN || TELEGRAM_CONFIG.BOT_TOKEN === "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
    Logger.log("❌ No bot token configured!");
    Logger.log("   1. Go to @BotFather in Telegram");
    Logger.log("   2. Create a bot");
    Logger.log("   3. Copy token to TELEGRAM_CONFIG.BOT_TOKEN");
    return;
  }

  try {
    // Get your GAS web app URL
    // Format: https://script.google.com/macros/s/[PROJECT_ID]/usercodedef
    const webAppUrl = "YOUR_GAS_WEB_APP_URL_HERE"; // Update this!

    const url = "https://api.telegram.org/bot" + TELEGRAM_CONFIG.BOT_TOKEN + "/setWebhook";
    
    const payload = {
      url: webAppUrl,
      allowed_updates: ["message", "callback_query"]
    };

    const options = {
      method: "post",
      payload: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    if (result.ok) {
      Logger.log("   ✅ Webhook configured successfully!");
      Logger.log("   Webhook URL: " + webAppUrl);
      Logger.log("   Bot can now receive messages!");
    } else {
      Logger.log("   ❌ Error: " + result.description);
    }
  } catch (e) {
    Logger.log("❌ Setup error: " + e.toString());
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 📋 ADD THIS TO YOUR doPost FUNCTION:
// ═════════════════════════════════════════════════════════════════════════════

/*
  // In your doPost function, add this check:
  
  if (e.postData && e.postData.contents && e.postData.contents.includes('"message"')) {
    Logger.log("   → Handling Telegram webhook...");
    return handleTelegramWebhook(e);
  }
*/
