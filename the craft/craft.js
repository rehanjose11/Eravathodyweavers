
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
    const steps = document.querySelectorAll('.process-scroll-step');
    const progressBar = document.getElementById('processProgressBar');
    
    if (steps.length === 0 || !progressBar) return;

    let targetProgress = 0;
    let currentProgress = 0;

    window.addEventListener('scroll', () => {
        let activeIndex = 0;
        let minDistance = Infinity;
        const viewportCenter = window.innerHeight / 2;

        steps.forEach((step, index) => {
            const rect = step.getBoundingClientRect();
            // Distance from the center of the step to the center of the viewport
            const stepCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - stepCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        // Highlight the closest step
        steps.forEach((step, index) => {
            if (index === activeIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update target progress
        targetProgress = (activeIndex / (steps.length - 1)) * 100;
    });

    // Lerp loop for smooth progress bar transition
    function smoothProgress() {
        currentProgress += (targetProgress - currentProgress) * 0.08;
        progressBar.style.height = `${currentProgress}%`;
        requestAnimationFrame(smoothProgress);
    }
    smoothProgress();
})();
