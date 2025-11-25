// 🎙️ Web Worker - מחזיק הקלטה בחיים באופן קבוע
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let stream = null;

// Broadcast Channel לתקשורת בין דפים
const channel = new BroadcastChannel('hai_emet_recording');

channel.onmessage = async (event) => {
    const { action, language, userId } = event.data;
    
    if (action === 'START_RECORDING') {
        await startRecording(language, userId);
    } else if (action === 'STOP_RECORDING') {
        await stopRecording(userId);
    } else if (action === 'GET_STATUS') {
        channel.postMessage({
            type: 'RECORDING_STATUS',
            isRecording: isRecording,
            chunksCount: audioChunks.length
        });
    }
};

async function startRecording(language, userId) {
    if (isRecording) return;
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false,
                sampleRate: { ideal: 48000 }
            }
        });
        
        const mimeType = 'audio/webm;codecs=opus';
        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
                // שלח עדכון לדפים פעילים
                channel.postMessage({
                    type: 'RECORDING_UPDATE',
                    chunksCount: audioChunks.length,
                    audioSize: e.data.size
                });
            }
        };
        
        mediaRecorder.onstart = () => {
            isRecording = true;
            channel.postMessage({ type: 'RECORDING_STARTED' });
        };
        
        mediaRecorder.onstop = () => {
            isRecording = false;
            channel.postMessage({ type: 'RECORDING_STOPPED' });
        };
        
        mediaRecorder.start(1000); // דוח כל שנייה
        
        channel.postMessage({
            type: 'RECORDING_INITIALIZED',
            language: language,
            userId: userId
        });
        
    } catch (error) {
        channel.postMessage({
            type: 'RECORDING_ERROR',
            error: error.message
        });
    }
}

async function stopRecording(userId) {
    if (!mediaRecorder || !isRecording) return;
    
    mediaRecorder.stop();
    
    // חכה קצת כדי לוודא ש-onstop הופעל
    setTimeout(() => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // שלח את ה-blob בחזרה לדף
        channel.postMessage({
            type: 'AUDIO_BLOB_READY',
            audioBlob: audioBlob,
            userId: userId,
            timestamp: new Date().toISOString()
        });
        
        // נקה את ה-stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        audioChunks = [];
    }, 500);
}

// Send heartbeat כדי לוודא שה-worker עדיין חי
setInterval(() => {
    channel.postMessage({ type: 'WORKER_HEARTBEAT' });
}, 5000);
