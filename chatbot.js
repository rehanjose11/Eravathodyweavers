(function () {
    function getScriptBase() {
        var current = document.currentScript;
        return current && current.src ? current.src : window.location.href;
    }

    var scriptBase = getScriptBase();
    var mascotSrc = new URL('peeliboticon.jpg', scriptBase).href;
    var pageBase = scriptBase;

    var TOPIC_RULES = [
        {
            key: 'home',
            page: 'index.html',
            openReply: 'Opening the homepage.',
            reply: 'The homepage introduces Eravathody Handloom Weavers in Thiruvilwamala and points to the main sections of the site.',
            keywords: ['home page', 'homepage', 'landing page', 'main page', 'home']
        },
        {
            key: 'about',
            page: 'about/about.html',
            openReply: 'Opening the About page.',
            reply: 'The About page explains the history of Eravathody, the weaving community, and how the society has grown since 1941.',
            keywords: ['about page', 'about us', 'our story', 'history', 'heritage', 'origin', 'legacy', 'society formed', '1941', 'mudaliyar']
        },
        {
            key: 'craft',
            page: 'the craft/craft.html',
            openReply: 'Opening the Craft page.',
            reply: 'The Craft page shows the weaving process, including winding, warping, dyeing, and loom work.',
            keywords: ['craft page', 'the craft', 'weaving process', 'loom', 'weaving', 'thread', 'warp', 'warping', 'winding', 'dyeing', 'process']
        },
        {
            key: 'weavers',
            page: 'our weavers/weavers.html',
            openReply: 'Opening the Our Weavers page.',
            reply: 'The Our Weavers page introduces the artisans who keep the handloom tradition alive through generations.',
            keywords: ['our weavers', 'weavers page', 'weaver', 'weavers', 'artisan', 'artisans', 'members', 'profile']
        },
        {
            key: 'products',
            page: 'products/products.html',
            openReply: 'Opening the Products page.',
            reply: 'The Products page features Kasavu sarees, Set Mundu, Double Mundu, and other handwoven fabrics made at Eravathody.',
            keywords: ['products page', 'products', 'product', 'kasavu', 'set mundu', 'double mundu', 'saree', 'sarees', 'mundu', 'fabric', 'fabrics', 'yardage']
        },
        {
            key: 'gallery',
            page: 'gallery/gallery.html',
            openReply: 'Opening the Gallery page.',
            reply: 'The Gallery page shows the weaving society, fabrics, and visual moments from the craft.',
            keywords: ['gallery page', 'gallery', 'photo', 'photos', 'image', 'images', 'picture', 'pictures', 'visual']
        },
        {
            key: 'contact',
            page: 'contact/contact.html',
            openReply: 'Opening the Contact page.',
            reply: 'The Contact page has the office address, phone number, email, and location details in Thiruvilwamala.',
            keywords: ['contact page', 'contact us', 'phone', 'address', 'location', 'email', 'reach', 'visit', 'call us']
        }
    ];

    function normalizeText(text) {
        return String(text || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function containsAny(text, terms) {
        for (var i = 0; i < terms.length; i += 1) {
            if (text.indexOf(terms[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function scoreTopic(text, rule) {
        var score = 0;
        for (var i = 0; i < rule.keywords.length; i += 1) {
            if (text.indexOf(rule.keywords[i]) !== -1) {
                score += rule.keywords[i].split(' ').length;
            }
        }
        return score;
    }

    function pickTopic(text) {
        var bestRule = null;
        var bestScore = 0;

        for (var i = 0; i < TOPIC_RULES.length; i += 1) {
            var rule = TOPIC_RULES[i];
            var score = scoreTopic(text, rule);
            if (score > bestScore) {
                bestScore = score;
                bestRule = rule;
            }
        }

        return bestRule;
    }

    function pageUrl(path) {
        return new URL(path, pageBase).href;
    }

    function buildWidgetMarkup() {
        return [
            '<div class="peeli-bot" id="peeliBot">',
            '  <button class="peeli-bot__launcher" id="peeliBotToggle" type="button" aria-controls="peeliBotPanel" aria-expanded="false">',
            '    <img src="' + mascotSrc + '" alt="Peacock mascot for Peeli Bot" class="peeli-bot__mascot">',
            '    <span class="peeli-bot__copy">',
            '      <span class="peeli-bot__label">Tap for</span>',
            '      <span class="peeli-bot__name">Peeli Bot</span>',
            '    </span>',
            '  </button>',
            '  <div class="peeli-bot__panel" id="peeliBotPanel" aria-hidden="true">',
            '    <button class="peeli-bot__close" id="peeliBotClose" type="button" aria-label="Close Peeli Bot">×</button>',
            '    <p class="peeli-bot__eyebrow">Peeli Bot</p>',
            '    <p class="peeli-bot__message" id="peeliBotMessage" aria-live="polite">Ask me about the website or type "open products" to jump to a page.</p>',
            '    <div class="peeli-bot__chat" id="peeliBotChat" aria-label="Chat conversation" aria-live="polite">',
            '      <div class="peeli-bot__bubble peeli-bot__bubble--bot">I can answer questions about home, about, craft, weavers, products, gallery, and contact.</div>',
            '    </div>',
            '    <div class="peeli-bot__composer">',
            '      <input class="peeli-bot__input" id="peeliBotInput" type="text" placeholder="Type your message" autocomplete="off">',
            '      <button class="peeli-bot__send" id="peeliBotSend" type="button">Send</button>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function ensureWidget() {
        var existing = document.getElementById('peeliBot');
        if (existing) {
            return existing;
        }

        document.body.insertAdjacentHTML('beforeend', buildWidgetMarkup());
        return document.getElementById('peeliBot');
    }

    function resolvePageTarget(text) {
        var lower = normalizeText(text);
        var wantsOpen = containsAny(lower, [
            'open',
            'go to',
            'go',
            'show',
            'load',
            'visit',
            'take me',
            'take me to',
            'navigate',
            'direct',
            'bring me',
            'move me',
            'lead me'
        ]);

        if (!wantsOpen) {
            return null;
        }

        var topic = pickTopic(lower);
        if (topic) {
            return { url: topic.page, reply: topic.openReply };
        }

        return null;
    }

    function getAssistantReply(text) {
        var lower = normalizeText(text);

        if (!lower.trim()) {
            return 'Type a question about the website, or ask me to open a page.';
        }

        if (containsAny(lower, ['hello', 'hi', 'hey', 'namaste'])) {
            return 'Hello. I can help with products, craft, weavers, gallery, about, contact, or opening pages.';
        }

        var topic = pickTopic(lower);
        if (topic) {
            return topic.reply;
        }

        if (containsAny(lower, ['what', 'how', 'where', 'who', 'when', 'why', 'which'])) {
            return 'Ask me about a site topic like home, about, craft, weavers, products, gallery, or contact. I can also open those pages for you.';
        }

        return 'I can help with home, about, craft, weavers, products, gallery, contact, or opening a page. Try asking about one of those sections.';
    }

    function initWidget(root) {
        var widget = root;
        var toggle = widget.querySelector('#peeliBotToggle');
        var panel = widget.querySelector('#peeliBotPanel');
        var closeBtn = widget.querySelector('#peeliBotClose');
        var message = widget.querySelector('#peeliBotMessage');
        var chat = widget.querySelector('#peeliBotChat');
        var input = widget.querySelector('#peeliBotInput');
        var sendBtn = widget.querySelector('#peeliBotSend');
        var navTimer = null;

        if (!toggle || !panel || !closeBtn || !message || !chat || !input || !sendBtn) {
            return;
        }

        function setOpen(isOpen) {
            widget.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            panel.setAttribute('aria-hidden', String(!isOpen));
            if (!isOpen) {
                window.clearTimeout(navTimer);
            } else {
                window.setTimeout(function () {
                    input.focus();
                }, 0);
            }
        }

        function scrollChatToBottom() {
            chat.scrollTop = chat.scrollHeight;
        }

        function appendBubble(text, role) {
            var bubble = document.createElement('div');
            bubble.className = 'peeli-bot__bubble peeli-bot__bubble--' + role;
            bubble.textContent = text;
            chat.appendChild(bubble);
            scrollChatToBottom();
        }

        function submitMessage(text) {
            var value = text.trim();
            if (!value) {
                return;
            }

            appendBubble(value, 'user');
            input.value = '';

            var pageTarget = resolvePageTarget(value);
            if (pageTarget) {
                window.clearTimeout(navTimer);
                appendBubble(pageTarget.reply, 'bot');
                navTimer = window.setTimeout(function () {
                    window.location.href = pageUrl(pageTarget.url);
                }, 500);
                return;
            }

            window.setTimeout(function () {
                appendBubble(getAssistantReply(value), 'bot');
            }, 220);
        }

        toggle.addEventListener('click', function () {
            setOpen(!widget.classList.contains('is-open'));
        });

        closeBtn.addEventListener('click', function () {
            window.clearTimeout(navTimer);
            setOpen(false);
        });

        sendBtn.addEventListener('click', function () {
            submitMessage(input.value);
            input.focus();
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitMessage(input.value);
            }
        });

        document.addEventListener('click', function (e) {
            if (!widget.contains(e.target)) {
                setOpen(false);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        });

        message.textContent = 'Ask me about the website or type "open products" to jump to a page.';
        scrollChatToBottom();
    }

    function boot() {
        var widget = ensureWidget();
        initWidget(widget);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
