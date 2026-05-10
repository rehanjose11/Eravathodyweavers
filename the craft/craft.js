
// FADE IN ANIMATION ON SCROLL

//selects all elements with class fade-in
const fadeElements = document.querySelectorAll('.fade-in');

//This function runs whenever the page loads or user scrolls.
function checkScroll() {
    fadeElements.forEach(function (element) {
        // Gets the position of the element from the top of viewport
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // If element is inside the viewport area, add visible class
        if (elementTop < windowHeight - 50) {
            element.classList.add('visible');
        }
    });
}

// Run animation sequence once when page loads
window.addEventListener('load', checkScroll);

// Continuously check animations when user scrolls
window.addEventListener('scroll', checkScroll);

// CONTACT FORM: HIGHLIGHT FIELDS YELLOW AFTER FILLING
window.addEventListener('load', function () {
    const formFields = document.querySelectorAll(
        '.form input, .form select'
    );

    formFields.forEach(function (field) {
        // For text/tel/email/date inputs — highlight on input
        field.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.style.background = '#C2A24D';
            } else {
                this.style.background = '#f9f9f9'; // Reset if cleared
            }
        });

        // For select dropdowns — highlight on change
        field.addEventListener('change', function () {
            if (this.value !== '') {
                this.style.background = '#C2A24D';
            } else {
                this.style.background = '#f9f9f9';
            }
        });
    });
});

// CONTACT FORM: SUBMIT ALERT
const contactForm = document.querySelector('.form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        window.alert("Thank you for your message! We'll get back to you as soon as possible.");
    });
}

// NEWSLETTER: SUBSCRIBE POP-UP
const newsletterBtn = document.querySelector('.newsletter__btn');
if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function () {
        const input = document.querySelector('.newsletter__input');
        if (input && input.value.trim() !== '') {
            window.alert("Subscribed!");
            input.value = '';
            input.style.background = 'transparent';
        } else {
            window.alert("Please enter your email to subscribe.");
        }
    });
}

// NAV SEARCH: TOGGLE VISIBILITY
const searchToggle = document.querySelector('.search-toggle');
const searchBar = document.querySelector('.header__search-bar');
const searchInput = document.querySelector('.header__search-input');

if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', function (e) {
        e.preventDefault();
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active') && searchInput) {
            searchInput.focus();
        }
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchToggle.contains(e.target) && !searchBar.contains(e.target) && searchBar.classList.contains('active')) {
            searchBar.classList.remove('active');
        }
    });
}

// CONTACT: TOGGLE VISIBILITY
const contactModel = document.getElementById('contactModel');
const openContactModelBtn = document.getElementById('openContactModel');
const closeContactModelBtn = document.getElementById('closeContactModel');

if (contactModel && openContactModelBtn && closeContactModelBtn) {
    // Open model
    openContactModelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        contactModel.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    });

    // Close model via close button
    closeContactModelBtn.addEventListener('click', function () {
        contactModel.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    });

    // Close model when clicking outside the card
    contactModel.addEventListener('click', function (e) {
        if (e.target === contactModel) {
            contactModel.classList.remove('active');
        }
    });
}

// PRODUCT GALLERY: infinite loop + center highlight
(function () {
    var track = document.getElementById('galleryTrack');
    if (!track) return;

    //Place original images before the seamless loop
    var originals = Array.from(track.querySelectorAll('.gallery__item'));
    if (!originals.length) return;

    // Clone all items and append them BEFORE and AFTER the originals for seamless loop
    originals.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
    originals.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.insertBefore(clone, track.firstChild);
    });

    var allItems = track.querySelectorAll('.gallery__item');
    var itemWidth = originals[0].offsetWidth + 20; // 20 = gap
    var totalOriginals = originals.length;

    // Start scroll at the second set (past the prepended clones)
    track.scrollLeft = totalOriginals * itemWidth;

    // ---- Infinite loop: silently jump when reaching cloned zones ----
    track.addEventListener('scroll', function () {
        var min = itemWidth;                               // one item before real start
        var max = (totalOriginals * 2) * itemWidth;       // one item before real end (clones)

        if (track.scrollLeft <= min) {
            track.scrollLeft += totalOriginals * itemWidth;
        } else if (track.scrollLeft >= max) {
            track.scrollLeft -= totalOriginals * itemWidth;
        }
    }, { passive: true });

    // ---- Mouse drag to scroll ----
    var isDown = false;
    var startX, scrollStart;

    track.addEventListener('mousedown', function (e) {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
        track.style.scrollBehavior = 'auto';
    });
    document.addEventListener('mouseup', function () {
        isDown = false;
        track.style.scrollBehavior = 'smooth';
    });
    track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollStart - (x - startX) * 1.5;
    });

    // Initial highlight
    if (typeof highlightCenter === 'function') {
        highlightCenter();
    }
}());

// PROCESS STICKY SCROLL LOGIC
(function() {
    const steps         = document.querySelectorAll('.process-scroll-step');
    const progressBar   = document.getElementById('processProgressBar');
    const progressTrack = document.querySelector('.process-progress-track');
    const processSection= document.querySelector('.process-scroll-container');
    const stepsSide     = document.querySelector('.process-steps-side');

    if (!steps.length || !progressBar || !processSection || !stepsSide) return;

    // --- Create the single travelling dot ---
    const dot = document.createElement('div');
    dot.className = 'process-line-dot';
    stepsSide.appendChild(dot);

    // Lerp state
    let dotTarget  = 0;
    let dotCurrent = 0;
    let barTarget  = 0;
    let barCurrent = 0;

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    // Get the vertical center of a step relative to stepsSide
    // offsetTop is stable — not affected by page scroll
    function stepCenterRel(step) {
        return step.offsetTop + step.offsetHeight / 2;
    }

    // Initialise dot to first step center on load
    function initDot() {
        const start = stepCenterRel(steps[0]);
        dotTarget  = start;
        dotCurrent = start;
    }

    // --- Core update: called on every scroll event ---
    function update() {
        const vpMid = window.innerHeight / 2;

        // Show / hide fixed right-side progress bar:
        // visible only while scrolling through the steps (first step in view → last step in view)
        if (progressTrack) {
            const firstR = steps[0].getBoundingClientRect();
            const lastR  = steps[steps.length - 1].getBoundingClientRect();
            const inView = firstR.bottom > 0 && lastR.top < window.innerHeight;
            progressTrack.classList.toggle('visible', inView);
        }

        // Where is vpMid between the center of step[0] and center of step[last]?
        // Using getBoundingClientRect for the RATIO (viewport-relative, changes with scroll — correct)
        const firstRect = steps[0].getBoundingClientRect();
        const lastRect  = steps[steps.length - 1].getBoundingClientRect();
        const firstMid  = firstRect.top  + firstRect.height  / 2;
        const lastMid   = lastRect.top   + lastRect.height   / 2;
        const range     = lastMid - firstMid;
        const ratio     = range === 0 ? 0 : clamp((vpMid - firstMid) / range, 0, 1);

        // Map ratio to LAYOUT positions (offsetTop-based, stable) of first and last step centers
        // This ensures the dot is geometrically aligned with the cards, not hardcoded px offsets
        const dotStart = stepCenterRel(steps[0]);
        const dotEnd   = stepCenterRel(steps[steps.length - 1]);
        dotTarget  = dotStart + ratio * (dotEnd - dotStart);
        barTarget  = ratio * 100;

        // Active step highlight (border colour only — discrete)
        let activeIndex = 0;
        let minDist = Infinity;
        steps.forEach((step, i) => {
            const mid = step.getBoundingClientRect().top + step.getBoundingClientRect().height / 2;
            const d   = Math.abs(mid - vpMid);
            if (d < minDist) { minDist = d; activeIndex = i; }
        });
        steps.forEach((step, i) => step.classList.toggle('active', i === activeIndex));
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('load', () => { initDot(); update(); });

    // --- RAF lerp loop ---
    const progressEl = document.querySelector('.process-progress');

    function animate() {
        dotCurrent += (dotTarget - dotCurrent) * 0.14;
        dot.style.top = `${dotCurrent}px`;

        barCurrent += (barTarget - barCurrent) * 0.1;
        progressBar.style.height = `${barCurrent}%`;
        if (progressEl) progressEl.style.setProperty('--dot-pos', `${barCurrent}%`);

        requestAnimationFrame(animate);
    }
    animate();
})();


// PHILOSOPHY IMAGE LIGHTBOX (More Than a Process)
(function() {
    const img = document.querySelector('.philosophy-image img');
    const lightbox = document.getElementById('craftImgLightbox');
    const lightboxImg = document.getElementById('craftLightboxImg');
    const closeBtn = document.getElementById('closeCraftLightbox');

    if (!img || !lightbox || !lightboxImg || !closeBtn) return;

    img.addEventListener('click', function() {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
})();
