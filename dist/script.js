var swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-next-button",
    prevEl: ".swiper-prev-button"
  },
  effect: "fade",
  loop: false,
  allowTouchMove: true,
  speed: 800,
  pagination: {
    el: ".swiper-pagination",
    type: "fraction"
  },
  on: {
    init: function() {
      document.body.setAttribute('data-sld', this.realIndex);
    }
  }
});

swiper.on('slideChange', function (sld) {
  document.body.setAttribute('data-sld', sld.realIndex);
});

// Slide-out Navbar Toggle Logic
const navToggleBtn = document.getElementById("btn-nav-toggle");
const slideoutNav = document.getElementById("slideout-nav");
const navMenu = document.getElementById("nav-menu");
const navCloseBtn = document.getElementById("btn-nav-close");

function toggleNav(expand) {
  navToggleBtn.setAttribute("aria-expanded", String(expand));
  slideoutNav.setAttribute("aria-hidden", String(!expand));
  if (expand) {
    document.body.classList.add("slideout-nav-open");
    document.addEventListener("click", handleOutsideClick);
  } else {
    document.body.classList.remove("slideout-nav-open");
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  if (!slideoutNav.contains(event.target) && !navToggleBtn.contains(event.target)) {
    toggleNav(false);
  }
}

navToggleBtn.addEventListener("click", function(event) {
  event.preventDefault();
  event.stopPropagation();
  const isExpanded = navToggleBtn.getAttribute("aria-expanded") === "true";
  toggleNav(!isExpanded);
});

// Handle navigation when a menu item is clicked
navMenu.addEventListener("click", function(event) {
  const link = event.target.closest('a');
  if (!link) return;
  
  event.preventDefault();
  
  // Get the slide index from data attribute
  const slideIndex = parseInt(link.getAttribute('data-slide'));
  if (!isNaN(slideIndex)) {
    // Smoothly slide to the selected slide
    swiper.slideTo(slideIndex, 800);
    
    // Update data-sld attribute
    document.body.setAttribute('data-sld', slideIndex);
  }
  
  // Close the navigation menu
  toggleNav(false);
});

// Close nav when close button is clicked
if (navCloseBtn) {
  navCloseBtn.addEventListener("click", function(event) {
    event.preventDefault();
    toggleNav(false);
  });
}

// Initialize the first slide
document.body.setAttribute('data-sld', '0');