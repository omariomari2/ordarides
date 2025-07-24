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
  mousewheel: {
    enabled: true,
    sensitivity: 1,
    thresholdDelta: 50,
    thresholdTime: 500
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

// Navbar Navigation Logic
const navMenu = document.querySelector(".nav-menu");

// Handle navigation when a menu item is clicked
navMenu.addEventListener("click", function(event) {
  const link = event.target.closest('a');
  if (!link) return;
  
  event.preventDefault();
  
  // Remove active class from all links
  navMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
  
  // Add active class to clicked link
  link.classList.add('active');
  
  // Get the slide index from data attribute
  const slideIndex = parseInt(link.getAttribute('data-slide'));
  if (!isNaN(slideIndex)) {
    // Smoothly slide to the selected slide
    swiper.slideTo(slideIndex, 800);
    
    // Update data-sld attribute
    document.body.setAttribute('data-sld', slideIndex);
  }
});

// Update active nav item when slide changes
swiper.on('slideChange', function (sld) {
  // Remove active class from all nav links
  navMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
  
  // Add active class to current slide's nav link
  const activeLink = navMenu.querySelector(`a[data-slide="${sld.realIndex}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
});

// Initialize the first slide
document.body.setAttribute('data-sld', '0');

// Additional scroll handling for better control
let isScrolling = false;
let scrollTimeout;
let lastScrollTime = 0;

// Add custom wheel event listener for more precise control
document.querySelector('.mySwiper').addEventListener('wheel', function(e) {
  // Prevent default scroll behavior
  e.preventDefault();
  
  const currentTime = Date.now();
  
  // Debounce scroll events to prevent rapid firing
  if (isScrolling || (currentTime - lastScrollTime) < 800) {
    return;
  }
  
  // Only respond to significant scroll movements
  const deltaY = Math.abs(e.deltaY);
  if (deltaY < 10) {
    return; // Ignore very small scroll movements
  }
  
  isScrolling = true;
  lastScrollTime = currentTime;
  
  // Clear any existing timeout
  clearTimeout(scrollTimeout);
  
  // Determine scroll direction
  if (e.deltaY > 0) {
    // Scrolling down - go to next slide
    swiper.slideNext();
  } else if (e.deltaY < 0) {
    // Scrolling up - go to previous slide
    swiper.slidePrev();
  }
  
  // Reset scrolling flag after a delay
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 800); // Increased delay for better control
}, { passive: false });