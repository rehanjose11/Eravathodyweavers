
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

// LIGHTBOX MODAL LOGIC
(function() {
    const lightboxModal = document.getElementById('lightboxModel');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('closeLightboxModel');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const galleryGrid = document.getElementById('galleryGrid');
    const lightboxCaption = document.getElementById('lightboxCaption');

    const galleryImages = [
        '30 Images/DSC00654.JPG',
        '30 Images/DSC00697_final.jpg',
        '30 Images/DSC00701.png',
        '30 Images/DSC00786.jpg',
        '30 Images/DSC00827.jpg',
        '30 Images/DSC00899.jpg',
        '30 Images/DSC02102.JPG',
        '30 Images/DSC02107.JPG',
        '30 Images/DSC02132.JPG',
        '30 Images/DSC02162.jpg',
        '30 Images/DSC02209.jpg',
        '30 Images/DSC02218.jpg',
        '30 Images/DSC02246.jpg',
        '30 Images/DSC02446.jpg',
        '30 Images/DSC02757.jpg',
        '30 Images/DSC02936.jpg',
        '30 Images/DSC03062.jpg',
        '30 Images/DSC04217.JPG',
        '30 Images/DSC04386.jpg',
        '30 Images/DSC04420.jpg',
        '30 Images/DSC04613.JPG',
        '30 Images/DSC04615.JPG',
        '30 Images/DSC04713.jpg',
        '30 Images/DSC04722.JPG',
        '30 Images/_DSC6682.jpg',
        '30 Images/_DSC7013.jpg',
        '30 Images/_DSC7354.jpg',
        '30 Images/_MG_9878.jpg',
        '30 Images/eravathodi.png'
    ];

    if (galleryGrid) {
        galleryGrid.innerHTML = galleryImages.map(function (src, index) {
            const isPriority = index < 6;
            return (
                '<div class="gallery-grid__item" data-index="' + index + '">' +
                    '<img src="' + src + '" alt="Gallery image ' + (index + 1) + '" ' +
                        'loading="' + (isPriority ? 'eager' : 'lazy') + '" ' +
                        'decoding="async" ' +
                        'fetchpriority="' + (isPriority ? 'high' : 'low') + '">' +
                '</div>'
            );
        }).join('');
    }

    const galleryItems = document.querySelectorAll('.gallery-grid__item');
    
    if (!lightboxModal || galleryItems.length === 0) return;

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');
        
        if (img) lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = '';
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryItems.length;
            openLightbox(currentIndex);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft' && prevBtn) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && nextBtn) {
            nextBtn.click();
        } else if (e.key === 'Escape') {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox__content') || e.target.classList.contains('lightbox__image-wrapper')) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
})();
