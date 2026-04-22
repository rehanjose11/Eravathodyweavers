// FADE IN ON SCROLL
const fadeElements = document.querySelectorAll('.fade-in');

function checkScroll() {
    fadeElements.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

// NAV SEARCH: TOGGLE VISIBILITY
window.addEventListener('load', function () {
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

        document.addEventListener('click', function (e) {
            if (!searchToggle.contains(e.target) && !searchBar.contains(e.target) && searchBar.classList.contains('active')) {
                searchBar.classList.remove('active');
            }
        });
    }
});

// CONTACT FORM: GOLD HIGHLIGHT ON FILL
window.addEventListener('load', function () {
    const formFields = document.querySelectorAll('.form input, .form select');

    formFields.forEach(function (field) {
        field.addEventListener('input', function () {
            this.style.background = this.value.trim() !== '' ? '#C2A24D' : '#f9f9f9';
        });
        field.addEventListener('change', function () {
            this.style.background = this.value !== '' ? '#C2A24D' : '#f9f9f9';
        });
    });
});

// CONTACT FORM: SUBMIT POPUP
const contactPageForm = document.getElementById('contactPageForm');
if (contactPageForm) {
    contactPageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        window.alert("Thank you for your message! We'll get back to you as soon as possible.");
        contactPageForm.reset();
        // Reset gold highlights
        contactPageForm.querySelectorAll('input, select, textarea').forEach(function (el) {
            el.style.background = '';
        });
    });
}

// FAQ TOGGLE LOGIC
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(function (other) {
                other.classList.remove('active');
                other.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});
