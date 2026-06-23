document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------- Sticky header blur ---------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------- Mobile nav toggle --------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      siteNav.classList.toggle('open');
    });
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        siteNav.classList.remove('open');
      });
    });
  }

  /* ------------------------------ Scroll reveal ----------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* --------------------------- Animated stat counters ------------------------ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCount = el => {
      const target = parseFloat(el.dataset.count);
      const duration = 1600;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = target % 1 !== 0 ? value.toFixed(1) : Math.floor(value).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target % 1 !== 0 ? target.toFixed(1) : target.toLocaleString();
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* -------------------------------- Gallery filters --------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  if (filterButtons.length && masonryItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        masonryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !match);
        });
      });
    });
  }

  /* ------------------------------ Contact form validation --------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const fields = form.querySelectorAll('[required]');
    const successMsg = document.getElementById('formSuccess');

    const validateField = field => {
      const row = field.closest('.form-row');
      let valid = field.checkValidity();

      if (field.type === 'email' && field.value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      }
      if (field.type === 'tel' && field.value) {
        valid = /^[\d\s\-+()]{7,}$/.test(field.value);
      }

      row.classList.toggle('has-error', !valid);
      field.classList.toggle('invalid', !valid);
      return valid;
    };

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-row').classList.contains('has-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      let allValid = true;
      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus();
        return;
      }

      if (successMsg) {
        successMsg.classList.add('visible');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  /* --------------------------------- Footer year ------------------------------ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
