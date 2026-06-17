/**
 * Virtu Capital 管理员端操作指南 - JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Active nav link based on scroll ---
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // --- 2. Smooth scroll for nav links ---
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        history.pushState(null, '', '#' + targetId);
      }
      // Close mobile sidebar
      document.querySelector('.sidebar').classList.remove('open');
    });
  });

  // --- 3. FAQ accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function() {
      item.classList.toggle('open');
    });
  });

  // --- 4. Mobile sidebar toggle ---
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
        sidebar.classList.remove('open');
      }
    }
  });

  // --- 5. Dark mode / Light mode toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      this.textContent = isDark ? '☀️ Light' : '🌙 Dark';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Restore saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️ Light';
    }
  }

  // --- 6. Image lightbox --- optional, just adds cursor pointer
  const contentImages = document.querySelectorAll('.content img:not(.no-lightbox)');
  contentImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      window.open(this.src, '_blank');
    });
    img.setAttribute('title', '点击查看大图');
  });

  // --- 7. Print functionality ---
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }

  // --- 8. Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 9. Highlight table rows on hover ---
  const tables = document.querySelectorAll('.content table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8fafc';
      });
      row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
      });
    });
  });

});
