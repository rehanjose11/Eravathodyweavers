// FADE IN ANIMATION ON SCROLL

const fadeElements = document.querySelectorAll('.fade-in');

function checkScroll() {
    fadeElements.forEach(function (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 50) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

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

    document.addEventListener('click', function (e) {
        if (!searchToggle.contains(e.target) && !searchBar.contains(e.target) && searchBar.classList.contains('active')) {
            searchBar.classList.remove('active');
        }
    });
}

// PRODUCT ENQUIRY MODAL: TOGGLE VISIBILITY
const contactModel = document.getElementById('contactModel');
const openContactModelBtns = document.querySelectorAll('.product-btn');
const closeContactModelBtn = document.getElementById('closeContactModel');

if (contactModel && closeContactModelBtn) {
    // Open model for all product buttons
    openContactModelBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
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
}

