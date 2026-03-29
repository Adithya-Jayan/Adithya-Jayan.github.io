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
  // Use a more specific selector to only target Isotope galleries
  var $grid = $('.portfolio-grid.grid');
  if ($grid.length === 0) {
    console.log("Isotope Gallery not found on this page.");
    return;
  }

  console.log("Isotope Gallery found, initializing...");

  try {
    // Initialize Isotope
    var $iso = $grid.isotope({
      itemSelector: '.grid-item',
      layoutMode: 'masonry',
      percentPosition: true,
      masonry: {
        columnWidth: '.grid-sizer'
      }
    });

    // Layout Isotope after each image loads - using vanilla imagesLoaded for better stability
    var imgLoad = imagesLoaded($grid[0]);
    imgLoad.on('progress', function() {
      $iso.isotope('layout');
    });
    
    // Layout once more after all are done
    imgLoad.on('always', function() {
       $iso.isotope('layout');
    });

  } catch (error) {
    console.error("Error initializing Isotope or imagesLoaded:", error);
  }

  // Filter items on button click
  $('.filters-button-group').on('click', 'button', function(e) {
    e.preventDefault();
    var filterValue = $(this).attr('data-filter');
    console.log("Filtering items by: " + filterValue);
    
    $grid.isotope({ filter: filterValue });
    
    // UI update
    $('.filters-button-group').find('.is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
  });

  console.log("Initializing Magnific Popup...");
  
  try {
    // Init Magnific Popup with delegation from a stable parent
    $('.gallery-section').magnificPopup({
      delegate: '.photolink',
      type: 'image',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0,1],
        tPrev: 'Previous',
        tNext: 'Next'
      },
      image: {
        verticalFit: true,
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        titleSrc: function(item) {
          var title = item.el.attr('data-description') || 'Artwork';
          var subtitle = item.el.attr('subtitle') || '';
          return title + (subtitle ? '<small>' + subtitle + '</small>' : '');
        }
      },
      callbacks: {
        elementParse: function(item) {
          var type = item.el.attr('data-type');
          if (type === 'mfp-iframe') {
            item.type = 'iframe';
          } else if (type === 'mfp-image') {
            item.type = 'image';
          } else {
            var href = item.el.attr('href').toLowerCase();
            if (href.indexOf('youtube.com') !== -1 || href.indexOf('vimeo.com') !== -1 || href.indexOf('mp4') !== -1 || href.indexOf('sketchfab.com') !== -1) {
              item.type = 'iframe';
            } else {
              item.type = 'image';
            }
          }
        }
      },
      closeBtnInside: false,
      midClick: true,
      fixedContentPos: true, // Better for mobile overflow
      mainClass: 'mfp-with-zoom mfp-img-mobile',
      removalDelay: 300
    });
  } catch (error) {
    console.error("Error initializing Magnific Popup:", error);
  }
}

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

  if (exploreTrigger && dropdownContent) {
    exploreTrigger.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownContent.classList.toggle('show');
        if (arrow) arrow.classList.toggle("arrow-up");
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
      // Different speed for each accent
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
