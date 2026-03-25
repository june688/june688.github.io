/**
 * 博客主脚本
 * 包含：主题切换、移动端菜单、平滑滚动等功能
 */

(function() {
  'use strict';

  // ===== 主题切换功能 =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  
  // 从 localStorage 读取主题设置，默认跟随系统
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // 检测系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // 应用主题
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
    localStorage.setItem('theme', theme);
  }

  // 切换主题
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // 初始化主题
  applyTheme(getInitialTheme());

  // 绑定主题切换按钮
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 只有在用户没有手动设置主题时才自动切换
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ===== 移动端菜单 =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  // ===== 导航栏滚动效果 =====
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // 添加/移除阴影效果
    if (currentScrollY > 10) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  // 使用 requestAnimationFrame 优化滚动性能
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ===== 平滑滚动 =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== 文章卡片动画 =====
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const articleCards = document.querySelectorAll('.article-card');
  
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // 添加延迟，创建级联动画效果
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    articleCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      cardObserver.observe(card);
    });
  } else {
    // 降级处理：直接显示
    articleCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  // ===== 打字机效果（可选，用于首页标题） =====
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle && window.location.pathname.includes('index')) {
    const originalText = heroTitle.innerHTML;
    const textContent = heroTitle.textContent;
    
    // 检查是否包含高亮标签
    const hasHighlight = originalText.includes('<span class="highlight">');
    
    if (!hasHighlight) {
      heroTitle.textContent = '';
      let charIndex = 0;
      
      function typeWriter() {
        if (charIndex < textContent.length) {
          heroTitle.textContent += textContent.charAt(charIndex);
          charIndex++;
          setTimeout(typeWriter, 50);
        }
      }
      
      // 延迟开始打字效果
      setTimeout(typeWriter, 500);
    }
  }

  // ===== 添加 CSS 类用于滚动效果 =====
  const style = document.createElement('style');
  style.textContent = `
    .navbar.scrolled {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    [data-theme="dark"] .navbar.scrolled {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  `;
  document.head.appendChild(style);

  // ===== 页面加载完成后的初始化 =====
  document.addEventListener('DOMContentLoaded', () => {
    // 添加页面加载动画类
    document.body.classList.add('loaded');
    
    console.log('🚀 博客已加载完成！');
    console.log('💡 提示：点击右上角 🌙/☀️ 可以切换亮色/暗色主题');
  });

})();
