// ========================================
// API Integration JavaScript
// ========================================

// API Configuration
const API_CONFIG = {
    // Replace with your actual API endpoint
    baseURL: 'https://api.example.com',
    endpoints: {
        generate: '/generate-story',
        translate: '/translate',
        analyze: '/analyze'
    },
    apiKey: 'YOUR_API_KEY_HERE' // Replace with actual API key
};

// Generate story using real AI API (OpenAI, Anthropic, etc.)
async function generateStoryWithAI(config) {
    try {
        // Example using OpenAI-style API
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.generate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                prompt: buildPrompt(config),
                max_tokens: getMaxTokens(config.storyLength),
                temperature: 0.7,
                language: config.language
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.generated_text || data.choices[0].text;

    } catch (error) {
        console.error('AI API Error:', error);
        // Fallback to local generation
        return generateStoryContent(config);
    }
}

// Build prompt for AI
function buildPrompt(config) {
    let prompt = `Generate a ${config.storyLength} ${config.storyStyle} story for a ${config.eventType} live streaming event. `;
    prompt += `Event description: ${config.eventDescription}. `;

    if (config.additionalContext) {
        prompt += `Additional context: ${config.additionalContext}. `;
    }

    if (config.includeEmojis) {
        prompt += `Include relevant emojis. `;
    }

    if (config.includeHashtags) {
        prompt += `Add relevant hashtags at the end. `;
    }

    prompt += `Make it engaging and suitable for social media.`;

    return prompt;
}

// Get max tokens based on length
function getMaxTokens(length) {
    const tokenMap = {
        'short': 100,
        'medium': 200,
        'long': 400
    };
    return tokenMap[length] || 200;
}

// Translate text using API
async function translateText(text, targetLanguage) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.translate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                text: text,
                target_language: targetLanguage
            })
        });

        if (!response.ok) {
            throw new Error(`Translation failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.translated_text;

    } catch (error) {
        console.error('Translation Error:', error);
        return text; // Return original if translation fails
    }
}

// Analyze sentiment and engagement
async function analyzeContent(text) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.analyze}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {
            throw new Error(`Analysis failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            sentiment: data.sentiment,
            engagement_score: data.engagement_score,
            keywords: data.keywords
        };

    } catch (error) {
        console.error('Analysis Error:', error);
        return null;
    }
}

// Export stories to various formats
function exportStories(stories, format = 'json') {
    let content, mimeType, extension;

    switch (format) {
        case 'json':
            content = JSON.stringify(stories, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;

        case 'csv':
            content = convertToCSV(stories);
            mimeType = 'text/csv';
            extension = 'csv';
            break;

        case 'txt':
            content = stories.map(s => `${s.content}

---

`).join('');
            mimeType = 'text/plain';
            extension = 'txt';
            break;

        default:
            content = JSON.stringify(stories, null, 2);
            mimeType = 'application/json';
            extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stories-export-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
}

// Convert stories to CSV
function convertToCSV(stories) {
    const headers = ['ID', 'Timestamp', 'Content', 'Event Type', 'Style', 'Length', 'Word Count', 'Favorite'];
    const rows = stories.map(story => [
        story.id,
        story.timestamp,
        `"${story.content.replace(/"/g, '""')}"`,
        story.config.eventType,
        story.config.storyStyle,
        story.config.storyLength,
        story.wordCount,
        story.isFavorite
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Share to social media platforms
function shareToSocial(story, platform) {
    const text = encodeURIComponent(story.content);
    const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${text}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
        whatsapp: `https://wa.me/?text=${text}`
    };

    if (urls[platform]) {
        window.open(urls[platform], '_blank', 'width=600,height=400');
    } else {
        console.warn(`Platform ${platform} is not supported for sharing`);
    }
}

// WebSocket connection for real-time updates (if using live streaming API)
class LiveStreamConnection {
    constructor(streamUrl) {
        this.streamUrl = streamUrl;
        this.ws = null;
        this.listeners = [];
    }

    connect() {
        if (!window.WebSocket) {
            console.error('WebSocket is not supported by this browser');
            return;
        }
        this.ws = new WebSocket(this.streamUrl);

        this.ws.onopen = () => {
            console.log('Connected to live stream');
            this.notifyListeners('connected', null);
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.notifyListeners('data', data);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.notifyListeners('error', error);
        };

        this.ws.onclose = () => {
            console.log('Disconnected from live stream');
            this.notifyListeners('disconnected', null);
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(listener => listener(event, data));
    }
}
