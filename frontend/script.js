// ---------- Destination Data ----------

const destinations = [
    {
        name: "Goa",
        location: "Goa, India",
        category: "Beach",
        budget: 5000,
        description: "Enjoy sunny beaches, beautiful sunsets, and relaxing holidays.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Jaipur",
        location: "Rajasthan, India",
        category: "Heritage",
        budget: 4000,
        description: "Explore royal palaces, colourful markets, and historic forts.",
        image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Manali",
        location: "Himachal Pradesh, India",
        category: "Mountain",
        budget: 7000,
        description: "Discover mountain views, fresh air, and peaceful valleys.",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Munnar",
        location: "Kerala, India",
        category: "Nature",
        budget: 4500,
        description: "Walk through green tea gardens and misty landscapes.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Hyderabad",
        location: "Telangana, India",
        category: "Heritage",
        budget: 2500,
        description: "Experience famous monuments, local food, and city culture.",
        image: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Agra",
        location: "Uttar Pradesh, India",
        category: "Heritage",
        budget: 3500,
        description: "Visit the Taj Mahal and discover India's rich history.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Ooty",
        location: "Tamil Nadu, India",
        category: "Mountain",
        budget: 4000,
        description: "Enjoy cool weather, scenic hills, and beautiful gardens.",
        image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Varanasi",
        location: "Uttar Pradesh, India",
        category: "Heritage",
        budget: 3000,
        description: "Experience ancient streets, river views, and cultural traditions.",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85"
    },
    {
        name: "Alleppey",
        location: "Kerala, India",
        category: "Nature",
        budget: 5500,
        description: "Relax on peaceful backwaters and enjoy a houseboat journey.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85"
    }
];

// ---------- HTML Elements ----------

const destinationGrid = document.getElementById("destinationGrid");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const sortSelect = document.getElementById("sortSelect");
const clearFiltersButton = document.getElementById("clearFilters");
const noResults = document.getElementById("noResults");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

let selectedCategory = "All";

// ---------- Display Destination Cards ----------

function displayDestinations(places) {
    destinationGrid.innerHTML = "";

    noResults.hidden = places.length !== 0;

    places.forEach(function (place) {
        const card = document.createElement("article");
        card.className = "destination-card";

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "card-image";

        const image = document.createElement("img");
        image.src = place.image;
        image.alt = place.name;
        image.loading = "lazy";

        image.onerror = function () {
            imageWrapper.style.backgroundColor = "#e8f5ef";
            image.style.display = "none";
        };

        const badge = document.createElement("span");
        badge.className = "category-badge";
        badge.textContent = place.category;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(badge);

        const content = document.createElement("div");
        content.className = "card-content";

        const location = document.createElement("p");
        location.className = "card-location";
        location.textContent = "📍 " + place.location;

        const title = document.createElement("h3");
        title.textContent = place.name;

        const description = document.createElement("p");
        description.className = "card-description";
        description.textContent = place.description;

        const bottom = document.createElement("div");
        bottom.className = "card-bottom";

        const budget = document.createElement("p");
        budget.className = "card-budget";
        budget.textContent = "₹" + place.budget.toLocaleString("en-IN");

        const budgetNote = document.createElement("small");
        budgetNote.textContent = "Estimated budget";
        budget.appendChild(budgetNote);

        const link = document.createElement("a");
        link.className = "card-link";
        link.href =
            "https://www.google.com/search?q=" +
            encodeURIComponent(place.name + " tourist places");

        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Explore →";
        link.setAttribute(
            "aria-label",
            "Explore tourist information about " + place.name
        );

        bottom.appendChild(budget);
        bottom.appendChild(link);

        content.appendChild(location);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(bottom);

        card.appendChild(imageWrapper);
        card.appendChild(content);

        destinationGrid.appendChild(card);
    });
}

// ---------- Search, Filter and Sort ----------

function updateDestinations() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    let filteredPlaces = destinations.filter(function (place) {
        const matchesSearch =
            place.name.toLowerCase().includes(searchTerm) ||
            place.location.toLowerCase().includes(searchTerm) ||
            place.category.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            place.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const sortValue = sortSelect.value;

    if (sortValue === "name") {
        filteredPlaces.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    } else if (sortValue === "budget") {
        filteredPlaces.sort(function (a, b) {
            return a.budget - b.budget;
        });
    }

    displayDestinations(filteredPlaces);
}

// Search form submission
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    updateDestinations();

    document.getElementById("destinations").scrollIntoView({
        behavior: "smooth"
    });
});

// Update results while typing
searchInput.addEventListener("input", updateDestinations);

// Category filter buttons
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        updateDestinations();
    });
});

// Sorting
sortSelect.addEventListener("change", updateDestinations);

// Clear all filters
clearFiltersButton.addEventListener("click", function () {
    searchInput.value = "";
    selectedCategory = "All";
    sortSelect.value = "default";

    filterButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.category === "All"
        );
    });

    updateDestinations();
});

// ---------- Mobile Navigation ----------

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close mobile menu after selecting a link
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// ---------- Footer Year ----------

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// ---------- Initial Display ----------

displayDestinations(destinations);