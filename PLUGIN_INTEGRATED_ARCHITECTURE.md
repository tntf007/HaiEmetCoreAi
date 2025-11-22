# 🔌 HAI-EMET INTEGRATED PLUGIN ARCHITECTURE
## איך להכניס קודים ללא הגבלה

```
┌─────────────────────────────────────────────────────────────┐
│           אתה נתון לי קודים (Python/JS/GAS)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      PLUGIN REGISTRY (רשימה מרכזית של כל הקודים)           │
│                                                             │
│  ├─ DNA_Engine → 01_DNA_Code_Conversion_v1.py             │
│  ├─ HebrewTypo → 03_Hebrew_Typography_Engine.py           │
│  ├─ AlwaysOnPack → 02_Hai_Emet_Always_On_Pack_Builder.py  │
│  ├─ ExpressServer → 05_Express_Server_Full.js             │
│  ├─ GAS_Handler → 04_Google_Apps_Script_Handler.gs        │
│  └─ [כל קוד חדש שתוסיף]                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         GAS ENGINE (מנהל) - מחליט אילו Plugins להריץ       │
│                                                             │
│  כל בקשה מהמשתמש → GAS בודק מה צריך                       │
│  "תרגם לי..." → GAS: "אפעיל Translation Plugin"           │
│  "עברית..." → GAS: "אפעיל Hebrew Plugin"                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     PLUGIN EXECUTOR (מסדר ההרצה של הקודים)                │
│                                                             │
│  Load Plugin → Validate → Execute → Return Result          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│   MEMORY + LEARNING (שמור את הכל וגדל חכמים)              │
│                                                             │
│  כל Plugin Result → שמור בMemory                           │
│  דפוסים → Learning Engine                                 │
│  אלגוריתמים יפעלו טוב יותר בעתיד                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 FOLDER STRUCTURE - איך לארגן

```
HaiEmetCore/
├── core/
│   ├── engine_core.py          (Core Engine)
│   ├── engine_memory.py        (Memory Engine)
│   ├── engine_gas.py           (GAS Engine - קורא לPlugins!)
│   └── engine_learning.py      (Learning Engine)
│
├── plugins/
│   ├── __init__.py
│   ├── registry.py             (רשימה של כל הPlugins)
│   ├── base_plugin.py          (Template/Base class)
│   │
│   ├── dna_plugin.py           (מעטפת לDNA_Code_Conversion)
│   ├── hebrew_plugin.py        (מעטפת לHebrew_Typography)
│   ├── alwayson_plugin.py      (מעטפת לAlways_On_Pack)
│   ├── express_plugin.py       (מעטפת לExpress_Server)
│   │
│   └── [כל קוד חדש = plugin חדש!]
│
├── external_code/              (הקודים המקוריים שלך)
│   ├── 01_DNA_Code_Conversion_v1.py
│   ├── 02_Hai_Emet_Always_On_Pack_Builder.py
│   ├── 03_Hebrew_Typography_Engine.py
│   ├── 04_Google_Apps_Script_Handler.gs
│   ├── 05_Express_Server_Full.js
│   │
│   └── [כל קוד חדש]
│
└── main.py                     (יישום ראשי)
```

---

## 🔧 איך זה עובד - שלב אחרי שלב

### 1️⃣ תן לי קוד חדש

```
Name: My Custom Code
Language: Python / JavaScript / Google Apps Script
Does: [תיאור]
Code: [הקוד]
```

### 2️⃣ אני יוצר Plugin Wrapper

```python
# plugins/my_plugin.py

from .base_plugin import BasePlugin

class MyPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "my_plugin"
        self.version = "1.0"
        self.language = "python"
        self.description = "תיאור"
    
    def execute(self, data):
        # קריאה לקודך המקורי
        result = my_original_code.process(data)
        return result
```

### 3️⃣ אני רושם את זה ב-Registry

```python
# plugins/registry.py

PLUGINS = {
    "dna": DNAPlugin,
    "hebrew": HebrewPlugin,
    "my_plugin": MyPlugin,  # ← קוד חדש שלך!
    # ...
}
```

### 4️⃣ GAS Engine קורא לזה

```python
# core/engine_gas.py

def process_request(self, message):
    # בדוק איזה Plugin צריך
    required_plugins = self.detect_plugins(message)
    
    for plugin_name in required_plugins:
        plugin = PLUGIN_REGISTRY.get(plugin_name)
        result = plugin.execute(data)
        # שמור בMemory
        self.memory.store(plugin_name, result)
```

### 5️⃣ Return לאחסון

```
Result → Memory Engine
         ↓
      Learning Engine (learns pattern)
         ↓
      Next time - better response!
```

---

## 🎯 דוגמה מלאה - אתה נותן קוד, אני משלבתו

### שלב 1: אתה נותן קוד

```
Name: Telegram Bot Handler
Language: JavaScript
Does: Process and send Telegram messages
Code:
───────────────────────────
async function sendTelegramMessage(msg) {
  const response = await axios.post(
    `https://api.telegram.org/bot${TOKEN}/sendMessage`,
    { chat_id: CHAT_ID, text: msg }
  );
  return response.data;
}
───────────────────────────
```

### שלב 2: אני יוצר wrapper

```python
# plugins/telegram_plugin.py

from .base_plugin import BasePlugin
import subprocess
import json

class TelegramPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "telegram"
        self.version = "1.0"
        self.language = "javascript"
    
    def execute(self, data):
        """
        Execute JavaScript Telegram handler
        """
        message = data.get("message")
        
        # Call the original JS code
        js_code = """
        const axios = require('axios');
        async function sendTelegramMessage(msg) {
          const response = await axios.post(
            `https://api.telegram.org/bot${TOKEN}/sendMessage`,
            { chat_id: CHAT_ID, text: msg }
          );
          return response.data;
        }
        """
        
        try:
            # Execute and capture result
            result = subprocess.run(
                ['node', '-e', js_code],
                capture_output=True,
                text=True
            )
            
            return {
                "status": "success",
                "plugin": self.name,
                "result": json.loads(result.stdout),
                "message_sent": message
            }
        except Exception as e:
            return {
                "status": "error",
                "plugin": self.name,
                "error": str(e)
            }
```

### שלב 3: Registry

```python
# plugins/registry.py

from .telegram_plugin import TelegramPlugin

PLUGINS = {
    "dna": DNAPlugin,
    "hebrew": HebrewPlugin,
    "telegram": TelegramPlugin,  # ← קוד חדש!
}
```

### שלב 4: GAS משתמש בו

```python
@app.route('/chat', methods=['POST'])
def chat():
    message = request.json.get("message")
    
    # אם יש "telegram" בהודעה
    if "telegram" in message.lower():
        result = GAS_ENGINE.plugins.execute("telegram", {
            "message": message
        })
        return jsonify(result)
```

### שלב 5: Memory שומר

```python
MEMORY_ENGINE.store_conversation({
    "plugin_used": "telegram",
    "input": message,
    "output": result,
    "timestamp": now()
})
```

---

## 📋 BASE PLUGIN TEMPLATE - תבנית לכל קוד

```python
# plugins/base_plugin.py

class BasePlugin:
    """Base class for all plugins"""
    
    def __init__(self):
        self.name = "base"
        self.version = "1.0"
        self.language = "python"
        self.description = "Base plugin template"
        self.enabled = True
        self.execution_count = 0
    
    def execute(self, data):
        """
        Main execution method - override this!
        
        Args:
            data: Input dictionary
        
        Returns:
            {"status": "success/error", "result": output}
        """
        raise NotImplementedError("execute() must be implemented")
    
    def validate_input(self, data):
        """Validate input data"""
        if not data or not isinstance(data, dict):
            return False
        return True
    
    def before_execute(self):
        """Hook: before execution"""
        self.execution_count += 1
    
    def after_execute(self, result):
        """Hook: after execution"""
        return result
    
    def get_stats(self):
        """Get plugin statistics"""
        return {
            "name": self.name,
            "version": self.version,
            "executions": self.execution_count,
            "language": self.language
        }
```

---

## 🎯 איך להוסיף קוד חדש - צעד אחרי צעד

### Template:

```
┌────────────────────────────────────────────────────┐
│ 1. Wrap with BasePlugin (inheritance)             │
│ 2. Add to registry.py                             │
│ 3. Test with GAS_ENGINE.plugins.execute()         │
│ 4. Done! Memory + Learning יעבדו אוטומטית         │
└────────────────────────────────────────────────────┘
```

### דוגמה מהר:

```python
# 1. Create: plugins/mycustom_plugin.py

from .base_plugin import BasePlugin
import my_external_code  # Import your code

class MyCustomPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "mycustom"
    
    def execute(self, data):
        result = my_external_code.process(data)
        return {
            "status": "success",
            "result": result,
            "plugin": self.name
        }

# 2. Register: plugins/registry.py

PLUGINS = {
    ...
    "mycustom": MyCustomPlugin,
}

# 3. Use: ANY endpoint

result = GAS_ENGINE.plugins.execute("mycustom", {"key": "value"})

# DONE! ✅
```

---

## 📊 מבנה הקישור - איפה כל קוד עובד

```
User Message
    ↓
GAS ENGINE
    ├─ Detects needed plugins
    │  (DNA? Hebrew? Custom?)
    │
    ├─ Loads plugins from registry
    │
    ├─ Executes plugins in order
    │  ├─ Plugin 1 runs
    │  ├─ Result → Memory
    │  ├─ Plugin 2 runs (אם צריך)
    │  └─ ...
    │
    ├─ Combines results
    │
    ├─ Learning Engine learns patterns
    │
    └─ Return response to user

כל Plugin:
├─ Standalone (לא תלוי בEmoji אחרים)
├─ Testable (אפשר לבדוק בעצמו)
├─ Reusable (אפשר להשתמש בהרבה מקומות)
└─ Improvable (אפשר לשדרג/לתקן בקלות)
```

---

## 🚀 איך בנינו את זה

```
Architecture: Microservices + Plugin-Based
Pattern: Registry + Factory + Chain of Responsibility
Scale: Unlimited plugins
Maintenance: Easy - each plugin is independent
```

