/**
 * Virtu Capital 管理员端操作指南 - JavaScript
 * RockFlow Inspired
 */

document.addEventListener('DOMContentLoaded', function() {

  // ===== 1. Sidebar Category Toggle =====
  window.toggleCategory = function(el) {
    el.classList.toggle('active');
    const sub = el.nextElementSibling;
    if (sub && sub.classList.contains('sub-items')) {
      sub.classList.toggle('open');
      // Save state
      const text = el.querySelector('span')?.textContent?.trim() || '';
      const saved = JSON.parse(localStorage.getItem('sidebarOpen') || '[]');
      if (sub.classList.contains('open')) {
        if (!saved.includes(text)) saved.push(text);
      } else {
        const idx = saved.indexOf(text);
        if (idx > -1) saved.splice(idx, 1);
      }
      localStorage.setItem('sidebarOpen', JSON.stringify(saved));
    }
  };

  // Restore sidebar open states
  (function restoreSidebar() {
    const saved = JSON.parse(localStorage.getItem('sidebarOpen') || '[]');
    document.querySelectorAll('.category-toggle').forEach(toggle => {
      const text = toggle.querySelector('span')?.textContent?.trim() || '';
      if (saved.includes(text)) {
        toggle.classList.add('active');
        const sub = toggle.nextElementSibling;
        if (sub && sub.classList.contains('sub-items')) {
          sub.classList.add('open');
        }
      }
    });
  })();

  // Open sidebar category when navigating to a sub-item
  (function openCategoryForActiveLink() {
    const activeSub = document.querySelector('.sub-items a.active');
    if (activeSub) {
      const subItems = activeSub.closest('.sub-items');
      const toggle = subItems?.previousElementSibling;
      if (toggle && toggle.classList.contains('category-toggle') && !toggle.classList.contains('active')) {
        toggle.classList.add('active');
        subItems.classList.add('open');
      }
    }
  })();

  // ===== 2. Active nav link based on scroll =====
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  const topNavLinks = document.querySelectorAll('.top-nav-menu a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 130;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    // Sidebar link highlighting
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
        // Auto-open parent category
        const parentSub = link.closest('.sub-items');
        if (parentSub) {
          const toggle = parentSub.previousElementSibling;
          if (toggle && toggle.classList.contains('category-toggle') && !toggle.classList.contains('active')) {
            toggle.classList.add('active');
            parentSub.classList.add('open');
          }
        }
      }
    });

    // Top nav link highlighting (for top-level sections)
    topNavLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId || currentId.startsWith('section-')) {
        // Keep the "帮助中心" active while scrolling content sections
        if (currentId.startsWith('section-') && link.textContent.includes('帮助中心')) {
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ===== 3. Smooth scroll for all anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + targetId);
      }
      // Close mobile sidebar if needed
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });

  // ===== 4. FAQ accordion =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        item.classList.toggle('open');
      });
    }
  });

  // ===== 5. Mobile sidebar toggle =====
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebar = document.querySelector('.sidebar');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar?.classList.toggle('open');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && sidebar?.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // ===== 6. Dark mode toggle =====
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const updateThemeBtn = () => {
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.textContent = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
    };

    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      updateThemeBtn();
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Restore saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
    updateThemeBtn();
  }

  // ===== 7. Image click to view full =====
  document.querySelectorAll('.content img:not(.no-lightbox)').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      window.open(this.src, '_blank');
    });
    img.setAttribute('title', '点击查看大图');
  });

  // ===== 8. Print =====
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }

  // ===== 9. Back to Top =====
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      backToTopBtn.classList.toggle('show', window.scrollY > 400);
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== 10. Table row hover effect (CSS fallback) =====
  // Already handled by CSS .content tbody tr:hover

  // ===== 11. Hash-based section highlight on load =====
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

});
