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

  // Improved Dropdown logic - click anywhere on trigger
  const exploreTrigger = document.getElementById('explore-trigger');
  if (exploreTrigger) {
    exploreTrigger.addEventListener('click', function(event) {
      event.stopPropagation();
      document.getElementById("myDropdown").classList.toggle("show");
      document.querySelector(".arrow-down").classList.toggle("arrow-up");
    });
  }

  // Close dropdown/menu if clicking outside
  window.addEventListener('click', function(event) {
    var dropdown = document.getElementById('myDropdown');
    if (dropdown && dropdown.classList.contains('show') && !event.target.closest('.explore-dropdown')) {
      dropdown.classList.remove('show');
      var arrow = document.querySelector(".arrow-down");
      if (arrow && arrow.classList.contains("arrow-up")) {
        arrow.classList.remove("arrow-up");
      }
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
