// ═════════════════════════════════════════════════════════════════════════════
// 🧠 ADVANCED LEARNING - Pattern Recognition & Intelligence
// Add to Code.gs for smarter learning
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// 🔍 PATTERN RECOGNITION ENGINE
// ═════════════════════════════════════════════════════════════════════════════

const ADVANCED_LEARNING_CONFIG = {
  enabled: true,
  min_pattern_length: 3,
  max_pattern_length: 15,
  pattern_confidence_threshold: 0.6,
  similarity_threshold: 0.7
};

function analyzePatterns(text, brain) {
  Logger.log("\n🔍 === ANALYZING PATTERNS ===");
  
  try {
    const words = text.toLowerCase().split(/\s+/);
    const patterns = [];

    // Extract n-grams (phrases)
    for (let n = 2; n <= 4; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        const phrase = words.slice(i, i + n).join(' ');
        
        if (phrase.length >= ADVANCED_LEARNING_CONFIG.min_pattern_length) {
          const pattern = {
            phrase: phrase,
            length: n,
            frequency: countPhraseInBrain(phrase, brain),
            confidence: 0.8
          };

          if (pattern.frequency > 0) {
            patterns.push(pattern);
          }
        }
      }
    }

    // Sort by frequency
    patterns.sort((a, b) => b.frequency - a.frequency);

    Logger.log("   📊 Patterns found: " + patterns.length);
    
    return {
      total_patterns: patterns.length,
      top_patterns: patterns.slice(0, 5),
      all_patterns: patterns
    };
  } catch (e) {
    Logger.log("   ⚠️ Pattern analysis error: " + e.toString());
    return { total_patterns: 0, top_patterns: [], all_patterns: [] };
  }
}

function countPhraseInBrain(phrase, brain) {
  let count = 0;
  
  if (brain.learned_phrases) {
    for (const learnedPhrase of brain.learned_phrases) {
      if (learnedPhrase.includes(phrase)) {
        count++;
      }
    }
  }

  return count;
}

// ═════════════════════════════════════════════════════════════════════════════
// 🎯 INTENT PREDICTION ENGINE
// ═════════════════════════════════════════════════════════════════════════════

function predictIntent(text, brain) {
  Logger.log("\n🎯 === PREDICTING INTENT ===");
  
  try {
    const predictions = {
      greeting: 0,
      help_request: 0,
      information_request: 0,
      gratitude: 0,
      question: 0,
      statement: 0
    };

    const text_lower = text.toLowerCase();
    const words = text_lower.split(/\s+/);

    // Greeting patterns
    if (/^(שלום|היי|הי|בוקר|ערב|לילה|מה|איך|כמה)/i.test(text_lower)) {
      predictions.greeting += 0.3;
    }

    // Help request patterns
    if (/עזור|help|צריך|בעיה|problem|error|שגיאה|לא עובד/i.test(text_lower)) {
      predictions.help_request += 0.5;
    }

    // Information request
    if (/מה|איך|למה|איפה|מי|כמה|מידע|information|tell|explain/i.test(text_lower)) {
      predictions.information_request += 0.4;
    }

    // Gratitude
    if (/תודה|thanks|thank you|מדהים|awesome|love|brilliant/i.test(text_lower)) {
      predictions.gratitude += 0.6;
    }

    // Question
    if (text.endsWith('?')) {
      predictions.question += 0.4;
    }

    // Normalize scores
    const total = Object.values(predictions).reduce((a, b) => a + b, 0);
    const normalized = {};
    
    for (const [key, value] of Object.entries(predictions)) {
      normalized[key] = total > 0 ? (value / total).toFixed(2) : 0;
    }

    Logger.log("   📊 Intent predictions: " + JSON.stringify(normalized));
    
    return normalized;
  } catch (e) {
    Logger.log("   ⚠️ Intent prediction error: " + e.toString());
    return {};
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 💡 CONTEXT UNDERSTANDING ENGINE
// ═════════════════════════════════════════════════════════════════════════════

function analyzeContext(text, brain, history) {
  Logger.log("\n💡 === ANALYZING CONTEXT ===");
  
  try {
    const context = {
      current_topic: extractTopic(text),
      sentiment_trend: analyzeSentimentTrend(history),
      user_pattern: analyzeUserPattern(history),
      topic_frequency: countTopicFrequency(text, brain),
      relatedness_to_history: calculateHistoryRelatedness(text, history),
      time_context: getTimeContext()
    };

    Logger.log("   🎯 Topic: " + context.current_topic);
    Logger.log("   📈 Sentiment trend: " + context.sentiment_trend);
    
    return context;
  } catch (e) {
    Logger.log("   ⚠️ Context analysis error: " + e.toString());
    return {};
  }
}

function extractTopic(text) {
  const topics = {
    'programming': /code|javascript|python|program|debug|bug/i,
    'learning': /learn|teach|study|education|course/i,
    'health': /health|sick|doctor|medicine|diet/i,
    'technology': /technology|tech|ai|computer|software|hardware/i,
    'personal': /myself|life|feeling|emotion|personal/i
  };

  for (const [topic, regex] of Object.entries(topics)) {
    if (regex.test(text)) {
      return topic;
    }
  }

  return 'general';
}

function countTopicFrequency(text, brain) {
  const topic = extractTopic(text);
  let count = 0;

  if (brain.learned_phrases) {
    for (const phrase of brain.learned_phrases) {
      if (extractTopic(phrase) === topic) {
        count++;
      }
    }
  }

  return count;
}

function analyzeSentimentTrend(history) {
  if (!history || history.length < 2) {
    return 'stable';
  }

  const recentSentiments = history.slice(-5).map(m => m.sentiment || 'neutral');
  const positiveCount = recentSentiments.filter(s => s === 'positive').length;
  const negativeCount = recentSentiments.filter(s => s === 'negative').length;

  if (positiveCount > negativeCount) {
    return 'improving';
  } else if (negativeCount > positiveCount) {
    return 'declining';
  } else {
    return 'stable';
  }
}

function analyzeUserPattern(history) {
  if (!history || history.length < 3) {
    return 'new_user';
  }

  if (history.length < 10) {
    return 'casual';
  } else if (history.length < 50) {
    return 'regular';
  } else {
    return 'power_user';
  }
}

function calculateHistoryRelatedness(text, history) {
  if (!history || history.length === 0) {
    return 0;
  }

  const text_words = new Set(text.toLowerCase().split(/\s+/));
  let related_count = 0;

  for (const message of history.slice(-5)) {
    const msg_words = message.message.toLowerCase().split(/\s+/);
    
    for (const word of msg_words) {
      if (text_words.has(word)) {
        related_count++;
      }
    }
  }

  return Math.min(1, related_count / text_words.size);
}

function getTimeContext() {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🧬 SIMILARITY MATCHING ENGINE (TF-IDF)
// ═════════════════════════════════════════════════════════════════════════════

function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

function findSimilarPhrases(text, brain, limit = 3) {
  Logger.log("\n🔗 === FINDING SIMILAR PHRASES ===");
  
  try {
    const similarities = [];

    if (brain.learned_phrases && brain.learned_phrases.length > 0) {
      for (const phrase of brain.learned_phrases) {
        const similarity = calculateSimilarity(text, phrase);
        
        if (similarity > ADVANCED_LEARNING_CONFIG.similarity_threshold) {
          similarities.push({
            phrase: phrase,
            similarity: similarity
          });
        }
      }
    }

    similarities.sort((a, b) => b.similarity - a.similarity);

    Logger.log("   Found: " + similarities.length + " similar phrases");
    
    return similarities.slice(0, limit);
  } catch (e) {
    Logger.log("   ⚠️ Similarity error: " + e.toString());
    return [];
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 📊 INTELLIGENCE SCORING ENGINE
// ═════════════════════════════════════════════════════════════════════════════

function calculateIntelligenceScore(brain) {
  Logger.log("\n📊 === CALCULATING INTELLIGENCE SCORE ===");
  
  try {
    let score = 0;

    // Words learned (max 40 points)
    const wordScore = Math.min(40, (brain.learned_words.length / 50) * 40);
    score += wordScore;

    // Phrases learned (max 20 points)
    const phraseScore = Math.min(20, (brain.learned_phrases.length / 20) * 20);
    score += phraseScore;

    // Message diversity (max 20 points)
    const messageScore = Math.min(20, (brain.conversation_count / 30) * 20);
    score += messageScore;

    // Language diversity (max 10 points)
    const langCount = Object.values(brain.language_learning).filter(v => v > 0).length;
    const langScore = Math.min(10, (langCount / 15) * 10);
    score += langScore;

    // Sentiment balance (max 10 points)
    const sentiments = Object.values(brain.sentiment_learned);
    const maxSentiment = Math.max(...sentiments);
    const sentimentScore = maxSentiment > 0 ? 10 - (maxSentiment / brain.total_messages_processed) * 10 : 5;
    score += sentimentScore;

    const finalScore = Math.round(Math.min(100, score));

    Logger.log("   📈 Final Intelligence: " + finalScore + "%");
    Logger.log("   Words: " + wordScore.toFixed(1));
    Logger.log("   Phrases: " + phraseScore.toFixed(1));
    Logger.log("   Messages: " + messageScore.toFixed(1));
    
    return finalScore;
  } catch (e) {
    Logger.log("   ⚠️ Score calculation error: " + e.toString());
    return 0;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🎓 ADAPTIVE RESPONSE ENGINE
// ═════════════════════════════════════════════════════════════════════════════

function generateAdaptiveResponse(text, brain, patterns, intents, context) {
  Logger.log("\n🎓 === GENERATING ADAPTIVE RESPONSE ===");
  
  try {
    let response = "";

    // Use intents to shape response
    if (intents && intents.help_request > 0.5) {
      response = "🆘 How can I help you? ";
    } else if (intents && intents.gratitude > 0.5) {
      response = "💝 Thank you! ";
    } else if (intents && intents.question > 0.5) {
      response = "🤔 Great question! ";
    } else {
      response = "💬 ";
    }

    // Add context-aware addition
    if (context && context.sentiment_trend === 'declining') {
      response += "💪 I'm here for you. ";
    }

    if (context && context.user_pattern === 'power_user') {
      response += "⭐ Advanced mode engaged! ";
    }

    // Add pattern-based information
    if (patterns && patterns.top_patterns && patterns.top_patterns.length > 0) {
      response += "📌 I noticed: " + patterns.top_patterns[0].phrase + ". ";
    }

    Logger.log("   Generated: " + response.substring(0, 50) + "...");
    
    return response + "בואנחקור את זה ביחד! 🧠";
  } catch (e) {
    Logger.log("   ⚠️ Response generation error: " + e.toString());
    return "💬 בואנחקור את זה! 🌟";
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 🔬 ADVANCED ANALYSIS INTEGRATION (Update your handleChatMessage)
// ═════════════════════════════════════════════════════════════════════════════

/*
  // In handleChatMessage, add this after loading brain:
  
  if (ADVANCED_LEARNING_CONFIG.enabled) {
    const patterns = analyzePatterns(message, brain);
    const intents = predictIntent(message, language);
    const context = analyzeContext(message, brain, getConversationHistory(userId));
    const similar = findSimilarPhrases(message, brain);
    
    Logger.log("   📊 Advanced analysis complete");
    Logger.log("   Patterns: " + patterns.total_patterns);
    Logger.log("   Similar phrases: " + similar.length);
  }
*/
