$(document).ready(function() {
  generateBreadcrumbs();
  initMobileMenu();
  initParallax();
});

function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
      mobileMenuToggle.classList.toggle('active');
    });
  }

  // Improved Dropdown logic - click to navigate on desktop, toggle on mobile toggle specifically
  const exploreTrigger = document.getElementById('explore-trigger');
  const dropdownContent = document.getElementById("myDropdown");
  const arrow = document.querySelector(".arrow-down");

  // Only toggle dropdown manually if we're on mobile and it's not a hover situation
  // but let the click event through for navigation.
  if (exploreTrigger && dropdownContent) {
    // If the user specifically wants to navigate, clicking will do so by default for <a> tags.
    // We don't need to do anything else here if hover is handling the dropdown.
  }

  // Close dropdown/menu if clicking outside
  window.addEventListener('click', function(event) {
    if (dropdownContent && dropdownContent.classList.contains('show') && !event.target.closest('.explore-dropdown')) {
      dropdownContent.classList.remove('show');
      if (arrow) arrow.classList.remove("arrow-up");
    }

    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && 
        !mobileMenuToggle.contains(event.target)) {
      
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initParallax() {
  const accents = document.querySelectorAll('.botanical-accent');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    accents.forEach((accent, index) => {
      // Different speed for each accent
      const speed = (index + 1) * 0.15;
      const yPos = -(scrollY * speed);
      accent.style.transform = `translateY(${yPos}px)`;
    });
  });
}

function generateBreadcrumbs() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(part => part !== '');
  const breadcrumbs = document.getElementById('breadcrumbs');
  
  if (breadcrumbs) {
    let breadcrumbHtml = '> ';
    
    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'index.html')) {
      breadcrumbHtml += 'Home';
    } else {
      const lastPart = parts[parts.length - 1].replace(/_/g, ' ').replace('.html', '');
      if (lastPart === '' || lastPart === 'index') {
          const dirIndex = parts[parts.length - 1] === '' ? parts.length - 2 : parts.length - 1;
          const dirName = parts[dirIndex];
          if (dirName) {
            breadcrumbHtml += `${dirName.charAt(0).toUpperCase() + dirName.slice(1)}`;
          } else {
            breadcrumbHtml += 'Home';
          }
      } else {
          breadcrumbHtml += `${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)}`;
      }
    }
    
    breadcrumbs.innerHTML = breadcrumbHtml;
  }
}
