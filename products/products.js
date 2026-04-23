// FADE IN ANIMATION ON SCROLL
const fadeElements = document.querySelectorAll('.fade-in');

function checkScroll() {
    fadeElements.forEach(function (element) {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 50) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

// NAV SEARCH TOGGLE
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

// PRODUCT ENQUIRY MODAL
const contactModel = document.getElementById('contactModel');
const openContactModelBtns = document.querySelectorAll('.product-btn');
const closeContactModelBtn = document.getElementById('closeContactModel');
const modalProductName = document.getElementById('modalProductName');
const enquiryForm = document.getElementById('enquiryForm');

if (contactModel && closeContactModelBtn) {
    openContactModelBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // Show product name in modal subtitle
            const productName = btn.getAttribute('data-product') || '';
            if (modalProductName) {
                modalProductName.textContent = productName ? 'Product: ' + productName : 'Please fill out the form below.';
            }
            contactModel.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeContactModelBtn.addEventListener('click', function () {
        contactModel.classList.remove('active');
        document.body.style.overflow = '';
    });

    contactModel.addEventListener('click', function (e) {
        if (e.target === contactModel) {
            contactModel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && contactModel.classList.contains('active')) {
            contactModel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// FORM SUBMIT — success feedback
if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = enquiryForm.querySelector('.form__submit-btn');
        submitBtn.textContent = 'Enquiry Sent ✓';
        submitBtn.style.background = '#5A8A5A';
        setTimeout(() => {
            contactModel.classList.remove('active');
            document.body.style.overflow = '';
            enquiryForm.reset();
            submitBtn.textContent = 'Submit Enquiry →';
            submitBtn.style.background = '';
        }, 2000);
    });
}
