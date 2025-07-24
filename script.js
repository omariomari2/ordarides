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
    enabled: false
  },
  on: {
    init: function() {
      document.body.setAttribute('data-sld', this.realIndex);
    }
  }
});

swiper.on('slideChange', function (sld) {
  document.body.setAttribute('data-sld', sld.realIndex);
  
  // Reset scroll position to top when slide changes
  const container = document.querySelector('.container');
  container.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Update active nav item
  const navMenu = document.querySelector(".nav-menu");
  navMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
  const activeLink = navMenu.querySelector(`a[data-slide="${sld.realIndex}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
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

// Update active nav item when slide changes (handled in main slideChange event above)

// Initialize the first slide
document.body.setAttribute('data-sld', '0');

// Enhanced scroll handling - only change slides at scroll boundaries
let isScrolling = false;
let scrollTimeout;
let lastScrollTime = 0;
let scrollAttempts = 0;

// Track scroll position and handle slide navigation
function handleScrollNavigation(e) {
  const currentTime = Date.now();
  
  // Debounce scroll events
  if (isScrolling || (currentTime - lastScrollTime) < 300) {
    return false;
  }
  
  // Only respond to significant scroll movements
  const deltaY = Math.abs(e.deltaY);
  if (deltaY < 20) {
    return false;
  }
  
  const container = document.querySelector('.container');
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;
  
  const atTop = scrollTop <= 5;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
  
  let shouldChangeSlide = false;
  
  if (e.deltaY > 0 && atBottom) {
    // Scrolling down at bottom - go to next slide
    shouldChangeSlide = true;
    swiper.slideNext();
  } else if (e.deltaY < 0 && atTop) {
    // Scrolling up at top - go to previous slide
    shouldChangeSlide = true;
    swiper.slidePrev();
  }
  
  if (shouldChangeSlide) {
    e.preventDefault();
    isScrolling = true;
    lastScrollTime = currentTime;
    
    // Reset scrolling flag after delay
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 800);
    
    return true;
  }
  
  return false;
}

// Add wheel event listener to container
document.querySelector('.container').addEventListener('wheel', handleScrollNavigation, { passive: false });