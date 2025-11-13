// ========================================
// Story Generator JavaScript
// ========================================

let generatedStories = [];
let autoGenerateInterval = null;
let isAutoGenerating = false;

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const autoGenerateBtn = document.getElementById('autoGenerateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const storiesContainer = document.getElementById('storiesContainer');

    // Generate Story
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            const config = getGeneratorConfig();

            if (!validateConfig(config)) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Show loading state
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            try {
                const story = await generateStory(config);
                displayStory(story);
                updateStatistics();
                showNotification('Story generated successfully!');
            } catch (error) {
                showNotification('Error generating story. Please try again.', 'error');
                console.error('Generation error:', error);
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Story';
            }
        });
    }

    // Auto Generate Toggle
    if (autoGenerateBtn) {
        autoGenerateBtn.addEventListener('click', function() {
            if (!isAutoGenerating) {
                startAutoGenerate();
                autoGenerateBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto-Generate';
                autoGenerateBtn.style.background = 'var(--error)';
                showNotification('Auto-generation started');
            } else {
                stopAutoGenerate();
                autoGenerateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Auto-Generate (Every 30s)';
                autoGenerateBtn.style.background = '';
                showNotification('Auto-generation stopped');
            }
        });
    }

    // Clear All Stories
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all generated stories?')) {
                generatedStories = [];
                storiesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-wand-magic"></i>
                        <p>Your generated stories will appear here</p>
                        <small>Configure your settings and click "Generate Story" to begin</small>
                    </div>
                `;
                updateStatistics();
                showNotification('All stories cleared');
            }
        });
    }
});

// Get generator configuration
function getGeneratorConfig() {
    return {
        eventType: document.getElementById('eventType').value,
        eventDescription: document.getElementById('eventDescription').value,
        storyStyle: document.getElementById('storyStyle').value,
        storyLength: document.getElementById('storyLength').value,
        language: document.getElementById('language').value,
        includeEmojis: document.getElementById('includeEmojis').checked,
        includeHashtags: document.getElementById('includeHashtags').checked,
        additionalContext: document.getElementById('additionalContext').value
    };
}

// Validate configuration
function validateConfig(config) {
    if (!config.eventType || !config.eventDescription) {
        return false;
    }
    return true;
}

// Generate story using
// AI (simulated)
async function generateStory(config) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const story = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        content: generateStoryContent(config),
        config: config,
        wordCount: 0,
        isFavorite: false
    };

    story.wordCount = story.content.split(' ').length;
    generatedStories.unshift(story);

    return story;
}

// Generate story content based on configuration
function generateStoryContent(config) {
    const templates = {
        sports: {
            dramatic: [
                "🏆 In a breathtaking display of athleticism, the arena erupts as the final whistle blows! The tension was palpable throughout, with every move calculated and every second counting. This is what champions are made of!",
                "⚡ The crowd holds its breath as the decisive moment approaches. Years of training, countless sacrifices, all leading to this single instant. History is being written before our eyes!",
                "🔥 An absolutely electrifying performance that will be remembered for generations! The passion, the dedication, the sheer will to win – this is sports at its finest!"
            ],
            humorous: [
                "😄 Well, that escalated quickly! One moment we're enjoying our popcorn, the next we're witnessing what can only be described as controlled chaos. Someone check if gravity is still working!",
                "🤣 Ladies and gentlemen, we've just witnessed something that physics textbooks would struggle to explain! Is this real life or a video game? The ref looks just as confused as we are!",
                "😂 If you blinked, you missed... actually, no one knows what just happened. But everyone's cheering, so let's just go with it! Sports: where the unexpected becomes the unforgettable!"
            ],
            professional: [
                "📊 An exceptional demonstration of technical prowess and strategic execution. The level of preparation evident in every movement showcases the evolution of modern athletics.",
                "🎯 A masterclass in competitive excellence. The precision, timing, and tactical awareness displayed today sets a new benchmark for aspiring athletes worldwide.",
                "📈 Outstanding performance metrics across all key indicators. This display of athletic superiority demonstrates why preparation and dedication remain the cornerstone of championship-level competition."
            ]
        },
        concert: {
            dramatic: [
                "🎵 The stage ignites with raw energy as thousands of voices unite in perfect harmony! This isn't just a concert – it's a transcendent experience that touches the very soul of music itself!",
                "🎸 Thunder roars through the amplifiers as the crowd becomes one living, breathing entity! Every note strikes like lightning, every beat resonates through our very core!",
                "🌟 Magic unfolds under the spotlights as musical artistry reaches its zenith! This performance will echo through eternity, a testament to the power of live music!"
            ],
            humorous: [
                "😎 That guitar solo just made my coffee vibrate off the table – and I'm not even mad about it! Physics called; it wants its sound barrier back!",
                "🎤 The bass is so deep, I think I just discovered new frequencies! My bones are vibrating in ways I didn't know were possible. This is technically a massage, right?",
                "🎶 When the drop hit, I'm pretty sure we all traveled through time for a second. Someone check if we're still in the same dimension!"
            ],
            professional: [
                "🎼 An exemplary showcase of musical excellence, featuring impeccable acoustics and masterful performance techniques. The artistic direction demonstrates sophisticated understanding of audience engagement.",
                "🎹 Technical precision meets creative expression in this outstanding live performance. The production quality and artist-audience synergy create an immersive auditory experience.",
                "🎺 A distinguished presentation of contemporary musical artistry, combining innovative sound engineering with traditional performance elements for optimal audience impact."
            ]
        },
        gaming: {
            dramatic: [
                "🎮 UNBELIEVABLE! The clutch play of the century just happened! Frame-perfect execution, ice in their veins, and the crowd goes absolutely WILD! This is why we game!",
                "⚔️ The ultimate showdown reaches its climax! Every click, every decision, every millisecond matters! This is competitive gaming at its absolute peak!",
                "🏅 LEGENDARY PLAY! The impossible just became reality! Years of grinding, perfecting every mechanic, all culminating in this jaw-dropping moment of pure gaming excellence!"
            ],
            humorous: [
                "😅 Did we just witness a pro gamer or a button-mashing wizard? Either way, their keyboard is filing for workers' compensation!",
                "🤓 That play was so smooth, even the lag quit out of respect! Someone give this gamer's gaming chair a championship medal!",
                "😜 The enemy team just rage-quit reality itself! GG EZ? More like GG WHAT JUST HAPPENED?!"
            ],
            professional: [
                "📱 Exceptional mechanical skill demonstration with optimal resource management and strategic positioning. Peak performance metrics indicate elite-tier gameplay execution.",
                "💻 Advanced tactical awareness combined with superior technical proficiency results in decisive competitive advantage. Textbook execution of meta strategies.",
                "🖱️ Professional-grade gaming performance showcasing refined mechanics, strategic depth, and exemplary decision-making under pressure. Tournament-caliber execution throughout."
            ]
        },
        news: {
            dramatic: [
                "📰 BREAKING: A pivotal moment unfolds before us! This developing situation carries profound implications that will resonate far beyond this moment!",
                "🔴 LIVE UPDATE: The world watches as events of historic significance continue to unfold! Every second brings new developments in this crucial situation!",
                "⚠️ URGENT: Unprecedented circumstances demand our attention! This is a defining moment that will shape the narrative for years to come!"
            ],
            professional: [
                "📢 Current developments indicate significant movement in ongoing situations. Verified sources confirm multiple aspects of this evolving story, with further updates expected.",
                "🗞️ Official statements released moments ago provide clarity on recent events. Stakeholders are being kept informed as the situation develops in real-time.",
                "📡 Confirmed reports establish timeline and context for current events. Authorities continue to monitor the situation with regular briefings scheduled."
            ]
        },
        other: {
            dramatic: [
                "✨ Something extraordinary is happening right before our eyes! The energy is palpable, the moment is electric, and everyone present can feel that this is truly special!",
                "🌟 We're witnessing something remarkable that defies simple description! This is one of those rare moments that remind us why live events are so incredibly powerful!",
                "🎯 The atmosphere is absolutely charged with anticipation and excitement! Every element comes together perfectly to create an unforgettable experience!"
            ],
            humorous: [
                "😄 Well, this wasn't in the schedule, but we're here for it! Life's best moments are unscripted, and this is definitely making the highlight reel!",
                "🎉 Someone forgot to tell reality that this isn't supposed to be this entertaining! Whatever's happening, please don't stop!",
                "😊 This is either the best or the most chaotic thing we've seen today, and honestly, we're not entirely sure which – but it's definitely memorable!"
            ],
            professional: [
                "📋 Current proceedings demonstrate organized execution of planned activities with measurable outcomes and positive audience engagement metrics.",
                "🔍 Systematic observation reveals well-coordinated elements contributing to overall success of the present undertaking. Efficiency metrics exceed baseline expectations.",
                "📊 Comprehensive analysis indicates successful implementation of strategic objectives with notable achievement of predetermined benchmarks and targets."
            ],
            casual: [
                "👍 Hey, this is pretty cool! Everyone seems to be having a great time, and that's really what it's all about, right? Good vibes all around!",
                "😊 Nice! Things are going well, people are happy, and the energy is just right. Sometimes the best moments are the simple ones!",
                "🙌 Loving the atmosphere here! It's these kinds of moments that make everything worthwhile. Keep it going!"
            ],
            inspirational: [
                "💫 Every moment is an opportunity for greatness, and right now, we're witnessing potential being realized! This is what happens when preparation meets opportunity!",
                "🌈 Beautiful things happen when passion meets purpose! What we're seeing right now is proof that dedication and hard work truly pay off!",
                "⭐ This is a reminder that extraordinary moments come from ordinary people doing extraordinary things! Let this inspire us all to reach higher!"
            ]
        }
    };

    let eventType = config.eventType || 'other';
    let style = config.storyStyle || 'professional';

    // Get appropriate template
    let storyTemplates = templates[eventType]?.[style] || templates.other[style] || templates.other.professional;
    let baseStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];

    // Add context from description
    if (config.eventDescription) {
        const contextSnippet = ` ${config.eventDescription.substring(0, 100)}`;
        baseStory = baseStory.replace(/!$/, ` - ${contextSnippet}!`);
    }

    // Adjust length
    if (config.storyLength === 'short') {
        baseStory = baseStory.split('.')[0] + '.';
    } else if (config.storyLength === 'long') {
        baseStory += ' ' + generateAdditionalContext(eventType, style);
    }

    // Add hashtags if requested
    if (config.includeHashtags) {
        const hashtags = generateHashtags(eventType);
        baseStory += '

' + hashtags;
    }

    // Add additional emojis if requested
    if (config.includeEmojis && !baseStory.match(/[🌀-🧿]/u)) {
        const emojis = ['✨', '🎉', '🔥', '⚡', '💫', '🌟', '🎯', '🏆'];
        baseStory = emojis[Math.floor(Math.random() * emojis.length)] + ' ' + baseStory;
    }

    return baseStory;
}

// Generate additional context for longer stories
function generateAdditionalContext(eventType, style) {
    const contexts = {
        sports: "The level of skill and determination on display today represents countless hours of training and unwavering dedication to excellence.",
        concert: "The synergy between performers and audience creates an electric atmosphere that transforms a simple performance into an unforgettable experience.",
        gaming: "Strategic mastery combined with lightning-fast reflexes showcases the evolution of competitive gaming into a true spectator sport.",
        news: "As more information becomes available, the full scope of these developments will become clearer to all stakeholders involved.",
        other: "The careful attention to detail and genuine enthusiasm from all participants elevates this beyond the ordinary into something truly memorable."
    };

    return contexts[eventType] || contexts.other;
}

// Generate relevant hashtags
function generateHashtags(eventType) {
    const hashtagSets = {
        sports: '#LiveSports #GameDay #Championship #Victory #Athletics #SportsHighlight',
        concert: '#LiveMusic #Concert #MusicLover #Performance #LiveShow #MusicIsLife',
        gaming: '#Gaming #Esports #GamerLife #LiveGaming #GamingCommunity #ProGamer',
        news: '#BreakingNews #LiveUpdate #NewsAlert #CurrentEvents #StayInformed',
        conference: '#Conference #Learning #Professional #Networking #Industry #Innovation',
        wedding: '#Wedding #Celebration #Love #HappilyEverAfter #WeddingDay #Memories',
        cooking: '#Cooking #FoodLover #Recipe #ChefLife #Foodie #Culinary',
        travel: '#Travel #Adventure #Explore #Wanderlust #TravelDiaries #Destination',
        other: '#LiveStream #RealTime #Happening #Experience #Moment #Life'
    };

    return hashtagSets[eventType] || hashtagSets.other;
}

// Display generated story
function displayStory(story) {
    const storiesContainer = document.getElementById('storiesContainer');

    // Remove empty state if present
    const emptyState = storiesContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Create story card
    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';
    storyCard.dataset.id = story.id;

    const timestamp = new Date(story.timestamp).toLocaleString();

    storyCard.innerHTML = `
        <div class="story-header">
            <div class="story-meta">
                <span><i class="fas fa-clock"></i> ${timestamp}</span>
                <span><i class="fas fa-font"></i> ${story.wordCount} words</span>
                <span><i class="fas fa-language"></i> ${story.config.language}</span>
            </div>
            <div class="story-actions">
                <button class="btn-icon favorite-btn" onclick="toggleFavorite(${story.id})">
                    <i class="far fa-heart"></i>
                </button>
                <button class="btn-icon copy-btn" onclick="copyStory(${story.id})">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn-icon download-btn" onclick="downloadStory(${story.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteStory(${story.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="story-content">${story.content}</div>
        <div class="story-tags">
            <span class="tag">${story.config.eventType}</span>
            <span class="tag">${story.config.storyStyle}</span>
            <span class="tag">${story.config.storyLength}</span>
        </div>
    `;

    storiesContainer.insertBefore(storyCard, storiesContainer.firstChild);
}

// Toggle favorite
function toggleFavorite(storyId) {
    const story = generatedStories.find(s => s.id === storyId);
    if (story) {
        story.isFavorite = !story.isFavorite;
        const btn = document.querySelector(`[data-id="${storyId}"] .favorite-btn i`);
        btn.className = story.isFavorite ? 'fas fa-heart' : 'far fa-heart';
        btn.style.color = story.isFavorite ? 'var(--error)' : '';
        updateStatistics();
    }
}

// Copy story to clipboard
function copyStory(storyId) {
    const story = generatedStories.find(s => s.id === storyId);
    if (story) {
        navigator.clipboard.writeText(story.content).then(() => {
            showNotification('Story copied to clipboard!');
        }).catch(err => {
            showNotification('Failed to copy story', 'error');
        });
    }
}

// Download story
function downloadStory(storyId) {
    const story = generatedStories.find(s => s.id === storyId);
    if (story) {
        const blob = new Blob([story.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `story-${story.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Story downloaded!');
    }
}

// Delete story
function deleteStory(storyId) {
    if (confirm('Delete this story?')) {
        generatedStories = generatedStories.filter(s => s.id !== storyId);
        const storyCard = document.querySelector(`[data-id="${storyId}"]`);
        if (storyCard) {
            storyCard.remove();
        }

        // Show empty state if no stories
        const storiesContainer = document.getElementById('storiesContainer');
        if (generatedStories.length === 0) {
            storiesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wand-magic"></i>
                    <p>Your generated stories will appear here</p>
                    <small>Configure your settings and click "Generate Story" to begin</small>
                </div>
            `;
        }

        updateStatistics();
        showNotification('Story deleted');
    }
}

// Update statistics
function updateStatistics() {
    document.getElementById('totalStories').textContent = generatedStories.length;

    const totalWords = generatedStories.reduce((sum, story) => sum + story.wordCount, 0);
    document.getElementById('totalWords').textContent = totalWords;

    const favoriteCount = generatedStories.filter(s => s.isFavorite).length;
    document.getElementById('favoriteCount').textContent = favoriteCount;

    // Calculate average generation time (simulated)
    document.getElementById('avgTime').textContent = '1.5s';
}

// Start auto-generation
function startAutoGenerate() {
    isAutoGenerating = true;
    autoGenerateInterval = setInterval(async () => {
        const config = getGeneratorConfig();
        if (validateConfig(config)) {
            try {
                const story = await generateStory(config);
                displayStory(story);
                updateStatistics();
            } catch (error) {
                console.error('Auto-generation error:', error);
            }
        }
    }, 30000); // Every 30 seconds
}

// Stop auto-generation
function stopAutoGenerate() {
    isAutoGenerating = false;
    if (autoGenerateInterval) {
        clearInterval(autoGenerateInterval);
        autoGenerateInterval = null;
    }
}
