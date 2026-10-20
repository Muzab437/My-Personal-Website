document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initScrollSpy();
  initSkillBars();
  initScrollReveal();
  initContactCopy();
  initBackToTop();
});

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('rmf_theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rmf_theme', newTheme);
      showToast(newTheme === 'dark' ? 'Mode Cyber Dark aktif' : 'Mode Electric Slate aktif');
    });
  }
}

function initNavigation() {
  const mobileToggleBtn = document.getElementById('mobileMenuBtn');
  const navCapsule = document.getElementById('navCapsule');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navCapsule) {
    mobileToggleBtn.addEventListener('click', () => {
      navCapsule.classList.toggle('mobile-open');
      const isOpen = navCapsule.classList.contains('mobile-open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navCapsule.classList.remove('mobile-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navCapsule.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        navCapsule.classList.remove('mobile-open');
      }
    });
  }
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

function initSkillBars() {
  const skillBars = document.querySelectorAll('.progress-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillElement = entry.target;
        const targetPercent = fillElement.getAttribute('data-percentage') || '0';
        fillElement.style.width = `${targetPercent}%`;
        obs.unobserve(fillElement);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => observer.observe(bar));
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

function initContactCopy() {
  const copyButtons = document.querySelectorAll('[data-copy-val]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const val = btn.getAttribute('data-copy-val');
      const label = btn.getAttribute('data-copy-label') || 'Teks';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`${label} disalin ke clipboard!`);
        }).catch(() => {
          fallbackCopyText(val, label);
        });
      } else {
        fallbackCopyText(val, label);
      }
    });
  });

  const copyInfoBtn = document.getElementById('copyQuickInfoBtn');
  if (copyInfoBtn) {
    copyInfoBtn.addEventListener('click', () => {
      const summary = `Rayhan Muzab Fauzan | Mahasiswa S1 Informatika Telkom University Bandung | Kontak: +62 813-2400-5756 | rayhanmuzab_`;
      navigator.clipboard.writeText(summary).then(() => {
        showToast('Info biodata singkat disalin ke clipboard!');
      });
    });
  }
}

function fallbackCopyText(text, label) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(`${label} disalin ke clipboard!`);
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastMessage');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
