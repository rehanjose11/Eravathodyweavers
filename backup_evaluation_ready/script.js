
// ===== FADE IN ANIMATION ON SCROLL =====

const fadeElements = document.querySelectorAll('.fade-in');

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

// ===== CONTACT FORM: HIGHLIGHT FIELDS YELLOW AFTER FILLING =====
window.addEventListener('load', function () {
    const formFields = document.querySelectorAll(
        '.contact-form input, .contact-form select'
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

// ===== CONTACT FORM: SUBMIT ALERT =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        window.alert("Thank you for your message! We'll get back to you as soon as possible.");
    });
}

// ===== NEWSLETTER: SUBSCRIBE POPUP =====
const newsletterBtn = document.querySelector('.newsletter-btn');
if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function () {
        const input = document.querySelector('.newsletter-input');
        if (input && input.value.trim() !== '') {
            window.alert("Subscribed!");
            input.value = '';
            input.style.background = 'transparent';
        } else {
            window.alert("Please enter your email to subscribe.");
        }
    });
}
