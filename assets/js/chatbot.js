// ========================================
// Chatbot Assistant JavaScript
// ========================================

let chatHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Toggle chatbot
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            chatbotWidget.classList.toggle('active');
        });
    }

    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotWidget.classList.remove('active');
        });
    }

    // Send message
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }

    // Send on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initialize with welcome message
    setTimeout(() => {
        addBotMessage("Hi! I'm your AI assistant. I can help you with:

• Story generation tips
• Feature explanations
• Technical support
• Best practices for live streaming

What would you like to know?");
    }, 1000);
});

// Send message function
function sendMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const message = chatbotInput.value.trim();

    if (!message) return;

    // Add user message
    addUserMessage(message);
    chatHistory.push({ role: 'user', content: message });

    // Clear input
    chatbotInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        hideTypingIndicator();
        addBotMessage(response);
        chatHistory.push({ role: 'bot', content: response });
    }, 1000 + Math.random() * 1000);
}

// Add user message to chat
function addUserMessage(message) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add bot message to chat
function addBotMessage(message) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <span class="loading"></span>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get bot response based on user message
function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! How can I assist you with AI story generation today? Feel free to ask me anything!";
    }

    // Story generation help
    if (lowerMessage.includes('how') && (lowerMessage.includes('generate') || lowerMessage.includes('create'))) {
        return "To generate a story:

1. Select your event type
2. Describe what's happening
3. Choose a writing style
4. Set the story length
5. Click 'Generate Story'

You can also enable auto-generation for continuous updates every 30 seconds!";
    }

    // Style tips
    if (lowerMessage.includes('style') || lowerMessage.includes('tone')) {
        return "We offer multiple writing styles:

• Dramatic: High energy and emotional
• Humorous: Light-hearted and funny
• Professional: Formal and informative
• Casual: Friendly and relaxed
• Inspirational: Motivating and uplifting

Choose based on your audience and content type!";
    }

    // Language support
    if (lowerMessage.includes('language') || lowerMessage.includes('translate')) {
        return "We support 50+ languages! Simply select your preferred language from the dropdown menu. The AI will generate stories in that language automatically.";
    }

    // Features
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
        return "Key features:

✨ Instant AI story generation
🎨 Multiple writing styles
🌍 50+ languages
⚡ Real-time processing
📊 Analytics dashboard
💾 Export & share options
🤖 Auto-generation mode

Explore the Features page for more details!";
    }

    // Best practices
    if (lowerMessage.includes('best practice') || lowerMessage.includes('tip')) {
        return "Pro tips for better stories:

1. Provide detailed event descriptions
2. Choose the right style for your audience
3. Use emojis for social media engagement
4. Add hashtags to increase visibility
5. Experiment with different styles
6. Review and edit before sharing

Practice makes perfect!";
    }

    // Emoji and hashtags
    if (lowerMessage.includes('emoji') || lowerMessage.includes('hashtag')) {
        return "Emojis and hashtags boost engagement! Enable these options in the configuration panel to:

• Make stories more visually appealing
• Increase social media reach
• Express emotions better
• Join trending conversations

Perfect for Instagram, Twitter, and Facebook!";
    }

    // Auto-generate
    if (lowerMessage.includes('auto') || lowerMessage.includes('automatic')) {
        return "Auto-generation creates stories every 30 seconds automatically! Perfect for:

• Live events with continuous action
• Long streaming sessions
• Real-time coverage
• Keeping your audience engaged

Just click the 'Auto-Generate' button to start!";
    }

    // Export and save
    if (lowerMessage.includes('export') || lowerMessage.includes('save') || lowerMessage.includes('download')) {
        return "You can export stories in multiple formats:

• TXT for simple text
• JSON for data processing
• CSV for spreadsheets

Use the download button on each story or export all stories at once!";
    }

    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('free')) {
        return "We offer flexible pricing:

• Free trial: 14 days, full access
• Basic: $9.99/month
• Pro: $29.99/month
• Enterprise: Custom pricing

No credit card required for trial!";
    }

    // Technical support
    if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('help')) {
        return "I'm here to help! Common solutions:

• Refresh the page if stories won't generate
• Check your internet connection
• Clear browser cache
• Try a different browser

Still having issues? Contact support@aistorystream.com";
    }

    // Thanks
    if (lowerMessage.includes('thank')) {
        return "You're welcome! Happy to help. Feel free to ask if you have more questions! 😊";
    }

    // Goodbye
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return "Goodbye! Have a great day and happy storytelling! Feel free to return anytime you need assistance. 👋";
    }

    // Default response
    return "That's a great question! I can help you with:

• Story generation process
• Feature explanations
• Best practices and tips
• Technical support

Could you please rephrase your question or choose a topic above?";
}

// Scroll chat to bottom
function scrollToBottom() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Clear chat history
function clearChat() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    chatbotMessages.innerHTML = `
        <div class="bot-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                Chat cleared! How can I help you?
            </div>
        </div>
    `;
    chatHistory = [];
}
