/* ============================================================
   CHRONOS V1 — Main JavaScript
   Vanilla JS, no dependencies. All features wrapped in
   DOMContentLoaded for safety.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     1. ANNOUNCEMENT BAR ROTATION
     ---------------------------------------------------------- */
  (() => {
    const slides = document.querySelectorAll('.announcement-slide');
    if (!slides.length) return;

    let current = 0;
    const INTERVAL = 4000;

    function rotate() {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }

    setInterval(rotate, INTERVAL);
  })();

  /* ----------------------------------------------------------
     2. STICKY HEADER
     ---------------------------------------------------------- */
  (() => {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const SCROLL_THRESHOLD = 50;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on load in case page is already scrolled
    onScroll();
  })();

  /* ----------------------------------------------------------
     3. HAMBURGER MENU (Mobile)
     ---------------------------------------------------------- */
  (() => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when a mobile nav link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  })();

  /* ----------------------------------------------------------
     4. MEGA MENU (Desktop hover / click)
     ---------------------------------------------------------- */
  (() => {
    const megaItems = document.querySelectorAll('.nav-item.has-mega');
    if (!megaItems.length) return;

    let closeTimeout = null;

    megaItems.forEach(item => {
      const menu = item.querySelector('.mega-menu');
      if (!menu) return;

      // Desktop hover
      item.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
        // Close any other open megas
        megaItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('mega-open');
          }
        });
        item.classList.add('mega-open');
      });

      item.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
          item.classList.remove('mega-open');
        }, 200);
      });

      // Touch / click toggle for tablet
      const link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            item.classList.toggle('mega-open');
          }
        });
      }
    });

    // Close mega menus on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.has-mega')) {
        megaItems.forEach(item => item.classList.remove('mega-open'));
      }
    });
  })();

  /* ----------------------------------------------------------
     5. HERO SLIDESHOW
     Auto-rotate with fade transitions, dot indicators,
     touch/swipe support on the hero section.
     ---------------------------------------------------------- */
  (() => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length < 2) return;

    let current = 0;
    let autoplayTimer = null;
    const INTERVAL = 6000;

    function goToSlide(index) {
      // Pause video on current slide
      const currentVideo = slides[current].querySelector('video');
      if (currentVideo) {
        currentVideo.pause();
      }

      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');

      current = index;

      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');

      // Play video on new slide
      const newVideo = slides[current].querySelector('video');
      if (newVideo) {
        newVideo.currentTime = 0;
        newVideo.play().catch(() => {});
      }
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Dot click handlers
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.dataset.slide, 10);
        if (slideIndex !== current) {
          goToSlide(slideIndex);
          startAutoplay();
        }
      });
    });

    // Swipe support
    const heroEl = document.querySelector('.hero-slideshow');
    if (heroEl) {
      let touchStartX = 0;
      let touchEndX = 0;

      heroEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroEl.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            // Swipe left -> next
            goToSlide((current + 1) % slides.length);
          } else {
            // Swipe right -> prev
            goToSlide((current - 1 + slides.length) % slides.length);
          }
          startAutoplay();
        }
      }, { passive: true });
    }

    startAutoplay();
  })();

  /* ----------------------------------------------------------
     6. BEST SELLERS BRAND TABS (First grid — .bs-section)
     Filters .bs-card by data-cat attribute.
     ---------------------------------------------------------- */
  (() => {
    const filterBtns = document.querySelectorAll('.bs-filter');
    const cards = document.querySelectorAll('.bs-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
            // Animate in
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  })();

  /* ----------------------------------------------------------
     7. SECOND BESTSELLERS TABS (.bestsellers section)
     Filters .product-card by data-category attribute.
     ---------------------------------------------------------- */
  (() => {
    const section = document.querySelector('.bestsellers');
    if (!section) return;

    const tabBtns = section.querySelectorAll('.tab-btn');
    const cards = section.querySelectorAll('.product-card');
    if (!tabBtns.length || !cards.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;

        cards.forEach(card => {
          const categories = card.dataset.category || '';
          const match = tab === 'all' || categories.includes(tab);

          if (match) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  })();

  /* ----------------------------------------------------------
     8. REVIEWS CAROUSEL
     Auto-scrolling with prev/next buttons and dot indicators.
     ---------------------------------------------------------- */
  (() => {
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.querySelector('.reviews-prev');
    const nextBtn = document.querySelector('.reviews-next');
    const dotsContainer = document.getElementById('reviewsDots');
    if (!track) return;

    const cards = track.querySelectorAll('.review-card');
    if (!cards.length) return;

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let autoplayTimer = null;
    const AUTO_INTERVAL = 5000;

    function getCardsPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.max(1, Math.ceil(cards.length / cardsPerView));
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const totalPages = getTotalPages();
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('reviews-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to review page ' + (i + 1));
        dot.addEventListener('click', () => {
          goToPage(i);
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.reviews-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToPage(index) {
      const totalPages = getTotalPages();
      currentIndex = Math.max(0, Math.min(index, totalPages - 1));

      // Calculate scroll position based on card width + gap
      const card = cards[0];
      const style = getComputedStyle(track);
      const gap = parseInt(style.gap) || parseInt(style.columnGap) || 20;
      const cardWidth = card.offsetWidth + gap;
      const offset = currentIndex * cardsPerView * cardWidth;

      track.style.transform = 'translateX(-' + offset + 'px)';
      track.style.transition = 'transform 0.5s ease';

      updateDots();
    }

    function nextPage() {
      const totalPages = getTotalPages();
      if (currentIndex < totalPages - 1) {
        goToPage(currentIndex + 1);
      } else {
        goToPage(0);
      }
    }

    function prevPage() {
      const totalPages = getTotalPages();
      if (currentIndex > 0) {
        goToPage(currentIndex - 1);
      } else {
        goToPage(totalPages - 1);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextPage, AUTO_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Button handlers
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevPage();
        restartAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextPage();
        restartAutoplay();
      });
    }

    // Touch swipe on reviews track
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextPage();
        else prevPage();
        restartAutoplay();
      }
    }, { passive: true });

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newPerView = getCardsPerView();
        if (newPerView !== cardsPerView) {
          cardsPerView = newPerView;
          currentIndex = 0;
          buildDots();
          goToPage(0);
        }
      }, 250);
    });

    buildDots();
    startAutoplay();
  })();

  /* ----------------------------------------------------------
     9. UGC / TIKTOK SLIDER (Drag-to-scroll)
     Horizontal drag scroll for .ugc-slider with mouse
     and touch events.
     ---------------------------------------------------------- */
  (() => {
    const slider = document.querySelector('.ugc-slider');
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      e.preventDefault();
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('dragging');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('dragging');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events (passive for performance)
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  })();

  /* ----------------------------------------------------------
     10. COUNTER ANIMATION (Brand Story stats)
     Animate numbers from 0 to data-target when they
     enter the viewport using IntersectionObserver.
     ---------------------------------------------------------- */
  (() => {
    const counters = document.querySelectorAll('.brand-stat-number[data-target]');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 2000;
      const startTime = performance.now();

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.round(easedProgress * target);

        el.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    counters.forEach(counter => observer.observe(counter));
  })();

  /* ----------------------------------------------------------
     11. COLLECTIONS HORIZONTAL SCROLL (Pinned section)
     Converts vertical scroll into horizontal movement
     while the section is pinned. Uses scroll position to
     translate .collections-track horizontally.
     ---------------------------------------------------------- */
  (() => {
    const wrapper = document.querySelector('.collections-scroll');
    const track = document.getElementById('collectionsTrack');
    if (!wrapper || !track) return;

    function updateHorizontalScroll() {
      const wrapperTop = wrapper.offsetTop;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Total scrollable distance for the wrapper section
      const trackWidth = track.scrollWidth;
      const viewportWidth = wrapper.offsetWidth;
      const maxScroll = trackWidth - viewportWidth;

      if (maxScroll <= 0) return;

      // How much total vertical scroll the section consumes
      const totalScrollRange = wrapper.offsetHeight - viewportHeight;
      if (totalScrollRange <= 0) return;

      // Current progress through the section (0 to 1)
      const scrollIntoSection = scrollY - wrapperTop;
      const progress = Math.max(0, Math.min(1, scrollIntoSection / totalScrollRange));

      // Apply horizontal translation
      track.style.transform = 'translateX(-' + (progress * maxScroll) + 'px)';
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHorizontalScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Also run on resize
    window.addEventListener('resize', updateHorizontalScroll);
    // Initial calculation
    updateHorizontalScroll();
  })();

  /* ----------------------------------------------------------
     12. TESTIMONIALS DRAG SCROLL
     Horizontal drag scrolling for .testimonials-track.
     ---------------------------------------------------------- */
  (() => {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      e.preventDefault();
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  })();

  /* ----------------------------------------------------------
     13. NEWSLETTER FORM
     Handle form submission, show success message.
     ---------------------------------------------------------- */
  (() => {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.newsletter-btn');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!input || !input.value.trim()) return;

      // Simple email validation
      const email = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 2000);
        return;
      }

      // Simulate submission
      if (btn) {
        btn.textContent = 'Subscribed!';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }
      input.value = '';
      input.disabled = true;

      // Show success message
      const successMsg = document.createElement('p');
      successMsg.className = 'newsletter-success';
      successMsg.textContent = 'Thank you for subscribing! Welcome to the CHRONOS circle.';
      successMsg.style.color = '#c9a96e';
      successMsg.style.marginTop = '12px';
      successMsg.style.fontSize = '14px';
      successMsg.style.textAlign = 'center';

      const inputWrap = form.querySelector('.newsletter-input-wrap');
      if (inputWrap) {
        inputWrap.parentNode.insertBefore(successMsg, inputWrap.nextSibling);
      } else {
        form.appendChild(successMsg);
      }

      // Reset after a delay
      setTimeout(() => {
        if (btn) {
          btn.textContent = 'Subscribe';
          btn.disabled = false;
          btn.style.opacity = '';
        }
        input.disabled = false;
        if (successMsg.parentNode) {
          successMsg.parentNode.removeChild(successMsg);
        }
      }, 5000);
    });
  })();

  /* ----------------------------------------------------------
     14. SMOOTH SCROLL for anchor links
     ---------------------------------------------------------- */
  (() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  })();

  /* ----------------------------------------------------------
     15. SECTION REVEAL ANIMATIONS
     Fade-in sections as they enter the viewport using
     IntersectionObserver for a polished scroll experience.
     ---------------------------------------------------------- */
  (() => {
    const sections = document.querySelectorAll(
      '.bs-section, .editorial-banner, .testimonials, .bestsellers, ' +
      '.brand-story, .reviews-section, .ugc-section, .blog, .newsletter'
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
      section.classList.add('reveal');
      observer.observe(section);
    });
  })();

  /* ----------------------------------------------------------
     16. HERO VIDEO — Ensure first video plays on load
     ---------------------------------------------------------- */
  (() => {
    const activeSlide = document.querySelector('.hero-slide.active video');
    if (activeSlide) {
      activeSlide.play().catch(() => {});
    }
  })();

});
