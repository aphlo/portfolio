/**
 * Portfolio Site - Main JavaScript
 * Apple Design System interactions
 */

// ============================================================================
// Mobile Navigation Toggle
// ============================================================================

const initMobileNav = () => {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navbarLinks = document.querySelectorAll('.navbar-link');
  const body = document.body;

  if (!navbarToggle || !navbarMenu) return;

  // Toggle menu
  navbarToggle.addEventListener('click', () => {
    const isOpen = navbarMenu.classList.contains('active');

    if (isOpen) {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      body.style.overflow = '';
    } else {
      navbarMenu.classList.add('active');
      navbarToggle.classList.add('active');
      body.style.overflow = 'hidden';
    }
  });

  // Close menu when clicking on a link
  navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      body.style.overflow = '';
    }
  });
};

// ============================================================================
// Smooth Scroll
// ============================================================================

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip empty hash or hash-only links
      if (href === '#' || href === '#!') {
        e.preventDefault();
        return;
      }

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ============================================================================
// Navbar Background on Scroll
// ============================================================================

const initNavbarScroll = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;
  const hideThreshold = 10; // Minimum scroll amount to trigger hide/show

  const isMobile = () => window.innerWidth <= 768;

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class based on scroll position
    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on mobile when scrolling
    if (isMobile()) {
      const scrollDiff = currentScroll - lastScroll;

      if (scrollDiff > hideThreshold && currentScroll > scrollThreshold) {
        // Scrolling down - hide navbar
        navbar.classList.add('navbar-hidden');
      } else if (scrollDiff < -hideThreshold || currentScroll <= scrollThreshold) {
        // Scrolling up or at top - show navbar
        navbar.classList.remove('navbar-hidden');
      }
    } else {
      // Always show on desktop
      navbar.classList.remove('navbar-hidden');
    }

    lastScroll = currentScroll;
  };

  // Throttle scroll events for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Handle resize events
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      navbar.classList.remove('navbar-hidden');
    }
  });

  // Initial check
  handleScroll();
};

// ============================================================================
// Scroll Reveal Animations
// ============================================================================

const initScrollReveal = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: unobserve after reveal (one-time animation)
        // observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll(`
    .animate-fade-in-up,
    .card,
    .stat-card,
    .feature-card,
    .skill-card,
    .project-card,
    .strength-card,
    .experience-item,
    .cert-item,
    .testimonial-card,
    .challenge-card
  `);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
};

// ============================================================================
// Scroll Indicator (Hero Section)
// ============================================================================

const initScrollIndicator = () => {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;

  scrollIndicator.addEventListener('click', () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = productsSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });

  // Hide scroll indicator when scrolled past hero
  const hero = document.querySelector('.hero');
  if (hero) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const heroBottom = hero.offsetHeight;
          if (window.pageYOffset > heroBottom * 0.5) {
            scrollIndicator.style.opacity = '0';
          } else {
            scrollIndicator.style.opacity = '1';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};

// ============================================================================
// Performance Optimization: Reduce Motion for Accessibility
// ============================================================================

const initReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handleReducedMotion = (mediaQuery) => {
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--duration-fast', '0ms');
      document.documentElement.style.setProperty('--duration-base', '0ms');
      document.documentElement.style.setProperty('--duration-slow', '0ms');
    }
  };

  handleReducedMotion(prefersReducedMotion);
  prefersReducedMotion.addEventListener('change', handleReducedMotion);
};

// ============================================================================
// Back to Top Button (Optional - can be added to HTML)
// ============================================================================

const initBackToTop = () => {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.pageYOffset > 500) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// ============================================================================
// Initialize All Features
// ============================================================================

const init = () => {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
};

const initAll = () => {
  initMobileNav();
  initSmoothScroll();
  initNavbarScroll();
  initScrollReveal();
  initScrollIndicator();
  initReducedMotion();
  initBackToTop();

  // Add loaded class to body for CSS transitions
  document.body.classList.add('loaded');
};

// Start initialization
init();
