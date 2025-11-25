# 🎙️ Hai-Emet v4.1 - Persistent Recording (Web Worker)

## ✨ תכונה חדשה: הקלטה רציפה

כעת אתה יכול **להקליט צליל ברצף** גם אם אתה עובר לדפים אחרים! 

### 🔧 איך זה עובד:

1. **Web Worker** - פועל בתהליך נפרד (לא מושפע מעדכוני DOM)
2. **Broadcast Channel API** - תקשורת בין דפים שונים
3. **Service Worker** - (אופציונלי) לשמור קלטה אם הבדיקר נסגר

---

## 📦 קבצים בתוך ZIP:

```
app.py                      ← Flask Backend
index.html                  ← UI + Web Worker init
recording-worker.js         ← 🎙️ Worker for persistent recording
HAI_EMET_GAS_Integration_v4.gs  ← Google Apps Script
requirements.txt            ← Python dependencies
```

---

## 🚀 התקנה:

### **1. Extract the ZIP:**
```bash
unzip Hai-Emet-v4.1-READY.zip
```

### **2. Upload all files to Render / Server:**

#### **For Render.com:**
```
your-app/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    └── recording-worker.js    ← 🎙️ PUT HERE
```

#### **Directory structure matters!**

**index.html should load recording-worker.js:**
```html
<script>
    // init code loads: recording-worker.js
</script>
```

---

## 💡 איך להשתמש:

### **בדף המרשימות (index.html):**

1. **לחץ על כפתור הקלטה:**
   ```
   🎤 הקלט ← לחץ פעם אחת להתחיל
   ```

2. **דבר בעברית** (קול יוקלט בעזרת Web Worker)

3. **עבור לדף אחר** (הקלטה ממשיכה!)

4. **חוזר לדף המרשימות:**
   ```
   ⏹️ עצור הקלטה ← לחץ כדי לעצור
   ```

5. **תמלול וטרנסקריפציה באופן אוטומטי** ✅

---

## 🔐 Technical Details:

### **Web Worker lifecycle:**

```javascript
// 🎙️ Worker starts recording
Worker: START_RECORDING
  ↓
// 🌐 Continues even if user navigates
Browser: navigate to another page
  ↓
// ↔️ Communication via Broadcast Channel
Channel: STOP_RECORDING
  ↓
// 📤 Upload audio blob
Server: /transcribe endpoint
  ↓
// ✅ Transcription complete
UI: Display result
```

### **Broadcast Channel Messages:**

```javascript
// Start recording
channel.postMessage({
    action: 'START_RECORDING',
    language: 'he-IL',
    userId: 'user123'
});

// Stop recording
channel.postMessage({
    action: 'STOP_RECORDING',
    userId: 'user123'
});

// Get status
channel.postMessage({
    action: 'GET_STATUS'
});
```

---

## 🛠️ Troubleshooting:

### **Web Worker not loading?**

❌ Error: `Failed to construct 'Worker'`

✅ Solution:
- Ensure `recording-worker.js` is in the same directory as `index.html`
- Or update the path in init code:
  ```javascript
  recordingWorker = new Worker('/static/recording-worker.js');
  ```

### **Recording stops after navigation?**

❌ This means Web Worker init failed

✅ Fallback: System uses old audio recording method (still works!)

### **Cannot upload audio?**

Check:
- Server `/transcribe` endpoint is working
- CORS headers allow POST requests
- Audio blob is not empty (check console logs)

---

## 📊 Console Logs:

Open DevTools (F12) and check console for:

```
✅ Recording worker initialized
🎤 Recording started...
📤 Uploading...
✅ Recording uploaded and transcribed!
```

---

## 🎯 Features:

✅ **Persistent Recording** - קלטה רציפה
✅ **No Page Reload Required** - ללא צורך לרענן דף
✅ **Auto Transcription** - תמלול אוטומטי
✅ **16 Languages** - 16 שפות
✅ **iOS + Android** - כל מכשירים
✅ **Graceful Fallback** - חזרה למצב רגיל אם Web Worker נכשל

---

## 🔗 Links:

- **Server:** https://haiemetweb.onrender.com
- **GAS Brain:** https://script.google.com/macros/s/AKfycbye.../exec
- **Status:** ✅ PRODUCTION READY

---

**Made with 💛 by TNTF | Hai-Emet AI Assistant**

Binary: `0101-0101(0101)` ✨
