/**
 * ============================================================
 * REXALON DIGITAL SOLUTIONS — Main JavaScript
 * ============================================================
 * Handles all interactive behaviour for the marketing website:
 *   1.  Navbar scroll styling
 *   2.  Mobile menu with focus trap & accessibility
 *   3.  Active-link highlighting via IntersectionObserver
 *   4.  Smooth scroll with sticky-navbar offset
 *   5.  Scroll-reveal animations
 *   6.  Counter (number ticker) animation
 *   7.  Portfolio filter with staggered animation
 *   8.  Testimonials carousel (autoplay, swipe, keyboard)
 *   9.  Contact-form validation
 *  10.  Pricing → Contact integration
 *  11.  Back-to-top button
 *  12.  WhatsApp FAB link
 *  13.  Process-line animation
 *  14.  Parallax effect on hero mockups
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------
   * 0. UTILITIES & SHARED REFERENCES
   * ------------------------------------------------------ */

  /** Detect user prefers-reduced-motion */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Desktop breakpoint media query */
  const isDesktop = window.matchMedia('(min-width: 1025px)');

  /** Fixed navbar height used for scroll offsets */
  const NAVBAR_HEIGHT = 80;

  /* --------------------------------------------------------
   * 1. NAVBAR SCROLL BEHAVIOUR
   * ------------------------------------------------------ */

  const navbar = document.querySelector('.navbar');
  const logoWhite = document.querySelector('.logo-white');
  const logoDark = document.querySelector('.logo-dark');

  /**
   * Toggle .scrolled class on the navbar when the user scrolls
   * past 80 px.  Also swap logo variants for light / dark BGs.
   */
  function handleNavbarScroll() {
    if (!navbar) return;

    if (window.scrollY > NAVBAR_HEIGHT) {
      navbar.classList.add('scrolled');
      if (logoWhite) logoWhite.style.display = 'none';
      if (logoDark) logoDark.style.display = 'block';
    } else {
      navbar.classList.remove('scrolled');
      if (logoWhite) logoWhite.style.display = 'block';
      if (logoDark) logoDark.style.display = 'none';
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  /* Run once on load so the correct state is applied immediately */
  handleNavbarScroll();

  /* --------------------------------------------------------
   * 2. MOBILE MENU (hamburger, overlay, focus trap)
   * ------------------------------------------------------ */

  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const overlay = document.querySelector('.navbar__overlay');

  /**
   * Open or close the mobile navigation drawer.
   * @param {boolean} open – true to open, false to close
   */
  function toggleMobileMenu(open) {
    if (!mobileMenu || !overlay || !hamburger) return;

    if (open) {
      mobileMenu.classList.add('open');
      overlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      /* Move focus to the first focusable element inside the menu */
      const firstFocusable = mobileMenu.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus();
    } else {
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  }

  /** Check whether the mobile menu is currently visible */
  function isMobileMenuOpen() {
    return mobileMenu && mobileMenu.classList.contains('open');
  }

  /* Hamburger toggle */
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      toggleMobileMenu(!isMobileMenuOpen());
    });
  }

  /* Mobile close button */
  const mobileCloseBtn = document.querySelector('.navbar__mobile-close');
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => {
      hamburger.classList.remove('open');
      toggleMobileMenu(false);
    });
  }

  /* Close on overlay click */
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('open');
      toggleMobileMenu(false);
    });
  }

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen()) {
      if (hamburger) hamburger.classList.remove('open');
      toggleMobileMenu(false);
    }
  });

  /* Close when any link inside mobile menu is clicked */
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('open');
        toggleMobileMenu(false);
      });
    });
  }

  /**
   * Focus trap — keep Tab / Shift+Tab cycling within the open
   * mobile menu so keyboard users cannot accidentally tab behind
   * the overlay.
   */
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusableEls = mobileMenu.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        /* Shift + Tab — wrap to end */
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        /* Tab — wrap to start */
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });
  }

  /* --------------------------------------------------------
   * 3. ACTIVE LINK HIGHLIGHTING (IntersectionObserver)
   * ------------------------------------------------------ */

  /** Collect all desktop + mobile nav links whose href starts with # */
  const navLinks = document.querySelectorAll(
    '.navbar__links a[href^="#"], .navbar__mobile-menu a[href^="#"]'
  );

  /** Build a map: sectionId → [corresponding link elements] */
  const sectionLinkMap = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').substring(1);
    if (!sectionLinkMap[id]) sectionLinkMap[id] = [];
    sectionLinkMap[id].push(link);
  });

  /**
   * Set .active on the links pointing to the given section ID and
   * remove it from all others.
   */
  function setActiveLink(sectionId) {
    navLinks.forEach((link) => link.classList.remove('active'));
    if (sectionLinkMap[sectionId]) {
      sectionLinkMap[sectionId].forEach((link) => link.classList.add('active'));
    }
  }

  /** Observe every section whose ID has a matching nav link */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      /* Negative top margin so the section is considered "in view"
         once it scrolls beneath the fixed navbar */
      rootMargin: `-${NAVBAR_HEIGHT}px 0px -40% 0px`,
      threshold: 0,
    }
  );

  Object.keys(sectionLinkMap).forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });

  /* --------------------------------------------------------
   * 4. SMOOTH SCROLL WITH OFFSET
   * ------------------------------------------------------ */

  /**
   * Intercept clicks on all anchor links that point to an on-page
   * target (#…) and scroll there smoothly, accounting for the
   * sticky navbar height.
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; /* skip bare "#" links */

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const topPosition =
        targetEl.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

      window.scrollTo({
        top: topPosition,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      });

      /* Close mobile menu if it's open */
      if (isMobileMenuOpen()) {
        toggleMobileMenu(false);
      }
    });
  });

  /* --------------------------------------------------------
   * 5. SCROLL REVEAL (IntersectionObserver, one-time)
   * ------------------------------------------------------ */

  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion.matches) {
    /* If user prefers reduced motion, reveal everything immediately */
    revealElements.forEach((el) => el.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); /* one-time */
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------------------------------
   * 6. COUNTER ANIMATION
   * ------------------------------------------------------ */

  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false; /* ensure we only trigger once */

  /**
   * Animate a single counter element from 0 to its data-target
   * value over ~2 000 ms using requestAnimationFrame.
   */
  function animateCounter(counterEl) {
    const target = parseInt(counterEl.getAttribute('data-target'), 10);
    const suffix = counterEl.getAttribute('data-suffix') || '';
    const duration = 2000; /* milliseconds */
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counterEl.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        /* Ensure we land exactly on the target value */
        counterEl.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Use an IntersectionObserver on the trust-strip / stats section
   * to kick off all counter animations when it scrolls into view.
   */
  const trustStrip =
    document.querySelector('.trust-strip') ||
    document.querySelector('.stats') ||
    (counters.length > 0 ? counters[0].closest('section') : null);

  if (trustStrip && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counters.forEach((c) => animateCounter(c));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(trustStrip);
  }

  /* --------------------------------------------------------
   * 7. PORTFOLIO FILTER
   * ------------------------------------------------------ */

  const filterButtons = document.querySelectorAll('[data-filter]');
  const portfolioCards = document.querySelectorAll('[data-category]');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      /* Update aria-pressed on every button */
      filterButtons.forEach((b) => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        b.classList.toggle('active', b === btn);
      });

      /* Show / hide cards with staggered animation */
      let visibleIndex = 0;
      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          /* Stagger the reveal so cards don't all pop in at once */
          const delay = visibleIndex * 80; /* ms per card */
          card.classList.remove('hidden');
          card.style.transitionDelay = `${delay}ms`;
          visibleIndex++;
        } else {
          card.classList.add('hidden');
          card.style.transitionDelay = '0ms';
        }
      });
    });
  });

  /* --------------------------------------------------------
   * 8. TESTIMONIALS CAROUSEL
   * ------------------------------------------------------ */

  const carouselContainer = document.querySelector('.testimonials__carousel') ||
    document.querySelector('.testimonials');
  const track = document.querySelector('.testimonials__track');
  const prevBtn = document.querySelector('.testimonials__prev');
  const nextBtn = document.querySelector('.testimonials__next');
  const dots = document.querySelectorAll('.testimonials__dot');

  if (track) {
    const slides = track.children;
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;

    /**
     * Move the track so the slide at `index` is visible.
     * @param {number} index – zero-based slide index
     */
    function goToSlide(index) {
      /* Wrap index around */
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      /* Translate the track */
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      /* Update dots */
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });

      /* Update slides' aria-hidden for a11y */
      Array.from(slides).forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== currentIndex ? 'true' : 'false');
      });
    }

    /** Advance to the next slide */
    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    /** Go to the previous slide */
    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    /* Navigation buttons */
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    /* Dot navigation */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });

    /* ---- Autoplay ---- */
    function startAutoplay() {
      if (prefersReducedMotion.matches) return; /* respect user preference */
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    /* Pause on hover and on focus-within */
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoplay);
      carouselContainer.addEventListener('mouseleave', startAutoplay);
      carouselContainer.addEventListener('focusin', stopAutoplay);
      carouselContainer.addEventListener('focusout', startAutoplay);
    }

    /* Start autoplay unless reduced motion */
    startAutoplay();

    /* ---- Touch / swipe support ---- */
    if (track) {
      track.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );

      track.addEventListener(
        'touchend',
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const deltaX = touchEndX - touchStartX;
          if (deltaX > 50) prevSlide();       /* swipe right → prev */
          else if (deltaX < -50) nextSlide(); /* swipe left  → next */
        },
        { passive: true }
      );
    }

    /* ---- Keyboard navigation ---- */
    if (carouselContainer) {
      carouselContainer.setAttribute('tabindex', '0');
      carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
        }
      });
    }

    /* Initialise first slide */
    goToSlide(0);
  }

  /* --------------------------------------------------------
   * 9. CONTACT FORM VALIDATION
   * ------------------------------------------------------ */

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    /**
     * Show an error message beneath a form field.
     * @param {HTMLElement} group   – the .form-group wrapper
     * @param {string}      message – the error text
     */
    function showError(group, message) {
      group.classList.add('error');
      const errorEl = group.querySelector('.form-group__error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.setAttribute('aria-live', 'polite');
        errorEl.style.display = 'block';
      }
    }

    /**
     * Clear the error state from a form group.
     * @param {HTMLElement} group – the .form-group wrapper
     */
    function clearError(group) {
      group.classList.remove('error');
      const errorEl = group.querySelector('.form-group__error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    /**
     * Validate the entire form. Returns true if every field is valid.
     */
    function validateForm() {
      let isValid = true;

      /* --- Name --- */
      const nameGroup = contactForm.querySelector('#contact-name')?.closest('.form-group');
      const nameInput = contactForm.querySelector('#contact-name');
      if (nameGroup && nameInput) {
        clearError(nameGroup);
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          showError(nameGroup, 'Please enter your name (at least 2 characters).');
          isValid = false;
        }
      }

      /* --- Email --- */
      const emailGroup = contactForm.querySelector('#contact-email')?.closest('.form-group');
      const emailInput = contactForm.querySelector('#contact-email');
      if (emailGroup && emailInput) {
        clearError(emailGroup);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
          showError(emailGroup, 'Please enter a valid email address.');
          isValid = false;
        }
      }

      /* --- Phone (optional but validated if filled) --- */
      const phoneGroup = contactForm.querySelector('#contact-phone')?.closest('.form-group');
      const phoneInput = contactForm.querySelector('#contact-phone');
      if (phoneGroup && phoneInput && phoneInput.value.trim() !== '') {
        clearError(phoneGroup);
        const phoneRegex = /^[\d\s+\-]+$/;
        const phoneVal = phoneInput.value.trim();
        if (!phoneRegex.test(phoneVal) || phoneVal.length < 10) {
          showError(phoneGroup, 'Please enter a valid phone number (min 10 characters, digits/spaces/+/- only).');
          isValid = false;
        }
      } else if (phoneGroup) {
        clearError(phoneGroup);
      }

      /* --- Service --- */
      const serviceGroup = contactForm.querySelector('#contact-service')?.closest('.form-group');
      const serviceInput = contactForm.querySelector('#contact-service');
      if (serviceGroup && serviceInput) {
        clearError(serviceGroup);
        if (!serviceInput.value || serviceInput.value === '') {
          showError(serviceGroup, 'Please select a service.');
          isValid = false;
        }
      }

      /* --- Message --- */
      const messageGroup = contactForm.querySelector('#contact-message')?.closest('.form-group');
      const messageInput = contactForm.querySelector('#contact-message');
      if (messageGroup && messageInput) {
        clearError(messageGroup);
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
          showError(messageGroup, 'Please enter a message (at least 10 characters).');
          isValid = false;
        }
      }

      return isValid;
    }

    /**
     * Handle form submission.
     * TODO: Connect this to a real backend endpoint (e.g. Formspree,
     *       Netlify Forms, or your own API).
     */
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateForm()) {
        /* Hide the form and show success feedback */
        contactForm.style.display = 'none';
        const successEl = document.querySelector('.form-success');
        if (successEl) {
          successEl.style.display = 'block';
          successEl.setAttribute('role', 'alert');
        }
      }
    });
  }

  /* --------------------------------------------------------
   * 10. PRICING → CONTACT INTEGRATION
   * ------------------------------------------------------ */

  /**
   * "Request Quote" buttons inside pricing cards carry a
   * data-service attribute whose value matches an <option> in
   * the #service select.  On click we scroll to #contact and
   * pre-select the matching service.
   */
  const quoteButtons = document.querySelectorAll('[data-service]');

  quoteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const serviceName = btn.getAttribute('data-service');
      const serviceSelect = document.querySelector('#contact-service');
      const contactSection = document.getElementById('contact');

      /* Pre-select matching option */
      if (serviceSelect) {
        const options = serviceSelect.querySelectorAll('option');
        options.forEach((opt) => {
          if (
            opt.value === serviceName ||
            opt.textContent.trim().toLowerCase() === serviceName.toLowerCase()
          ) {
            serviceSelect.value = opt.value;
          }
        });
      }

      /* Scroll to contact section */
      if (contactSection) {
        const topPosition =
          contactSection.getBoundingClientRect().top +
          window.scrollY -
          NAVBAR_HEIGHT;
        window.scrollTo({
          top: topPosition,
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
        });
      }

      /* Close mobile menu if open */
      if (isMobileMenuOpen()) {
        toggleMobileMenu(false);
      }
    });
  });

  /* --------------------------------------------------------
   * 11. BACK TO TOP BUTTON
   * ------------------------------------------------------ */

  const backToTopBtn = document.querySelector('.back-to-top');

  /** Show the button when the user scrolls past 600 px */
  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      });
    });
  }

  /* --------------------------------------------------------
   * 12. WHATSAPP FAB
   * ------------------------------------------------------ */

  /**
   * Ensure the WhatsApp button points to the correct wa.me link.
   * Replace the placeholder phone number with the real one when
   * you have it.
   */
  const whatsappBtn = document.querySelector('.whatsapp-fab') ||
    document.querySelector('.whatsapp-btn') ||
    document.querySelector('[data-whatsapp]');

  if (whatsappBtn && whatsappBtn.tagName === 'A') {
    /* Placeholder — replace 1234567890 with the real number */
    if (!whatsappBtn.getAttribute('href') || whatsappBtn.getAttribute('href') === '#') {
      whatsappBtn.setAttribute('href', 'https://wa.me/1234567890');
    }
    whatsappBtn.setAttribute('target', '_blank');
    whatsappBtn.setAttribute('rel', 'noopener noreferrer');
    whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  }

  /* --------------------------------------------------------
   * 13. PROCESS LINE ANIMATION
   * ------------------------------------------------------ */

  const processSection = document.querySelector('.process') ||
    document.querySelector('#process');
  const processLineFill = document.querySelector('.process__line-fill');
  const processSteps = document.querySelectorAll('.process__step');

  if (processSection) {
    const processObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            /* Animate the connecting line from 0 → 100% width */
            if (processLineFill) {
              processLineFill.style.width = '100%';
            }

            /* Activate each step with a staggered delay */
            processSteps.forEach((step, i) => {
              setTimeout(() => {
                step.classList.add('active');
              }, i * 400); /* 400 ms stagger per step */
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    processObserver.observe(processSection);
  }

  /* --------------------------------------------------------
   * 14. PARALLAX EFFECT ON HERO MOCKUPS (desktop only)
   * ------------------------------------------------------ */

  const heroSection = document.querySelector('.hero');
  const heroMockups = document.querySelectorAll('.hero__mockup');

  if (heroSection && heroMockups.length > 0) {
    /** Depth multipliers — different elements move by different amounts */
    const depthFactors = [0.03, 0.05, 0.02, 0.04];

    let rafId = null;

    /**
     * Compute subtle translate values based on mouse position
     * relative to the centre of the hero section.
     */
    function handleParallax(e) {
      if (!isDesktop.matches) return;

      /* Cancel any queued frame before requesting a new one */
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = e.clientX - centerX;
        const moveY = e.clientY - centerY;

        heroMockups.forEach((mockup, i) => {
          const factor = depthFactors[i % depthFactors.length];
          const tx = moveX * factor;
          const ty = moveY * factor;
          mockup.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      });
    }

    /**
     * Reset mockup positions when the mouse leaves the hero or
     * if we switch to a smaller viewport.
     */
    function resetParallax() {
      if (rafId) cancelAnimationFrame(rafId);
      heroMockups.forEach((mockup) => {
        mockup.style.transform = 'translate(0, 0)';
      });
    }

    heroSection.addEventListener('mousemove', handleParallax);
    heroSection.addEventListener('mouseleave', resetParallax);

    /* Reset if user resizes below desktop breakpoint */
    isDesktop.addEventListener('change', (e) => {
      if (!e.matches) resetParallax();
    });
  }

  /* --------------------------------------------------------
   * END — All interactive features initialised.
   * ------------------------------------------------------ */
});
