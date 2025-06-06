document.addEventListener("DOMContentLoaded", () => {
  let   currentPage = window.location.pathname.split("/").pop();

  if (!currentPage || currentPage === "index.html") {
    currentPage = "./";
  }

  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  const navItems = document.querySelectorAll("header nav ul.nav-links a");
  navItems.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPage) {
      link.classList.add("active");
    }
  });

  if (currentPage === "./") {
    loadHomepageContent();
    loadHotels();
  } else if (currentPage === "hotel.html") {
    loadHotelDetails();
  } else if (currentPage === "ideas.html") {
    loadPromotions();
  } else if (currentPage === "about.html") {
    loadAboutUsContent();
  } else if (currentPage === "contact.html") {
    handleContactForm();
  } else if (currentPage === "news-detail.html") {
    loadNewsDetail();
  }

  const modal = document.getElementById("event-modal");
  const closeButton = document.querySelector(".modal .close-button");
  if (modal && closeButton) {
    closeButton.onclick = () => (modal.style.display = "none");
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
});

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} for URL: ${url}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch or parse data from ${url}:`, error);
    return null;
  }
}

async function loadHomepageContent() {
  const promoBlocksContainer = document.getElementById(
    "promo-blocks-container"
  );
  const featuredEventsContainer = document.getElementById(
    "featured-events-container"
  );
  const newsContainer = document.getElementById("news-container");
  const gameGuidesContainer = document.getElementById("game-guides-container");

  // Ensure all containers exist before proceeding (optional, but good for robustness)
  // If a container is missing from HTML, its specific content just won't load.

  const content = await fetchData("data/homepage-content.json");

  if (!content) {
    // If fetching homepage-content.json fails entirely
    if (promoBlocksContainer)
      promoBlocksContainer.innerHTML =
        "<p>Error loading promotional content.</p>";
    if (featuredEventsContainer)
      featuredEventsContainer.innerHTML =
        "<p>Error loading featured events.</p>";
    if (newsContainer) newsContainer.innerHTML = "<p>Error loading news.</p>"; // This should replace "Loading news..."
    if (gameGuidesContainer)
      gameGuidesContainer.innerHTML = "<p>Error loading game guides.</p>";
    return;
  }

  // Promo Blocks
  if (promoBlocksContainer) {
    if (content.promoBlocks && content.promoBlocks.length > 0) {
      promoBlocksContainer.innerHTML = content.promoBlocks
        .map(
          (block) => `
              <div class="promo-block">
                  <img src="${
                    block.image || "/placeholder.svg?width=300&height=200"
                  }" alt="${block.title}">
                  <h3>${block.title}</h3>
                  <p>${block.text}</p>
              </div>
          `
        )
        .join("");
    } else {
      promoBlocksContainer.innerHTML =
        "<p>No promotional content available.</p>";
    }
  }

  // Featured Events
  if (featuredEventsContainer) {
    if (content.featuredEvents && content.featuredEvents.length > 0) {
      featuredEventsContainer.innerHTML = content.featuredEvents
        .map(
          (event) => `
              <div class="featured-event-card">
                  <img src="${
                    event.image || "/placeholder.svg?width=600&height=400"
                  }" alt="${event.title}">
                  <div class="featured-event-content">
                      <h3>${event.title}</h3>
                      <p class="event-location-date">${event.location} - ${
            event.date
          }</p>
                      <p>${event.description}</p>
                      <a href="${event.detailsLink}" class="button">
                      <p>Event Details</p>
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </a>
                  </div>
              </div>
          `
        )
        .join("");
    } else {
      featuredEventsContainer.innerHTML =
        "<p>No featured events available.</p>";
    }
  }

  // News Items
  if (newsContainer) {
    if (content.newsItems && content.newsItems.length > 0) {
      newsContainer.innerHTML = content.newsItems
        .map(
          (item) => `
              <div class="news-item-card">
                  ${
                    item.image
                      ? `<img src="${item.image}" alt="${item.title}">`
                      : ""
                  }
                  <div class="news-item-content">
                      <h4>${item.title}</h4>
                      <p class="news-date">${new Date(
                        item.date
                      ).toLocaleDateString()}</p>
                      <p>${item.snippet}</p>
                      <a href="news-detail.html?id=${
                        item.id
                      }" class="text-link">Read More &rarr;</a>
                  </div>
              </div>
          `
        )
        .join("");
    } else {
      // This will replace "Loading news..." if newsItems is missing or empty
      newsContainer.innerHTML = "<p>No news items available at the moment.</p>";
    }
  }
}

async function loadHotels() {
  const hotelsContainer = document.getElementById("hotels-container");
  if (!hotelsContainer) return;

  const hotels = await fetchData("data/hotels.json");
  if (hotels && hotels.length > 0) {
    hotelsContainer.innerHTML = hotels
      .map(
        (hotel) => `
            <div class="hotel-card">
                <img src="${
                  hotel.images[0] || "/placeholder.svg?width=300&height=200"
                }" alt="${hotel.name}">
                <div class="hotel-card-content">
                    <h3>${hotel.name}</h3>
                    <p>${
                      hotel.shortDescription ||
                      hotel.description.substring(0, 100) + "..."
                    }</p>
                    <a href="hotel.html?id=${
                      hotel.id
                    }" class="btn">View Details</a>
                </div>
            </div>
        `
      )
      .join("");
  } else {
    hotelsContainer.innerHTML = "<p>No hotels found or error loading data.</p>";
  }
}

async function loadHotelDetails() {
  const hotelDetailContent = document.getElementById("hotel-detail-content");
  const eventsContainer = document.getElementById("events-container");
  if (!hotelDetailContent || !eventsContainer) return;

  const params = new URLSearchParams(window.location.search);
  const hotelId = Number.parseInt(params.get("id"));

  if (!hotelId) {
    hotelDetailContent.innerHTML = "<p>Hotel ID not provided.</p>";
    eventsContainer.innerHTML = "";
    return;
  }

  const hotels = await fetchData("data/hotels.json");
  const hotel = hotels ? hotels.find((h) => h.id === hotelId) : null;

  if (hotel) {
    document.title = `${hotel.name} | PlayCoreDrive.com`;
    let gamingFacilitiesHTML = "";
    if (hotel.gamingFacilities && hotel.gamingFacilities.length > 0) {
      gamingFacilitiesHTML = `
                <h3>Gaming Facilities</h3>
                <ul>${hotel.gamingFacilities
                  .map((facility) => `<li>${facility}</li>`)
                  .join("")}</ul>
            `;
    }
    let amenitiesHTML = "";
    if (hotel.amenities && hotel.amenities.length > 0) {
      amenitiesHTML = `
                <h3>Hotel Amenities</h3>
                <ul>${hotel.amenities
                  .map((amenity) => `<li>${amenity}</li>`)
                  .join("")}</ul>
            `;
    }

    hotelDetailContent.innerHTML = `
            <h1>${hotel.name}</h1>
            <p><strong>Location:</strong> ${hotel.location}</p>
            <div class="hotel-image-gallery">
                ${hotel.images
                  .map((img) => `<img src="${img}" alt="${hotel.name} image">`)
                  .join("")}
            </div>
            <p>${hotel.description}</p>
            ${gamingFacilitiesHTML}
            ${amenitiesHTML}
        `;
    loadHotelEvents(hotelId, hotel.eventIds);
  } else {
    hotelDetailContent.innerHTML =
      "<p>Hotel not found or error loading data.</p>";
    eventsContainer.innerHTML = "";
  }
}

async function loadHotelEvents(hotelId, eventIds) {
  const eventsContainer = document.getElementById("events-container");
  if (!eventsContainer) return;

  const allEvents = await fetchData("data/events.json");
  if (!allEvents) {
    eventsContainer.innerHTML = "<p>Could not load events data.</p>";
    return;
  }

  const hotelEvents = allEvents.filter(
    (event) =>
      event.hotelId === hotelId || (eventIds && eventIds.includes(event.id))
  );

  if (hotelEvents.length > 0) {
    eventsContainer.innerHTML = hotelEvents
      .map(
        (event) => `
            <div class="event-card">
                <div class="event-card-content">
                    <h3>${event.name}</h3>
                    <p class="event-date">Date: ${new Date(
                      event.date
                    ).toLocaleDateString()}</p>
                    <p>${event.shortDescription}</p>
                    <button class="btn view-event-details" data-event-id="${
                      event.id
                    }">View Full Details</button>
                </div>
            </div>
        `
      )
      .join("");

    document.querySelectorAll(".view-event-details").forEach((button) => {
      button.addEventListener("click", async () => {
        const eventId = Number.parseInt(button.dataset.eventId);
        const clickedEvent = allEvents.find((e) => e.id === eventId);
        if (clickedEvent) {
          const modal = document.getElementById("event-modal");
          const modalEventDetail =
            document.getElementById("modal-event-detail");
          modalEventDetail.innerHTML = `
                        <h3>${clickedEvent.name}</h3>
                        <p><strong>Date:</strong> ${new Date(
                          clickedEvent.date
                        ).toLocaleDateString()}</p>
                        <p>${clickedEvent.fullDescription}</p>
                    `;
          modal.style.display = "block";
        }
      });
    });
  } else {
    eventsContainer.innerHTML =
      "<p>No upcoming events listed for this hotel.</p>";
  }
}

async function loadPromotions() {
  const promotionsContainer = document.getElementById("promotions-container");
  if (!promotionsContainer) return;

  const promotions = await fetchData("data/promotions.json");
  if (promotions && promotions.length > 0) {
    promotionsContainer.innerHTML = promotions
      .map(
        (promo) => `
            <div class="promotion-card">
                <img src="${
                  promo.image || "/placeholder.svg?width=400&height=300"
                }" alt="${promo.title}">
                <div class="promotion-card-content">
                    <h3>${promo.title}</h3>
                    <p>${promo.description}</p>
                    ${
                      promo.hotelLogo
                        ? `<img src="${promo.hotelLogo}" alt="Hotel Logo" class="hotel-logo">`
                        : ""
                    }
                </div>
            </div>
        `
      )
      .join("");
  } else {
    promotionsContainer.innerHTML =
      "<p>No holiday ideas found or error loading data.</p>";
  }
}

async function loadAboutUsContent() {
  const headerContainer = document.getElementById("about-us-header-content");
  const mainContentContainer = document.getElementById("about-us-main-content");
  if (!headerContainer || !mainContentContainer) return;

  const content = await fetchData("data/about-us-content.json");
  if (content) {
    if (headerContainer) {
      headerContainer.innerHTML = `
                <section class="page-header">
                    <h1>${content.pageTitle || "About Us"}</h1>
                    ${content.tagline ? `<p>${content.tagline}</p>` : ""}
                </section>
            `;
    }

    let sectionsHTML = "";
    if (content.sections && content.sections.length > 0) {
      content.sections.forEach((section) => {
        sectionsHTML += `<h2>${section.title}</h2>`;
        if (section.paragraphs && section.paragraphs.length > 0) {
          section.paragraphs.forEach((p) => (sectionsHTML += `<p>${p}</p>`));
        }
        if (section.points && section.points.length > 0) {
          sectionsHTML += `<ul>${section.points
            .map((point) => `<li>${point}</li>`)
            .join("")}</ul>`;
        }
      });
    }
    mainContentContainer.innerHTML =
      sectionsHTML || "<p>Content loading error.</p>";
  } else {
    if (headerContainer)
      headerContainer.innerHTML =
        '<section class="page-header"><h1>About Us</h1></section>';
    mainContentContainer.innerHTML = "<p>Error loading About Us content.</p>";
  }
}

function handleContactForm() {
  const form = document.getElementById("contact-form");
  const submissionMessage = document.getElementById("form-submission-message");
  if (form && submissionMessage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submissionMessage.textContent = "Thank you for your message!";
      submissionMessage.style.display = "block";
      form.reset();
      setTimeout(() => {
        submissionMessage.style.display = "none";
      }, 5000);
    });
  }
}

async function loadNewsDetail() {
  const articleContainer = document.getElementById("news-article-content");
  if (!articleContainer) return;

  const params = new URLSearchParams(window.location.search);
  const newsId = params.get("id");

  if (!newsId) {
    articleContainer.innerHTML = "<p>News article ID not provided.</p>";
    return;
  }

  const homepageContent = await fetchData("data/homepage-content.json"); // News items are in this file
  if (!homepageContent || !homepageContent.newsItems) {
    articleContainer.innerHTML = "<p>Error loading news data.</p>";
    return;
  }

  const article = homepageContent.newsItems.find((item) => item.id === newsId);

  if (article) {
    document.title = `${article.title} | PlayCoreDrive.com`;
    articleContainer.innerHTML = `
            <h1>${article.title}</h1>
            <p class="news-date-full">Published: ${new Date(
              article.date
            ).toLocaleDateString()}</p>
            ${
              article.image
                ? `<img src="${article.image}" alt="${article.title}" class="news-article-image-full">`
                : ""
            }
            <div class="news-article-body">
                ${article.fullContent}
            </div>
            <a href="index.html#gaming-news-section" class="text-link">&larr; Back to News</a>
        `;
  } else {
    articleContainer.innerHTML = "<p>News article not found.</p>";
    document.title = "Article Not Found | PlayCoreDrive.com";
  }
}
