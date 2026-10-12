
/* ================================================================
   BATANES DISCOVERY
   Main JavaScript
   ----------------------------------------------------------------
   Simple vanilla JavaScript only:
   - mobile navigation
   - back-to-top button
   - destination filters/search
   - gallery filters/lightbox
   - Gmail inquiry/contact forms
   - gentle reveal animation
   ================================================================ */


// ---------------------------------------------------------------
// 1. CONTACT EMAIL CONFIGURATION
// ---------------------------------------------------------------

const CONTACT_EMAIL = "marybuliran@gmail.com";


// ---------------------------------------------------------------
// 2. MOBILE NAVIGATION
// ---------------------------------------------------------------

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


// ---------------------------------------------------------------
// 3. BACK TO TOP BUTTON
// ---------------------------------------------------------------

const toTopButton = document.querySelector(".to-top");

if (toTopButton) {
    const updateButton = () => {
        toTopButton.classList.toggle(
            "visible",
            window.scrollY > 500
        );
    };

    window.addEventListener(
        "scroll",
        updateButton,
        { passive: true }
    );

    updateButton();

    toTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ---------------------------------------------------------------
// 4. DESTINATION FILTER + SEARCH
// ---------------------------------------------------------------

const destinationFilterButtons =
    [...document.querySelectorAll(".filter-btn")];

const destinationCards =
    [...document.querySelectorAll(".place-card")];

function refreshDestinationCards() {
    const activeFilter =
        document.querySelector(".filter-btn.selected")
            ?.dataset.filter || "all";

    const searchValue =
        (document.getElementById("place-search")?.value || "")
            .trim()
            .toLowerCase();

    destinationCards.forEach((card) => {
        const matchesCategory =
            activeFilter === "all" ||
            card.dataset.category === activeFilter;

        const matchesSearch =
            card.textContent
                .toLowerCase()
                .includes(searchValue);

        card.classList.toggle(
            "hidden",
            !(matchesCategory && matchesSearch)
        );
    });
}

destinationFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        destinationFilterButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        refreshDestinationCards();
    });
});

document
    .getElementById("place-search")
    ?.addEventListener(
        "input",
        refreshDestinationCards
    );


// ---------------------------------------------------------------
// 5. GALLERY FILTERS
// ---------------------------------------------------------------

const galleryFilterButtons =
    [...document.querySelectorAll(".gallery-filter-btn")];

galleryFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        galleryFilterButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        const wantedCategory =
            button.dataset.galleryFilter;

        document
            .querySelectorAll(".gallery-item")
            .forEach((item) => {
                const shouldHide =
                    wantedCategory !== "all" &&
                    item.dataset.galleryCategory !==
                        wantedCategory;

                item.classList.toggle(
                    "hidden",
                    shouldHide
                );
            });
    });
});


// ---------------------------------------------------------------
// 6. GALLERY LIGHTBOX
// ---------------------------------------------------------------

const lightbox =
    document.querySelector(".lightbox");

if (lightbox) {
    const galleryItems =
        [...document.querySelectorAll(".gallery-item")];

    const lightboxImage =
        lightbox.querySelector("img");

    const lightboxCaption =
        lightbox.querySelector(".lightbox-caption");

    const lightboxCounter =
        lightbox.querySelector(".lightbox-counter");

    let currentIndex = 0;

    function showGalleryItem(index) {
        currentIndex =
            (index + galleryItems.length) %
            galleryItems.length;

        const item =
            galleryItems[currentIndex];

        const image =
            item.querySelector("img");

        lightboxImage.src =
            item.dataset.full ||
            image.src;

        lightboxImage.alt =
            item.dataset.title || "";

        lightboxCaption.textContent =
            item.dataset.title || "";

        lightboxCounter.textContent =
            `${currentIndex + 1} / ${galleryItems.length}`;
    }

    function openLightbox(index) {
        showGalleryItem(index);

        lightbox.classList.add("open");

        document.body.style.overflow =
            "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("open");

        document.body.style.overflow =
            "";
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    lightbox
        .querySelector(".lightbox-close")
        ?.addEventListener(
            "click",
            closeLightbox
        );

    lightbox
        .querySelector(".lightbox-prev")
        ?.addEventListener(
            "click",
            () => showGalleryItem(currentIndex - 1)
        );

    lightbox
        .querySelector(".lightbox-next")
        ?.addEventListener(
            "click",
            () => showGalleryItem(currentIndex + 1)
        );

    document.addEventListener(
        "keydown",
        (event) => {
            if (!lightbox.classList.contains("open")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowLeft") {
                showGalleryItem(currentIndex - 1);
            }

            if (event.key === "ArrowRight") {
                showGalleryItem(currentIndex + 1);
            }
        }
    );
}


// ---------------------------------------------------------------
// 7. GMAIL COMPOSE HELPER
// ---------------------------------------------------------------

function openGmail(subject, body) {
    const gmailURL =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" +
        encodeURIComponent(CONTACT_EMAIL) +
        "&su=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

    window.open(
        gmailURL,
        "_blank",
        "noopener,noreferrer"
    );
}


// ---------------------------------------------------------------
// 8. BOOKING / INQUIRY FORM
// ---------------------------------------------------------------

const inquiryForm =
    document.getElementById("inquiry-form");

if (inquiryForm) {
    const parameters =
        new URLSearchParams(
            window.location.search
        );

    const incomingInterest =
        parameters.get("package") ||
        parameters.get("interest");

    const interestSelect =
        document.getElementById("interest");

    if (incomingInterest && interestSelect) {
        [...interestSelect.options].forEach(
            (option) => {
                if (
                    option.value ===
                        incomingInterest ||
                    option.textContent.trim() ===
                        incomingInterest
                ) {
                    interestSelect.value =
                        option.value;
                }
            }
        );
    }

    const dateInput =
        document.getElementById("trip-date");

    if (dateInput) {
        dateInput.min =
            new Date()
                .toISOString()
                .slice(0, 10);
    }

    inquiryForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            if (!inquiryForm.reportValidity()) {
                return;
            }

            const data =
                new FormData(inquiryForm);

            const message = `BATANES DISCOVERY TRAVEL INQUIRY

Name: ${data.get("name")}
Email: ${data.get("email")}
Interested in: ${data.get("interest")}
Preferred date: ${data.get("date") || "Flexible / undecided"}
Travelers: ${data.get("travelers") || "Not specified"}
Estimated budget: ${data.get("budget") || "Undecided"}

Message:
${data.get("message") || ""}

Please confirm current availability, rates, inclusions, exclusions, visitor-registration requirements, transportation, and weather-sensitive activities.`;

            openGmail(
                `Batanes travel inquiry — ${data.get("interest")}`,
                message
            );

            const status =
                document.getElementById("form-status");

            if (status) {
                status.textContent =
                    "Gmail opened in a new tab with your prepared inquiry. Review it before sending.";
            }
        }
    );
}


// ---------------------------------------------------------------
// 9. CONTACT FORM
// ---------------------------------------------------------------

const contactForm =
    document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const data =
                new FormData(contactForm);

            const message = `BATANES DISCOVERY QUESTION

Name: ${data.get("name")}
Reply email: ${data.get("email")}
Subject: ${data.get("subject")}

${data.get("message")}`;

            openGmail(
                `Batanes question — ${data.get("subject")}`,
                message
            );

            const status =
                document.getElementById("contact-status");

            if (status) {
                status.textContent =
                    "Gmail opened with your message ready to review.";
            }
        }
    );
}


// ---------------------------------------------------------------
// 10. GENTLE REVEAL ANIMATION
// ---------------------------------------------------------------

if (
    "IntersectionObserver" in window &&
    !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {
    const revealItems =
        document.querySelectorAll(
            ".card, .hotel-card, .guide-card, " +
            ".package, .feature-image, .section-head"
        );

    const observer =
        new IntersectionObserver(
            (entries, activeObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "is-visible"
                        );

                        activeObserver.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.08
            }
        );

    revealItems.forEach((item) => {
        item.classList.add("reveal-ready");
        observer.observe(item);
    });
}


// ---------------------------------------------------------------
// 11. HOMEPAGE CAROUSEL
// ---------------------------------------------------------------

const homeCarousel = document.getElementById("home-carousel");

if (homeCarousel) {
    const slides = [...homeCarousel.querySelectorAll(".home-slide")];
    const dots = [...homeCarousel.querySelectorAll(".carousel-dot")];
    const previousButton = homeCarousel.querySelector(".carousel-prev");
    const nextButton = homeCarousel.querySelector(".carousel-next");

    let currentSlide = 0;
    let carouselTimer = null;

    function showHomeSlide(index) {
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle(
                "is-active",
                slideIndex === currentSlide
            );
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle(
                "active",
                dotIndex === currentSlide
            );
        });
    }

    function startHomeCarousel() {
        stopHomeCarousel();

        carouselTimer = window.setInterval(() => {
            showHomeSlide(currentSlide + 1);
        }, 5500);
    }

    function stopHomeCarousel() {
        if (carouselTimer) {
            window.clearInterval(carouselTimer);
        }
    }

    previousButton?.addEventListener("click", () => {
        showHomeSlide(currentSlide - 1);
        startHomeCarousel();
    });

    nextButton?.addEventListener("click", () => {
        showHomeSlide(currentSlide + 1);
        startHomeCarousel();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showHomeSlide(index);
            startHomeCarousel();
        });
    });

    homeCarousel.addEventListener(
        "mouseenter",
        stopHomeCarousel
    );

    homeCarousel.addEventListener(
        "mouseleave",
        startHomeCarousel
    );

    showHomeSlide(0);
    startHomeCarousel();
}
