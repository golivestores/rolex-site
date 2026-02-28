document.addEventListener('DOMContentLoaded', function () {

  // ========================================
  // 1. LOADING SCREEN
  // ========================================
  var loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', function handler() {
          loader.style.display = 'none';
          loader.removeEventListener('transitionend', handler);
        });
      }, 2500);
    });
  }

  // ========================================
  // 2. CUSTOM CURSOR (desktop fine-pointer only)
  // ========================================
  if (window.matchMedia('(pointer: fine)').matches) {
    var cursorDot = document.querySelector('.cursor-dot');
    var cursorCircle = document.querySelector('.cursor-circle');

    if (!cursorDot) {
      cursorDot = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      document.body.appendChild(cursorDot);
    }
    if (!cursorCircle) {
      cursorCircle = document.createElement('div');
      cursorCircle.className = 'cursor-circle';
      document.body.appendChild(cursorCircle);
    }

    var mouseX = 0;
    var mouseY = 0;
    var circleX = 0;
    var circleY = 0;
    var circleVX = 0;
    var circleVY = 0;
    var cursorVisible = true;
    var stiffness = 0.15;
    var damping = 0.75;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
      if (!cursorVisible) {
        cursorDot.style.opacity = '1';
        cursorCircle.style.opacity = '1';
        cursorVisible = true;
      }
    });

    function animateCursor() {
      var dx = mouseX - circleX;
      var dy = mouseY - circleY;
      circleVX += dx * stiffness;
      circleVY += dy * stiffness;
      circleVX *= damping;
      circleVY *= damping;
      circleX += circleVX;
      circleY += circleVY;
      cursorCircle.style.transform = 'translate(' + circleX + 'px, ' + circleY + 'px)';
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    var hoverTargets = document.querySelectorAll('a, button, .magnetic-btn');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorDot.classList.add('hovering');
        cursorCircle.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function () {
        cursorDot.classList.remove('hovering');
        cursorCircle.classList.remove('hovering');
      });
    });

    document.addEventListener('mouseleave', function () {
      cursorDot.style.opacity = '0';
      cursorCircle.style.opacity = '0';
      cursorVisible = false;
    });

    document.addEventListener('mouseenter', function () {
      cursorDot.style.opacity = '1';
      cursorCircle.style.opacity = '1';
      cursorVisible = true;
    });
  }

  // ========================================
  // 3. HERO SLIDESHOW
  // ========================================
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots = document.querySelectorAll('.hero-dot');
  var currentHeroSlide = 0;
  var totalHeroSlides = heroSlides.length;

  function setHeroSlide(index) {
    heroSlides.forEach(function (slide) {
      slide.classList.remove('active');
      var video = slide.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    heroDots.forEach(function (d) {
      d.classList.remove('active');
    });

    heroSlides[index].classList.add('active');
    if (heroDots[index]) {
      heroDots[index].classList.add('active');
    }

    var activeVideo = heroSlides[index].querySelector('video');
    if (activeVideo) {
      activeVideo.play().catch(function () {});
    }
    currentHeroSlide = index;
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var slideIndex = parseInt(dot.dataset.slide);
      setHeroSlide(slideIndex);
    });
  });

  var heroInterval = setInterval(function () {
    var next = (currentHeroSlide + 1) % totalHeroSlides;
    setHeroSlide(next);
  }, 6000);

  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', function () {
      clearInterval(heroInterval);
    });
    heroSection.addEventListener('mouseleave', function () {
      heroInterval = setInterval(function () {
        var next = (currentHeroSlide + 1) % totalHeroSlides;
        setHeroSlide(next);
      }, 6000);
    });
  }

  // ========================================
  // 4. HERO TEXT SPLIT ANIMATION
  // ========================================
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    var text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.setAttribute('aria-label', text);

    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.style.animationDelay = (i * 0.03) + 's';
      heroTitle.appendChild(span);
    }

    var loaderDelay = loader ? 2800 : 300;
    setTimeout(function () {
      heroTitle.classList.add('animate');
    }, loaderDelay);
  }

  // ========================================
  // 5. ANNOUNCEMENT BAR ROTATION
  // ========================================
  var announcementSlides = document.querySelectorAll('.announcement-slide');
  var currentAnnouncement = 0;

  if (announcementSlides.length > 1) {
    setInterval(function () {
      announcementSlides[currentAnnouncement].classList.remove('active');
      currentAnnouncement = (currentAnnouncement + 1) % announcementSlides.length;
      announcementSlides[currentAnnouncement].classList.add('active');
    }, 4000);
  }

  // ========================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  // ========================================
  var revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-header, .blog-card, .brand-story-grid, .newsletter-inner, .brand-stats, .reviews-section, .testimonials, .editorial-banner, .ugc-section, .bs-section, .bestsellers';
  var revealElements = document.querySelectorAll(revealSelectors);

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute('data-delay');
        if (delay) {
          entry.target.style.transitionDelay = delay;
        }
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    if (el.classList.contains('reveal-left')) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-40px)';
    } else if (el.classList.contains('reveal-right')) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
    } else if (el.classList.contains('reveal-scale')) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.92)';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
    }
    el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    revealObserver.observe(el);
  });

  // ========================================
  // 7. PARALLAX EFFECT
  // ========================================
  var editorialImg = document.querySelector('.editorial-img img');
  var editorialSection = document.querySelector('.editorial-img');
  var parallaxTicking = false;

  if (editorialImg && editorialSection) {
    function updateParallax() {
      var rect = editorialSection.getBoundingClientRect();
      var windowH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < windowH) {
        var scrolled = (rect.top - windowH) / (rect.height + windowH);
        var translateY = scrolled * 0.3 * rect.height;
        editorialImg.style.transform = 'translateY(' + translateY + 'px) scale(1.08)';
      }
      parallaxTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // ========================================
  // 8. MAGNETIC BUTTONS
  // ========================================
  var magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var offsetX = (e.clientX - centerX) * 0.3;
      var offsetY = (e.clientY - centerY) * 0.3;
      btn.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.style.transform = 'translate(0, 0)';
      setTimeout(function () {
        btn.style.transition = '';
      }, 400);
    });
  });

  // ========================================
  // 9. COLLECTIONS HORIZONTAL SCROLL
  // ========================================
  var collectionsScroll = document.querySelector('.collections-scroll');
  var collectionsTrack = document.getElementById('collectionsTrack');

  if (collectionsScroll && collectionsTrack) {
    function setupCollectionsScroll() {
      var trackWidth = collectionsTrack.scrollWidth;
      var viewportWidth = window.innerWidth;
      var scrollDistance = trackWidth - viewportWidth;

      if (scrollDistance <= 0) {
        collectionsScroll.style.height = '';
        return;
      }

      collectionsScroll.style.height = (window.innerHeight + scrollDistance) + 'px';

      function onScroll() {
        var rect = collectionsScroll.getBoundingClientRect();
        var scrolled = -rect.top;

        if (scrolled <= 0) {
          collectionsTrack.style.transform = 'translateX(0)';
        } else if (scrolled >= scrollDistance) {
          collectionsTrack.style.transform = 'translateX(' + (-scrollDistance) + 'px)';
        } else {
          collectionsTrack.style.transform = 'translateX(' + (-scrolled) + 'px)';
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    setupCollectionsScroll();
    window.addEventListener('resize', setupCollectionsScroll);
  }

  // ========================================
  // 10. BRAND TABS FILTER (.bs-section)
  // ========================================
  var bsFilters = document.querySelectorAll('.bs-filter');
  var bsCards = document.querySelectorAll('.bs-card');

  bsFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      bsFilters.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var filter = btn.dataset.filter;

      bsCards.forEach(function (card, idx) {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('bs-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(function () {
            card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, idx * 50);
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(function () {
            card.classList.add('bs-hidden');
          }, 300);
        }
      });
    });
  });

  // ========================================
  // 11. SECOND BESTSELLERS TABS
  // ========================================
  var tabBtns = document.querySelectorAll('.tab-btn');
  var productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var filter = btn.dataset.tab;
      var visibleIndex = 0;

      productCards.forEach(function (card) {
        if (filter === 'all') {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ' + (visibleIndex * 0.05) + 's both';
          visibleIndex++;
        } else {
          var categories = card.dataset.category || '';
          if (categories.includes(filter)) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ' + (visibleIndex * 0.05) + 's both';
            visibleIndex++;
          } else {
            card.classList.add('hidden');
            card.style.animation = '';
          }
        }
      });
    });
  });

  // ========================================
  // 12. REVIEWS CAROUSEL
  // ========================================
  var reviewsTrack = document.getElementById('reviewsTrack');
  var reviewsPrev = document.querySelector('.reviews-prev');
  var reviewsNext = document.querySelector('.reviews-next');
  var reviewsDotsContainer = document.getElementById('reviewsDots');

  if (reviewsTrack && reviewsPrev && reviewsNext) {
    var reviewCards = reviewsTrack.querySelectorAll('.review-card');
    var reviewIndex = 0;

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.max(1, reviewCards.length - getVisibleCount() + 1);
    }

    function buildReviewDots() {
      if (!reviewsDotsContainer) return;
      reviewsDotsContainer.innerHTML = '';
      var pages = getTotalPages();
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === reviewIndex ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function () {
          reviewIndex = parseInt(this.getAttribute('data-index'));
          updateReviews();
        });
        reviewsDotsContainer.appendChild(dot);
      }
    }

    function updateReviews() {
      var card = reviewCards[0];
      if (!card) return;
      var gap = parseInt(getComputedStyle(reviewsTrack).gap) || 24;
      var cardWidth = card.offsetWidth + gap;
      reviewsTrack.style.transform = 'translateX(' + (-reviewIndex * cardWidth) + 'px)';

      if (reviewsDotsContainer) {
        var dots = reviewsDotsContainer.querySelectorAll('.reviews-dot');
        dots.forEach(function (d, idx) {
          d.classList.toggle('active', idx === reviewIndex);
        });
      }
    }

    reviewsPrev.addEventListener('click', function () {
      reviewIndex = Math.max(0, reviewIndex - 1);
      updateReviews();
    });

    reviewsNext.addEventListener('click', function () {
      reviewIndex = Math.min(getTotalPages() - 1, reviewIndex + 1);
      updateReviews();
    });

    buildReviewDots();
    window.addEventListener('resize', function () {
      reviewIndex = Math.min(reviewIndex, getTotalPages() - 1);
      buildReviewDots();
      updateReviews();
    });
  }

  // ========================================
  // 13. UGC TIKTOK DRAG SLIDER
  // ========================================
  var ugcSlider = document.querySelector('.ugc-slider');
  if (ugcSlider) {
    var ugcDragging = false;
    var ugcStartX = 0;
    var ugcScrollLeft = 0;

    function ugcPointerDown(x) {
      ugcDragging = true;
      ugcSlider.classList.add('is-dragging');
      ugcStartX = x - ugcSlider.offsetLeft;
      ugcScrollLeft = ugcSlider.scrollLeft;
    }

    function ugcPointerMove(x) {
      if (!ugcDragging) return;
      var currentX = x - ugcSlider.offsetLeft;
      var walk = (currentX - ugcStartX) * 2;
      ugcSlider.scrollLeft = ugcScrollLeft - walk;
    }

    function ugcPointerUp() {
      ugcDragging = false;
      ugcSlider.classList.remove('is-dragging');
    }

    ugcSlider.addEventListener('mousedown', function (e) {
      e.preventDefault();
      ugcPointerDown(e.pageX);
    });

    ugcSlider.addEventListener('mousemove', function (e) {
      if (!ugcDragging) return;
      e.preventDefault();
      ugcPointerMove(e.pageX);
    });

    ugcSlider.addEventListener('mouseup', ugcPointerUp);
    ugcSlider.addEventListener('mouseleave', ugcPointerUp);

    ugcSlider.addEventListener('touchstart', function (e) {
      ugcPointerDown(e.touches[0].pageX);
    }, { passive: true });

    ugcSlider.addEventListener('touchmove', function (e) {
      ugcPointerMove(e.touches[0].pageX);
    }, { passive: true });

    ugcSlider.addEventListener('touchend', ugcPointerUp);
  }

  // ========================================
  // 14. BRAND STORY COUNTER ANIMATION
  // ========================================
  var statNumbers = document.querySelectorAll('.brand-stat-number');

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = Math.floor(easedProgress * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(function (num) {
      statsObserver.observe(num);
    });
  }

  // ========================================
  // 15. HAMBURGER MOBILE MENU
  // ========================================
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ========================================
  // 16. SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========================================
  // EXTRA: Testimonials Track Drag Scroll
  // ========================================
  var testimonialsTrack = document.querySelector('.testimonials-track');
  if (testimonialsTrack) {
    var testDown = false;
    var testStartX;
    var testScrollLeft;

    testimonialsTrack.addEventListener('mousedown', function (e) {
      testDown = true;
      testimonialsTrack.style.cursor = 'grabbing';
      testStartX = e.pageX - testimonialsTrack.offsetLeft;
      testScrollLeft = testimonialsTrack.scrollLeft;
    });

    testimonialsTrack.addEventListener('mouseleave', function () {
      testDown = false;
      testimonialsTrack.style.cursor = 'grab';
    });

    testimonialsTrack.addEventListener('mouseup', function () {
      testDown = false;
      testimonialsTrack.style.cursor = 'grab';
    });

    testimonialsTrack.addEventListener('mousemove', function (e) {
      if (!testDown) return;
      e.preventDefault();
      var x = e.pageX - testimonialsTrack.offsetLeft;
      var walk = (x - testStartX) * 2;
      testimonialsTrack.scrollLeft = testScrollLeft - walk;
    });

    testimonialsTrack.style.cursor = 'grab';
  }

  // ========================================
  // EXTRA: Newsletter Form Handling
  // ========================================
  var newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('.newsletter-input');
      var btn = newsletterForm.querySelector('.newsletter-btn');

      if (input && input.value) {
        var originalHTML = btn.innerHTML;
        btn.innerHTML = '<span style="position:relative;z-index:1">Subscribed &#10003;</span>';
        btn.style.background = '#2d8a4e';
        input.value = '';

        setTimeout(function () {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  // ========================================
  // EXTRA: Button text z-index fix
  // ========================================
  document.querySelectorAll('.btn-primary').forEach(function (btn) {
    var children = btn.childNodes;
    children.forEach(function (node) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        var span = document.createElement('span');
        span.style.position = 'relative';
        span.style.zIndex = '1';
        span.textContent = node.textContent;
        btn.replaceChild(span, node);
      }
    });
  });

});
