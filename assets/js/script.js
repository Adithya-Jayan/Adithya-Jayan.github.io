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
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        titleSrc: function(item) {
          var title = item.el.attr('data-description') || 'Artwork';
          var subtitle = item.el.attr('subtitle') || '';
          return title + '<small>' + subtitle + '</small>';
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
            var src = item.src.toLowerCase();
            if (src.indexOf('youtube.com') !== -1 || src.indexOf('vimeo.com') !== -1 || src.indexOf('mp4') !== -1 || src.indexOf('sketchfab.com') !== -1) {
              item.type = 'iframe';
            } else {
              item.type = 'image';
            }
          }
        }
      },
      closeBtnInside: false,
      midClick: true,
      fixedContentPos: false,
      mainClass: 'mfp-with-zoom mfp-img-mobile'
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
