(function () {
    function getScriptBase() {
        var current = document.currentScript;
        return current && current.src ? current.src : window.location.href;
    }

    var scriptBase = getScriptBase();
    var mascotSrc = new URL('homepage/peeli-bot.svg', scriptBase).href;
    var pageBase = scriptBase;

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
        var lower = text.toLowerCase();
        var wantsOpen = /(open|go to|show|load|visit|take me)/.test(lower);

        if (!wantsOpen) {
            return null;
        }

        if (/(home|homepage|main page)/.test(lower)) {
            return { url: 'index.html', reply: 'Opening the homepage.' };
        }
        if (/(about|story|history)/.test(lower)) {
            return { url: 'about/about.html', reply: 'Opening the about page.' };
        }
        if (/(craft|weaving|loom|thread|process)/.test(lower)) {
            return { url: 'the craft/craft.html', reply: 'Opening the craft page.' };
        }
        if (/(weaver|weavers|artisan|artisans)/.test(lower)) {
            return { url: 'our weavers/weavers.html', reply: 'Opening the our weavers page.' };
        }
        if (/(product|products|kasavu|mundu|saree|sarees|fabric|fabrics)/.test(lower)) {
            return { url: 'products/products.html', reply: 'Opening the products page.' };
        }
        if (/(gallery|photo|photos|image|images|picture|pictures)/.test(lower)) {
            return { url: 'gallery/gallery.html', reply: 'Opening the gallery page.' };
        }
        if (/(contact|visit|address|phone|location|reach)/.test(lower)) {
            return { url: 'contact/contact.html', reply: 'Opening the contact page.' };
        }

        return null;
    }

    function getAssistantReply(text) {
        var lower = text.toLowerCase();

        if (!lower.trim()) {
            return 'Type a question about the website, or ask me to open a page.';
        }

        if (/(hello|hi|hey)\b/.test(lower)) {
            return 'Hello. I can help with products, craft, weavers, gallery, about, contact, or opening pages.';
        }

        if (/(home|homepage|main page)/.test(lower)) {
            return 'The homepage introduces Eravathody Handloom Weavers in Thiruvilwamala, Kerala, with the main story, products, craft, and contact access.';
        }

        if (/(about|story|history)/.test(lower)) {
            return 'The About page explains the heritage of Eravathody, including the weaving community, the origins of the society, and the tradition sustained since 1941.';
        }

        if (/(craft|weaving|loom|thread|process)/.test(lower)) {
            return 'The Craft page shows how handloom fabric is made, from raw materials and winding to weaving and finishing.';
        }

        if (/(weaver|weavers|artisan|artisans)/.test(lower)) {
            return 'The Our Weavers page introduces the skilled artisans who keep the loom tradition alive through generations.';
        }

        if (/(product|products|kasavu|mundu|saree|sarees|fabric|fabrics)/.test(lower)) {
            return 'The Products page features Kasavu sarees, Set Mundu, Double Mundu, and other handwoven fabrics made at Eravathody.';
        }

        if (/(gallery|photo|photos|image|images|picture|pictures)/.test(lower)) {
            return 'The Gallery page shows the weaving society, fabrics, and visual moments from the craft.';
        }

        if (/(contact|visit|address|phone|location|reach)/.test(lower)) {
            return 'The Contact page has the office address, phone details, and a way to reach the society in Thiruvilwamala.';
        }

        return 'I can help with home, about, craft, weavers, products, gallery, contact, or opening a page. Try asking a specific question about the website.';
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
