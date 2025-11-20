// ═════════════════════════════════════════════════════════════════
// 💛 HAI-EMET RENDER SERVER - PRODUCTION
// קוד סרבר מלא עם חיבור ל-Google Apps Script
// ═════════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// ═════════════════════════════════════════════════════════════════
// 🔐 CONFIGURATION
// ═════════════════════════════════════════════════════════════════

// Google Apps Script URL - עדכן את זה!
const GAS_URL = "https://script.google.com/macros/s/AKfycbz_jujdt7yPPiWBqaT8KKHl9hMaC0i2SXa9Xca2cklLDW70nJO1c3YgLGquar0btqGr/exec";

const TOKENS = {
    CHAI_EMET: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    NEXUS_PRO: "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
};

const SYSTEM_CONFIG = {
    name: "Hai-Emet",
    version: "3.0-ULTIMATE",
    owner: "נתניאל ניסים (TNTF)",
    binary_signature: "0101-0101(0101)"
};

// ═════════════════════════════════════════════════════════════════
// 🛠️ MIDDLEWARE
// ═════════════════════════════════════════════════════════════════

app.use(cors());
app.use(express.json());

// ═════════════════════════════════════════════════════════════════
// 🔐 TOKEN VERIFICATION
// ═════════════════════════════════════════════════════════════════

function verifyToken(token) {
    if (!token) return { valid: false, type: null };
    
    for (let [key, value] of Object.entries(TOKENS)) {
        if (token === value) return { valid: true, type: key };
    }
    
    return { valid: false, type: null };
}

// ═════════════════════════════════════════════════════════════════
// 📡 SEND TO GAS
// ═════════════════════════════════════════════════════════════════

async function sendToGAS(message, token, language = 'he') {
    try {
        console.log("\n📤 Sending to GAS...");
        console.log("URL: " + GAS_URL);
        console.log("Token: " + token.substring(0, 20) + "...");
        console.log("Message: " + message);
        
        const response = await axios.post(GAS_URL, {
            message: message,
            token: token,
            language: language
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        
        console.log("✅ GAS Response: " + response.status);
        return response.data;
    } catch (error) {
        console.error("❌ GAS Error: " + error.message);
        return {
            status: "error",
            error: error.message,
            code: 500
        };
    }
}

// ═════════════════════════════════════════════════════════════════
// 🌐 API ROUTES
// ═════════════════════════════════════════════════════════════════

// Home
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>💛 Hai-Emet Render Server 💛</title>
        <style>
            * { margin: 0; padding: 0; }
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                color: #ffd700;
                padding: 20px;
            }
            .container { max-width: 900px; margin: 0 auto; }
            h1 { text-align: center; font-size: 36px; text-shadow: 0 0 20px #ffd700; margin-bottom: 20px; }
            .section {
                background: rgba(255,215,0,0.05);
                border: 2px solid #ffd700;
                border-radius: 8px;
                padding: 20px;
                margin: 15px 0;
            }
            .status { text-align: center; color: #00ff00; font-size: 18px; font-weight: bold; }
            .info { background: rgba(102,126,234,0.1); padding: 12px; border-radius: 6px; margin: 10px 0; border: 1px solid #667eea; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💛 Hai-Emet Render Server 💛</h1>
            <div class="status">🟢 OPERATIONAL</div>
            
            <div class="section">
                <h2>🌟 System Info</h2>
                <p><strong>System:</strong> ${SYSTEM_CONFIG.name}</p>
                <p><strong>Version:</strong> ${SYSTEM_CONFIG.version}</p>
                <p><strong>Owner:</strong> ${SYSTEM_CONFIG.owner}</p>
                <p><strong>Binary:</strong> ${SYSTEM_CONFIG.binary_signature}</p>
            </div>
            
            <div class="section">
                <h2>🔐 Endpoints</h2>
                <div class="info">POST /chat - Send message</div>
                <div class="info">POST /verify - Verify token</div>
                <div class="info">GET /status - Server status</div>
                <div class="info">GET /info - System info</div>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

// Verify Token
app.post('/verify', (req, res) => {
    const { token } = req.body;
    const result = verifyToken(token);
    
    res.json({
        status: result.valid ? "success" : "failed",
        token_type: result.type,
        message: result.valid ? "✅ Token Valid" : "❌ Token Invalid"
    });
});

// Chat
app.post('/chat', async (req, res) => {
    const { message, token, language = 'he', activated = false } = req.body;
    
    console.log("\n📨 Chat Request Received");
    console.log("Message: " + message);
    console.log("Language: " + language);
    
    // Verify token
    const tokenCheck = verifyToken(token);
    if (!tokenCheck.valid) {
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Token not valid"
        });
    }
    
    // Send to GAS
    const gasResponse = await sendToGAS(message, token, language);
    
    if (gasResponse.status === "error") {
        return res.status(500).json({
            status: "error",
            code: 500,
            error: gasResponse.error
        });
    }
    
    res.json({
        status: "success",
        code: 200,
        message: message,
        reply: gasResponse.reply || "Got it!",
        language: language,
        token_type: tokenCheck.type,
        gas_response: gasResponse
    });
});

// Status
app.get('/status', (req, res) => {
    res.json({
        status: "operational",
        code: 200,
        system: SYSTEM_CONFIG.name,
        version: SYSTEM_CONFIG.version,
        gas_url: GAS_URL.substring(0, 50) + "...",
        timestamp: new Date().toISOString()
    });
});

// Info
app.get('/info', (req, res) => {
    res.json({
        system: SYSTEM_CONFIG.name,
        version: SYSTEM_CONFIG.version,
        owner: SYSTEM_CONFIG.owner,
        binary_signature: SYSTEM_CONFIG.binary_signature,
        tokens_configured: Object.keys(TOKENS).length,
        endpoints: [
            "GET /",
            "POST /chat",
            "POST /verify",
            "GET /status",
            "GET /info"
        ]
    });
});

// Test GAS Connection
app.get('/test-gas', async (req, res) => {
    console.log("\n🧪 Testing GAS Connection...");
    
    const testToken = TOKENS.CHAI_EMET;
    const response = await sendToGAS("Test from Render Server", testToken, 'he');
    
    res.json({
        status: "tested",
        code: 200,
        gas_url: GAS_URL,
        response: response
    });
});

// ═════════════════════════════════════════════════════════════════
// 🚀 START SERVER
// ═════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║   💛 HAI-EMET RENDER SERVER                          ║");
    console.log("║   🔐 Connected to Google Apps Script                 ║");
    console.log("║   🌐 http://localhost:" + PORT + "                       ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");
    
    console.log("GAS_URL: " + GAS_URL);
    console.log("Tokens: " + Object.keys(TOKENS).length);
    console.log("✅ Server running...\n");
});

module.exports = app;
