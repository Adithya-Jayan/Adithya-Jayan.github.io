$(document).ready(function() {
  console.log("Document ready, initializing scripts...");
  initGallery();
  generateBreadcrumbs();
  initMobileMenu();
  initParallax();
  initBackToTop();
});

function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 400) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initGallery() {
  var $grid = $('.portfolio-grid.grid');
  if ($grid.length === 0) return;

  console.log("Initializing Gallery with Isotope...");

  // Initialize Isotope
  var $iso = $grid.isotope({
    itemSelector: '.grid-item',
    layoutMode: 'masonry',
    percentPosition: true,
    masonry: {
      columnWidth: '.grid-sizer'
    },
    transitionDuration: '0.6s'
  });

  // Use imagesLoaded to trigger layout after images load
  $grid.imagesLoaded().progress(function() {
    $iso.isotope('layout');
  }).always(function() {
    console.log("All images loaded, final Isotope layout.");
    $iso.isotope('layout');
    
    // Extra safety for mobile: re-layout after a short delay
    setTimeout(function() {
      $iso.isotope('layout');
    }, 500);
  });

  // Filter items on button click
  $('.filters-button-group').on('click', 'button', function(e) {
    e.preventDefault();
    var filterValue = $(this).attr('data-filter');
    console.log("Filtering by: " + filterValue);
    
    $iso.isotope({ filter: filterValue });
    
    $('.filters-button-group').find('.is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
  });

  // Init Magnific Popup
  $('.gallery-section').magnificPopup({
    delegate: '.photolink',
    type: 'image',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1]
    },
    image: {
      verticalFit: true,
      titleSrc: function(item) {
        var title = item.el.attr('data-description') || 'Artwork';
        var subtitle = item.el.attr('subtitle') || '';
        return title + (subtitle ? '<small>' + subtitle + '</small>' : '');
      }
    },
    callbacks: {
      elementParse: function(item) {
        var type = item.el.attr('data-type');
        var href = item.el.attr('href').toLowerCase();
        if (type === 'mfp-iframe' || href.indexOf('youtube.com') !== -1 || href.indexOf('vimeo.com') !== -1 || href.indexOf('mp4') !== -1 || href.indexOf('sketchfab.com') !== -1) {
          item.type = 'iframe';
        } else {
          item.type = 'image';
        }
      }
    },
    fixedContentPos: true,
    mainClass: 'mfp-with-zoom mfp-img-mobile',
    removalDelay: 300,
    midClick: true
  });
}

function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
      mobileMenuToggle.classList.toggle('active');
    });
  }

  // Improved Dropdown logic - toggle on click for all devices
  const exploreTrigger = document.getElementById('explore-trigger');
  const dropdownContent = document.getElementById("myDropdown");
  const arrow = document.querySelector(".arrow-down");

  if (exploreTrigger && dropdownContent) {
    exploreTrigger.addEventListener('click', function(e) {
      // Only handle click toggle on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownContent.classList.contains('show');
        
        if (isOpen) {
          dropdownContent.classList.remove('show');
          if (arrow) arrow.classList.remove("arrow-up");
        } else {
          dropdownContent.classList.add('show');
          if (arrow) arrow.classList.add("arrow-up");
        }
      }
    });
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
      const speed = (index + 1) * 0.15;
      const yPos = -(scrollY * speed);
      accent.style.transform = `translateY(${yPos}px)`;
    });
  });
}

function generateBreadcrumbs() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(part => part !== '' && part !== 'index.html');
  const breadcrumbs = document.getElementById('breadcrumbs');
  
  if (breadcrumbs) {
    let breadcrumbHtml = '<a href="/">Home</a>';
    let currentPath = '/';
    
    parts.forEach((part, index) => {
      currentPath += part + '/';
      const cleanPart = part.replace(/_/g, ' ').replace(/-/g, ' ').replace('.html', '');
      const capitalizedPart = cleanPart.charAt(0).toUpperCase() + cleanPart.slice(1);
      
      breadcrumbHtml += ` <span class="separator">></span> `;
      if (index === parts.length - 1) {
        breadcrumbHtml += `<span>${capitalizedPart}</span>`;
      } else {
        breadcrumbHtml += `<a href="${currentPath}">${capitalizedPart}</a>`;
      }
    });
    
    breadcrumbs.innerHTML = breadcrumbHtml;
  }
}
