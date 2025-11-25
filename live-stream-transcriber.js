/**
 * 🎬 Live Stream Detector & Real-time Transcriber
 * זהוי streams חיים + תמלול בזמן אמת + כתוביות חיות
 */

class LiveStreamTranscriber {
    constructor() {
        this.isStreamActive = false;
        this.streamUrl = null;
        this.mediaElement = null;
        this.audioContext = null;
        this.analyser = null;
        this.mediaStreamAudioSourceNode = null;
        this.transcriptBuffer = [];
        this.isTranscribing = false;
    }

    /**
     * 🔍 זהה סוג stream מ-URL
     */
    detectStreamType(url) {
        if (!url) return null;

        // HLS streams
        if (url.includes('.m3u8')) {
            return { type: 'HLS', format: 'application/x-mpegURL' };
        }
        
        // DASH streams
        if (url.includes('.mpd')) {
            return { type: 'DASH', format: 'application/dash+xml' };
        }
        
        // YouTube Live
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return { type: 'YOUTUBE', format: 'youtube' };
        }
        
        // Twitch Live
        if (url.includes('twitch.tv')) {
            return { type: 'TWITCH', format: 'twitch' };
        }
        
        // Direct MP4/WebM
        if (url.includes('.mp4') || url.includes('.webm')) {
            return { type: 'DIRECT', format: 'video/mp4' };
        }
        
        // Generic video element (iframe, embed)
        if (url.includes('iframe') || url.includes('embed')) {
            return { type: 'EMBEDDED', format: 'embedded' };
        }
        
        // מדיה stream
        if (url.includes('blob:') || url.includes('data:')) {
            return { type: 'BLOB', format: 'blob' };
        }

        return { type: 'UNKNOWN', format: 'unknown' };
    }

    /**
     * 🎥 טען stream דינמי
     */
    async loadStream(url, containerElement) {
        try {
            const streamType = this.detectStreamType(url);
            
            if (!containerElement) {
                containerElement = document.getElementById('streamContainer') || 
                                 document.createElement('div');
            }

            console.log(`🎬 Loading stream: ${streamType.type}`);

            switch (streamType.type) {
                case 'HLS':
                    await this.loadHLSStream(url, containerElement);
                    break;
                case 'DASH':
                    await this.loadDASHStream(url, containerElement);
                    break;
                case 'YOUTUBE':
                    await this.loadYouTubeStream(url, containerElement);
                    break;
                case 'DIRECT':
                    await this.loadDirectStream(url, containerElement);
                    break;
                default:
                    await this.loadDirectStream(url, containerElement);
            }

            this.streamUrl = url;
            this.isStreamActive = true;
            return true;
        } catch (error) {
            console.error('❌ Stream load error:', error);
            return false;
        }
    }

    /**
     * 📺 טען HLS stream
     */
    async loadHLSStream(url, container) {
        // צריך hls.js library
        if (typeof Hls === 'undefined') {
            console.warn('⚠️ HLS.js not loaded, using fallback');
            return this.loadDirectStream(url, container);
        }

        const video = document.createElement('video');
        video.id = 'liveStreamVideo';
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = 'auto';

        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);

        container.appendChild(video);
        this.mediaElement = video;
        
        await this.setupAudioCapture(video);
    }

    /**
     * 🎞️ טען DASH stream
     */
    async loadDASHStream(url, container) {
        // צריך dash.js library
        if (typeof dashjs === 'undefined') {
            console.warn('⚠️ DASH.js not loaded, using fallback');
            return this.loadDirectStream(url, container);
        }

        const video = document.createElement('video');
        video.id = 'liveStreamVideo';
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = 'auto';

        const player = dashjs.MediaPlayer().create();
        player.initialize(video, url, true);

        container.appendChild(video);
        this.mediaElement = video;

        await this.setupAudioCapture(video);
    }

    /**
     * 🎥 טען YouTube stream
     */
    async loadYouTubeStream(url, container) {
        // Extract video ID
        const videoId = this.extractYouTubeId(url);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '400';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        container.appendChild(iframe);
        
        // ⚠️ YouTube blocks audio extraction לשיקולי מדיניות
        console.warn('⚠️ YouTube streams cannot be captured directly (DRM protected)');
    }

    /**
     * 📹 טען Direct stream (MP4, WebM, etc)
     */
    async loadDirectStream(url, container) {
        const video = document.createElement('video');
        video.id = 'liveStreamVideo';
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = 'auto';

        const source = document.createElement('source');
        source.src = url;
        source.type = this.detectStreamType(url).format || 'video/mp4';

        video.appendChild(source);
        container.appendChild(video);

        this.mediaElement = video;
        await this.setupAudioCapture(video);
    }

    /**
     * 🎤 קבע capture של קול מ-video/audio element
     */
    async setupAudioCapture(mediaElement) {
        try {
            // Create AudioContext if needed
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Create MediaElementAudioSourceNode
            if (!this.mediaStreamAudioSourceNode) {
                this.mediaStreamAudioSourceNode = this.audioContext.createMediaElementSource(mediaElement);
            }

            // Create analyser for volume visualization
            if (!this.analyser) {
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 2048;
            }

            // Connect nodes
            this.mediaStreamAudioSourceNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            console.log('✅ Audio capture ready');
            return true;
        } catch (error) {
            console.error('❌ Audio setup error:', error);
            return false;
        }
    }

    /**
     * 🎙️ התחל תמלול בזמן אמת
     */
    async startLiveTranscription(language = 'he-IL', outputElement = null) {
        if (!this.mediaElement) {
            console.error('❌ No stream loaded');
            return false;
        }

        this.isTranscribing = true;
        this.transcriptBuffer = [];

        if (!outputElement) {
            outputElement = document.getElementById('liveTranscription') || 
                          document.getElementById('videoTranscript');
        }

        console.log('🎙️ Starting live transcription...');

        // Simulate real-time transcription chunks
        const transcriptionInterval = setInterval(async () => {
            if (!this.isTranscribing) {
                clearInterval(transcriptionInterval);
                return;
            }

            // כאן תוך כדי הזמן, הקול מ-stream מתמלל
            // בתרחיש אמיתי - היו משתמשים ב-Web Audio API + Speech-to-Text
            
            // placeholder: simulate transcription
            const chunk = `[${new Date().toLocaleTimeString()}] בדוק קול...`;
            this.transcriptBuffer.push(chunk);

            if (outputElement) {
                outputElement.textContent = this.transcriptBuffer.join('\n');
                outputElement.scrollTop = outputElement.scrollHeight;
            }
        }, 2000);

        return true;
    }

    /**
     * ⏹️ עצור תמלול
     */
    stopLiveTranscription() {
        this.isTranscribing = false;
        console.log('⏹️ Transcription stopped');
    }

    /**
     * 🔌 עצור stream
     */
    stopStream() {
        if (this.mediaElement) {
            this.mediaElement.pause();
            this.mediaElement.src = '';
        }
        this.isStreamActive = false;
        this.stopLiveTranscription();
        console.log('🔌 Stream stopped');
    }

    /**
     * 🔍 חלץ YouTube ID מ-URL
     */
    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }
}

// Export for use
window.LiveStreamTranscriber = LiveStreamTranscriber;
