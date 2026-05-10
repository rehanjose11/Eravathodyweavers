// search.js
document.addEventListener('DOMContentLoaded', () => {
    // Determine base path to root based on current URL
    const isSubdir = /\/(about|contact|gallery|products|the\scraft|our\sweavers)\//i.test(decodeURIComponent(window.location.pathname));
    const basePath = isSubdir ? '../' : '';

    const searchDatabase = [
        { title: "Home", category: "Page", url: "index.html" },
        { title: "About Eravathody", category: "Page", url: "about/about.html" },
        { title: "The Craft (Winding, Warping, Dyeing, Weaving)", category: "Page", url: "the craft/craft.html" },
        { title: "Our Weavers & Artisans", category: "Page", url: "our weavers/weavers.html" },
        { title: "Products Collection", category: "Page", url: "products/products.html" },
        { title: "Gallery & Visual Journey", category: "Page", url: "gallery/gallery.html" },
        { title: "Contact Us & Location", category: "Page", url: "contact/contact.html" },
        
        { title: "Kasavu Saree – Half Fine Zari & Dyed Yarns", category: "Product", url: "products/products.html" },
        { title: "Kasavu Saree Premium – Half Fine Zari", category: "Product", url: "products/products.html" },
        { title: "Set Mundu – Half Fine Zari & Dyed Yarns", category: "Product", url: "products/products.html" },
        { title: "Set Mundu Premium – Half Fine Zari", category: "Product", url: "products/products.html" },
        { title: "Set Mundu – Half Fine Zari", category: "Product", url: "products/products.html" },
        { title: "Double Mundu – Dyed Yarn", category: "Product", url: "products/products.html" }
    ];

    const searchInput = document.querySelector('.header__search-input');
    const searchBarContainer = document.querySelector('.header__search-bar');
    
    if (!searchInput || !searchBarContainer) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions';
    searchBarContainer.appendChild(dropdown);

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        
        if (query.length === 0) {
            dropdown.classList.remove('active');
            return;
        }

        const results = searchDatabase.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            results.forEach(item => {
                const suggestion = document.createElement('a');
                suggestion.className = 'search-suggestion-item';
                suggestion.href = basePath + item.url;
                
                // Highlight matching text
                const regex = new RegExp(`(${query})`, 'gi');
                const highlightedTitle = item.title.replace(regex, '<span class="search-highlight">$1</span>');

                suggestion.innerHTML = `
                    <div class="search-suggestion-title">${highlightedTitle}</div>
                    <div class="search-suggestion-category">${item.category}</div>
                `;
                
                suggestion.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                    searchInput.value = '';
                });

                dropdown.appendChild(suggestion);
            });
        } else {
            const noResults = document.createElement('div');
            noResults.className = 'search-suggestion-no-results';
            noResults.textContent = 'No matching items found.';
            dropdown.appendChild(noResults);
        }

        dropdown.classList.add('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBarContainer.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});
