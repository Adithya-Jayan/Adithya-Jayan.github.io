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

  // Initialize Isotope
  var $iso = $grid.isotope({
    itemSelector: '.grid-item',
    layoutMode: 'masonry',
    percentPosition: true,
    masonry: {
      columnWidth: '.grid-sizer'
    }
  });

  $grid.imagesLoaded().progress(function() {
    $iso.isotope('layout');
  });

  $('.filters-button-group').on('click', 'button', function(e) {
    e.preventDefault();
    var filterValue = $(this).attr('data-filter');
    $iso.isotope({ filter: filterValue });
    $('.filters-button-group').find('.is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
  });

  // Init Magnific Popup
  $('.gallery-section').magnificPopup({
    delegate: '.photolink',
    type: 'image',
    gallery: { enabled: true },
    image: {
      verticalFit: true,
      titleSrc: function(item) {
        var title = item.el.attr('data-description') || '';
        var subtitle = item.el.attr('subtitle') || '';
        return title + (subtitle ? '<small>' + subtitle + '</small>' : '');
      }
    },
    iframe: {
      markup: '<div class="mfp-iframe-scaler-container">' +
                '<div class="mfp-close"></div>' +
                '<div class="mfp-iframe-scaler">' +
                  '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '</div>' +
                '<div class="mfp-bottom-bar">' +
                  '<div class="mfp-title"></div>' +
                  '<div class="mfp-counter"></div>' +
                '</div>' +
              '</div>',
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1'
        }
      }
    },
    callbacks: {
      elementParse: function(item) {
        var type = item.el.attr('data-type');
        var href = item.el.attr('href').toLowerCase();
        if (type === 'mfp-iframe' || href.indexOf('youtube.com') !== -1 || href.indexOf('vimeo.com') !== -1 || href.indexOf('mp4') !== -1) {
          item.type = 'iframe';
        } else {
          item.type = 'image';
        }
      },
      markupParse: function(template, values, item) {
        if (item.type === 'iframe') {
          var title = item.el.attr('data-description') || 'Video';
          var subtitle = item.el.attr('subtitle') || '';
          template.find('.mfp-title').html(title + (subtitle ? '<small>' + subtitle + '</small>' : ''));
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
  const exploreTrigger = document.getElementById('explore-trigger');
  const dropdownContent = document.getElementById("myDropdown");
  const arrow = document.querySelector(".arrow-down");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }

  if (exploreTrigger && dropdownContent) {
    exploreTrigger.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
        if (arrow) arrow.classList.toggle("arrow-up");
      }
    });
  }

  window.addEventListener('click', function(event) {
    if (dropdownContent && dropdownContent.classList.contains('show') && !event.target.closest('.explore-dropdown')) {
      dropdownContent.classList.remove('show');
      if (arrow) arrow.classList.remove("arrow-up");
    }
    if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    }
  });
}

function initParallax() {
  const accents = document.querySelectorAll('.botanical-accent');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    accents.forEach((accent, index) => {
      const speed = (index + 1) * 0.15;
      accent.style.transform = `translateY(${-(scrollY * speed)}px)`;
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
