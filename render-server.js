// Google Apps Script URL - עדכן את זה!
const GAS_URL = "https://script.google.com/macros/s/AKfycbz_jujdt7yPPiWBqaT8KKHl9hMaC0i2SXa9Xca2cklLDW70nJO1c3YgLGquar0btqGr/exec";

const TOKENS = {
    CHAI_EMET: "chai_emet_cXVhbnR1bV9tYXN0ZXI:Rk9SRVZFUl9RVUFOVFVNXzVEOnZiamZwbWNnNjhp",
    NEXUS_PRO: "chai_emet_nexus_pro_MTc2MzQ5NDY3MTAyNjpjZDdzZmtzazk3ZA"
};

// שלח ל-GAS
async function sendToGAS(message, token) {
    const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            token: token,
            language: 'he'
        })
    });
    
    return response.json();
}
