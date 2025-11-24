// ═════════════════════════════════════════════════════════════════════════════
// 👥 MULTI-USER SUPPORT - Separate Brain Per User
// Replace your existing brain loading functions with these
// ═════════════════════════════════════════════════════════════════════════════

const MULTI_USER_CONFIG = {
  enabled: true,
  storage_prefix: "USER_BRAIN_",
  global_analytics_key: "GLOBAL_ANALYTICS_V3",
  user_registry_key: "USER_REGISTRY_V3",
  max_users: 100,
  brain_isolation: true
};

// ═════════════════════════════════════════════════════════════════════════════
// 📋 USER REGISTRY - Track all users
// ═════════════════════════════════════════════════════════════════════════════

function getUserRegistry() {
  Logger.log("\n📋 === LOADING USER REGISTRY ===");
  
  try {
    const stored = PropertiesService.getUserProperties().getProperty(MULTI_USER_CONFIG.user_registry_key);
    
    if (stored) {
      const registry = JSON.parse(stored);
      Logger.log("   ✅ Registry loaded! Users: " + Object.keys(registry).length);
      return registry;
    } else {
      Logger.log("   🆕 Creating new registry");
      return {};
    }
  } catch (e) {
    Logger.log("   ⚠️ Registry error: " + e.toString());
    return {};
  }
}

function saveUserRegistry(registry) {
  try {
    const json = JSON.stringify(registry);
    PropertiesService.getUserProperties().setProperty(MULTI_USER_CONFIG.user_registry_key, json);
    Logger.log("   ✅ Registry saved! Users: " + Object.keys(registry).length);
    return true;
  } catch (e) {
    Logger.log("   ❌ Error saving registry: " + e.toString());
    return false;
  }
}

function registerUser(userId, userInfo = {}) {
  Logger.log("\n👤 === REGISTERING USER ===");
  Logger.log("   User ID: " + userId);
  
  try {
    const registry = getUserRegistry();
    
    if (registry[userId]) {
      Logger.log("   ℹ️ User already registered");
      return registry[userId];
    }

    const userRecord = {
      user_id: userId,
      created_at: new Date().toISOString(),
      first_name: userInfo.first_name || "User",
      last_name: userInfo.last_name || "",
      platform: userInfo.platform || "unknown",
      last_active: new Date().toISOString(),
      message_count: 0,
      brain_id: userId,
      status: "active"
    };

    registry[userId] = userRecord;
    saveUserRegistry(registry);

    Logger.log("   ✅ User registered!");
    return userRecord;
  } catch (e) {
    Logger.log("   ❌ Registration error: " + e.toString());
    return null;
  }
}

function getUserInfo(userId) {
  const registry = getUserRegistry();
  return registry[userId] || null;
}

function updateUserLastActive(userId) {
  try {
    const registry = getUserRegistry();
    
    if (registry[userId]) {
      registry[userId].last_active = new Date().toISOString();
      registry[userId].message_count = (registry[userId].message_count || 0) + 1;
      saveUserRegistry(registry);
    }
  } catch (e) {
    Logger.log("⚠️ Error updating user: " + e.toString());
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🧠 ISOLATED BRAIN LOADING - Per User
// ═════════════════════════════════════════════════════════════════════════════

function getOrCreateUserBrain(userId, userInfo = {}) {
  Logger.log("\n🧠 === LOADING USER BRAIN ===");
  Logger.log("   User ID: " + userId);
  
  try {
    // Register user if new
    registerUser(userId, userInfo);

    // Load user's brain
    const storageKey = MULTI_USER_CONFIG.storage_prefix + userId;
    const stored = PropertiesService.getUserProperties().getProperty(storageKey);
    
    if (stored) {
      const brain = JSON.parse(stored);
      Logger.log("   ✅ Brain loaded! Words: " + brain.learned_words.length);
      Logger.log("   📊 Intelligence: " + brain.intelligence_percentage + "%");
      return brain;
    } else {
      Logger.log("   🆕 Creating new brain for user");
      const newBrain = createNewBrain();
      saveUserBrain(userId, newBrain);
      return newBrain;
    }
  } catch (e) {
    Logger.log("   ❌ Error loading brain: " + e.toString());
    return createNewBrain();
  }
}

function saveUserBrain(userId, brain) {
  Logger.log("\n💾 === SAVING USER BRAIN ===");
  Logger.log("   User ID: " + userId);
  
  try {
    const storageKey = MULTI_USER_CONFIG.storage_prefix + userId;
    brain.last_update = new Date().toISOString();
    brain.intelligence_percentage = Math.min(100, Math.floor((brain.learned_words.length / 50) * 100));
    
    const json = JSON.stringify(brain);
    PropertiesService.getUserProperties().setProperty(storageKey, json);
    
    Logger.log("   ✅ Brain saved!");
    Logger.log("   📝 Words: " + brain.learned_words.length);
    Logger.log("   🧠 Intelligence: " + brain.intelligence_percentage + "%");

    // Update user last active
    updateUserLastActive(userId);

    return { status: "success", saved_at: brain.last_update };
  } catch (e) {
    Logger.log("   ❌ Error saving brain: " + e.toString());
    return { status: "error", error: e.toString() };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🌍 GLOBAL ANALYTICS - Across all users
// ═════════════════════════════════════════════════════════════════════════════

function getGlobalAnalytics() {
  Logger.log("\n📊 === LOADING GLOBAL ANALYTICS ===");
  
  try {
    const stored = PropertiesService.getUserProperties().getProperty(MULTI_USER_CONFIG.global_analytics_key);
    
    if (stored) {
      return JSON.parse(stored);
    } else {
      return createNewGlobalAnalytics();
    }
  } catch (e) {
    Logger.log("   ⚠️ Error loading analytics: " + e.toString());
    return createNewGlobalAnalytics();
  }
}

function createNewGlobalAnalytics() {
  return {
    total_users: 0,
    total_messages: 0,
    total_words_learned: 0,
    total_phrases_learned: 0,
    avg_intelligence: 0,
    total_conversations: 0,
    created_at: new Date().toISOString(),
    last_update: new Date().toISOString(),
    users_by_platform: {
      web: 0,
      telegram: 0,
      other: 0
    },
    top_intents: {},
    language_distribution: {}
  };
}

function saveGlobalAnalytics(analytics) {
  try {
    analytics.last_update = new Date().toISOString();
    const json = JSON.stringify(analytics);
    PropertiesService.getUserProperties().setProperty(MULTI_USER_CONFIG.global_analytics_key, json);
    Logger.log("   ✅ Global analytics saved!");
    return true;
  } catch (e) {
    Logger.log("   ❌ Error saving analytics: " + e.toString());
    return false;
  }
}

function updateGlobalAnalytics(userId, brain, language, intent) {
  Logger.log("\n📊 === UPDATING GLOBAL ANALYTICS ===");
  
  try {
    const analytics = getGlobalAnalytics();
    const registry = getUserRegistry();
    const user = registry[userId];

    // Update counts
    analytics.total_users = Object.keys(registry).length;
    analytics.total_words_learned += brain.learned_words.length;
    analytics.total_phrases_learned += brain.learned_phrases.length;
    analytics.total_messages++;
    analytics.total_conversations = Object.keys(registry).length;

    // Update platform distribution
    if (user && user.platform) {
      analytics.users_by_platform[user.platform] = 
        (analytics.users_by_platform[user.platform] || 0) + 1;
    }

    // Update language distribution
    analytics.language_distribution[language] = 
      (analytics.language_distribution[language] || 0) + 1;

    // Update top intents
    if (intent) {
      analytics.top_intents[intent] = (analytics.top_intents[intent] || 0) + 1;
    }

    // Calculate average intelligence
    const allUsers = Object.keys(registry);
    let totalIntelligence = 0;

    for (const id of allUsers) {
      try {
        const userBrain = getOrCreateUserBrain(id);
        totalIntelligence += userBrain.intelligence_percentage || 0;
      } catch (e) {
        Logger.log("   ⚠️ Error calculating avg: " + e.toString());
      }
    }

    analytics.avg_intelligence = Math.round(totalIntelligence / allUsers.length);

    saveGlobalAnalytics(analytics);

    Logger.log("   ✅ Analytics updated!");
    Logger.log("   Total users: " + analytics.total_users);
    Logger.log("   Avg intelligence: " + analytics.avg_intelligence + "%");

  } catch (e) {
    Logger.log("   ❌ Analytics error: " + e.toString());
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 📊 GET USER STATISTICS
// ═════════════════════════════════════════════════════════════════════════════

function getUserStatistics(userId) {
  Logger.log("\n📊 === GET USER STATISTICS ===");
  
  try {
    const brain = getOrCreateUserBrain(userId);
    const userInfo = getUserInfo(userId);
    const registry = getUserRegistry();

    return {
      user_info: userInfo,
      brain: {
        intelligence_percentage: brain.intelligence_percentage,
        total_words_learned: brain.learned_words.length,
        total_phrases: brain.learned_phrases.length,
        conversation_count: brain.conversation_count,
        total_messages_processed: brain.total_messages_processed,
        created_at: brain.created_at,
        last_update: brain.last_update,
        languages: brain.language_learning,
        sentiments: brain.sentiment_learned
      },
      global: {
        total_users: Object.keys(registry).length,
        user_rank: getUserRank(userId, brain.intelligence_percentage)
      }
    };
  } catch (e) {
    Logger.log("   ❌ Error getting statistics: " + e.toString());
    return { error: e.toString() };
  }
}

function getUserRank(userId, intelligence) {
  Logger.log("\n🏆 === CALCULATING USER RANK ===");
  
  try {
    const registry = getUserRegistry();
    let betterThanCount = 0;

    for (const id in registry) {
      try {
        const userBrain = getOrCreateUserBrain(id);
        if ((userBrain.intelligence_percentage || 0) < intelligence) {
          betterThanCount++;
        }
      } catch (e) {
        Logger.log("   ⚠️ Error in rank calc: " + e.toString());
      }
    }

    const totalUsers = Object.keys(registry).length;
    const percentile = Math.round((betterThanCount / totalUsers) * 100);

    Logger.log("   🏆 Rank: " + betterThanCount + " / " + totalUsers);
    Logger.log("   📊 Percentile: " + percentile + "%");

    return {
      rank: betterThanCount + 1,
      total_users: totalUsers,
      percentile: percentile
    };
  } catch (e) {
    Logger.log("   ❌ Rank error: " + e.toString());
    return null;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🧹 ADMIN FUNCTIONS - Manage users
// ═════════════════════════════════════════════════════════════════════════════

function deleteUserBrain(userId) {
  Logger.log("\n🗑️ === DELETING USER BRAIN ===");
  
  try {
    const storageKey = MULTI_USER_CONFIG.storage_prefix + userId;
    PropertiesService.getUserProperties().deleteProperty(storageKey);
    
    // Remove from registry
    const registry = getUserRegistry();
    if (registry[userId]) {
      registry[userId].status = "deleted";
      saveUserRegistry(registry);
    }

    Logger.log("   ✅ User brain deleted!");
    return { status: "success" };
  } catch (e) {
    Logger.log("   ❌ Delete error: " + e.toString());
    return { status: "error", error: e.toString() };
  }
}

function getAllUserStatistics() {
  Logger.log("\n📊 === GET ALL USER STATISTICS ===");
  
  try {
    const registry = getUserRegistry();
    const stats = [];

    for (const userId in registry) {
      try {
        const userStats = getUserStatistics(userId);
        stats.push(userStats);
      } catch (e) {
        Logger.log("   ⚠️ Error for user " + userId);
      }
    }

    stats.sort((a, b) => (b.brain?.intelligence_percentage || 0) - (a.brain?.intelligence_percentage || 0));

    Logger.log("   📊 Users processed: " + stats.length);
    
    return {
      total_users: Object.keys(registry).length,
      user_stats: stats,
      global: getGlobalAnalytics()
    };
  } catch (e) {
    Logger.log("   ❌ Error: " + e.toString());
    return { error: e.toString() };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🔄 UPDATE YOUR handleChatMessage TO USE MULTI-USER
// ═════════════════════════════════════════════════════════════════════════════

/*
  // Replace the brain loading part:
  
  const userInfo = {
    first_name: request.firstName || "User",
    last_name: request.lastName || "",
    platform: request.platform || "web"
  };

  let brain = getOrCreateUserBrain(userId, userInfo);
  
  // ... rest of your code ...
  
  // After processing, update global analytics:
  updateGlobalAnalytics(userId, brain, language, analysis.intent);
  
  // Save user's brain:
  saveUserBrain(userId, brain);
*/
