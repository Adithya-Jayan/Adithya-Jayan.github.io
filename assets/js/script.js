$(document).ready(function() {
  console.log("Document ready, initializing scripts...");
  initGallery();
  generateBreadcrumbs();
  initMobileMenu();
  initBackToTop();
});

// Physics & Position State for the Bee
let cx = -200, cy = -200; 
let tx = -200, ty = -200; 
let isBeeVisible = false;
let isFlyingUp = false;
let hasBeeSpawned = false; // Track initial spawn
let canSpawnBee = Math.random() < 0.01; // 1 in 100 chance for this page session
let beeTime = 0;
let targetHistory = [];
const REACTION_DELAY = 50; 
const SCROLL_THRESHOLD = 400;

function initBackToTop() {
  const bee = document.getElementById('bee-container');
  const anchor = document.getElementById('backToTop');
  if (!bee || !anchor) return;

  // ─── Visibility Logic ───
  window.addEventListener('scroll', function() {
    const isMobile = window.innerWidth <= 768;
    const shouldBeVisible = window.pageYOffset > SCROLL_THRESHOLD;

    if (shouldBeVisible) {
      anchor.classList.add('visible');
      if (!isMobile && canSpawnBee) {
        if (!isBeeVisible && !isFlyingUp) {
          isBeeVisible = true;
          
          if (!hasBeeSpawned) {
            // First time: Spawn from left off-screen
            cx = window.scrollX - 100;
            cy = window.scrollY + (window.innerHeight * 0.8);
            hasBeeSpawned = true;
          } else {
            // Subsequent times: Fly in from top (where it retreated)
            cx = window.scrollX + window.innerWidth - 100;
            cy = window.scrollY - 100;
          }

          targetHistory = [{
            x: window.scrollX + window.innerWidth - 100, 
            y: window.scrollY + window.innerHeight - 100, 
            time: Date.now()
          }];
        }
      }
    } else {
      anchor.classList.remove('visible');
      if (!isFlyingUp) isBeeVisible = false;
    }
  });

  const triggerScroll = (e) => {
    if (e) e.preventDefault();
    if (isFlyingUp) return;
    
    isFlyingUp = true;
    targetHistory = []; 
    
    // Switch to fixed positioning during flight to sync with viewport perfectly
    bee.style.position = 'fixed';
    // Convert current document coords to viewport coords for the transition
    cx = cx - window.scrollX;
    cy = cy - window.scrollY;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  anchor.addEventListener('click', triggerScroll);
  bee.addEventListener('click', triggerScroll);

  animateBee();
}

function animateBee() {
  const bee = document.getElementById('bee-container');
  const anchor = document.getElementById('backToTop');
  if (!bee || !anchor) return;

  // Hidden/Disabled on Mobile
  if (window.innerWidth <= 768) {
    bee.style.transform = `translate(-200px, -200px)`;
    requestAnimationFrame(animateBee);
    return;
  }

  beeTime += 0.05;
  let now = Date.now();

  if (isFlyingUp) {
    // In fixed mode, target is simply above the viewport
    tx = cx; 
    ty = -200; 

    // Very fast lift
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.15;

    // Transition back to absolute once page is at top and bee is offscreen
    if (window.scrollY < 10 && cy < -100) {
      isFlyingUp = false;
      isBeeVisible = false;
      bee.style.position = 'absolute';
      // Reset to top-offscreen in document space
      cx = window.scrollX + window.innerWidth - 100;
      cy = -200;
    }
  } else if (isBeeVisible) {
    // Get Anchor Position (The Flower)
    const rect = anchor.getBoundingClientRect();
    const anchorX = window.scrollX + rect.left + (rect.width / 2) - 30;
    const anchorY = window.scrollY + rect.top + (rect.height / 2) - 30;

    targetHistory.push({ x: anchorX, y: anchorY, time: now });

    while (targetHistory.length > 1 && now - targetHistory[0].time > REACTION_DELAY) {
      targetHistory.shift();
    }

    tx = targetHistory[0].x;
    ty = targetHistory[0].y;

    cx += (tx - cx) * 0.08; 
    cy += (ty - cy) * 0.12;  
  } else {
    // Retreat straight up
    tx = cx;
    ty = window.scrollY - 500;
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.08;
  }

  // Wobble & Rotation
  let wobbleX = isFlyingUp ? 0 : Math.sin(beeTime) * 10;
  let wobbleY = isFlyingUp ? 0 : Math.cos(beeTime * 0.8) * 12;

  let velocityX = tx - cx;
  let velocityY = ty - cy;
  let pitch = isFlyingUp ? -20 : (velocityY * 0.05); 
  let rotation = isFlyingUp ? 0 : (velocityX * 0.03) + pitch;
  rotation = Math.max(-45, Math.min(45, rotation));

  bee.style.transform = `translate(${cx + wobbleX}px, ${cy + wobbleY}px) rotate(${rotation}deg)`;

  requestAnimationFrame(animateBee);
}

function initGallery() {
  var $grid = $('.portfolio-grid.grid');
  if ($grid.length === 0) return;

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
          src: '//www.youtube.com/embed/%id%?autoplay%3D1'
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
