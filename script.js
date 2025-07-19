// Portfolio Website JavaScript
// Author: Haya Ehab
// Description: Main JavaScript file for multilingual portfolio website

class PortfolioApp {
  constructor() {
    this.currentLanguage = 'en';
    this.currentTheme = 'light';
    this.isMenuOpen = false;
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadUserPreferences();
    this.initializeFeatherIcons();
    this.setupScrollAnimations();
    this.setupProjectModals();
    this.setupContactForm();
    this.setupSmoothScrolling();
    this.updateTranslations();
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Language switcher (desktop)
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        if (lang) {
          this.changeLanguage(lang);
        }
      });
    });

    // Mobile language switcher
    const mobileLangButtons = document.querySelectorAll('.mobile-lang-btn');
    mobileLangButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        if (lang) {
          this.changeLanguage(lang);
          this.closeMobileMenu(); // Close mobile menu after language change
        }
      });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
      mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close mobile menu when clicking nav links
      const mobileNavLinks = mobileNav.querySelectorAll('a');
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
    }

    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.project;
        if (projectId) {
          this.openProjectModal(projectId);
        }
      });
    });

    // Modal close and links
    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (modal && modalClose) {
      modalClose.addEventListener('click', () => this.closeProjectModal());
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeProjectModal();
        }
      });
      
      // Modal link event handlers
      const modalDemo = modal.querySelector('.modal-demo');
      const modalCode = modal.querySelector('.modal-code');
      
      if (modalDemo) {
        modalDemo.addEventListener('click', (e) => {
          e.preventDefault();
          if (modalDemo.href && modalDemo.href !== '#') {
            window.open(modalDemo.href, '_blank', 'noopener,noreferrer');
          }
        });
      }
      
      if (modalCode) {
        modalCode.addEventListener('click', (e) => {
          e.preventDefault();
          if (modalCode.href && modalCode.href !== '#') {
            window.open(modalCode.href, '_blank', 'noopener,noreferrer');
          }
        });
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProjectModal();
        this.closeMobileMenu();
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) {
        this.closeMobileMenu();
      }
    });
  }

  loadUserPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.currentTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    // Load language preference
    const savedLanguage = localStorage.getItem('portfolio-language');
    if (savedLanguage && window.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (window.translations[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }

    // Set RTL for Arabic
    if (this.currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', this.currentLanguage);
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('portfolio-theme', this.currentTheme);

    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  changeLanguage(language) {
    if (!window.translations[language]) return;

    this.currentLanguage = language;
    localStorage.setItem('portfolio-language', language);

    // Update active language button (desktop)
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === language) {
        btn.classList.add('active');
      }
    });

    // Update active language button (mobile)
    const mobileLangButtons = document.querySelectorAll('.mobile-lang-btn');
    mobileLangButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === language) {
        btn.classList.add('active');
      }
    });

    // Set RTL for Arabic
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }

    this.updateTranslations();
  }

  updateTranslations() {
    const translations = window.translations[this.currentLanguage];
    if (!translations) return;

    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.dataset.translate;
      const translation = this.getNestedTranslation(translations, key);
      
      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update form labels and placeholders
    this.updateFormTranslations();
  }

  getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] ? current[key] : null;
    }, obj);
  }

  updateFormTranslations() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');

    const translations = window.translations[this.currentLanguage];
    
    if (nameInput && translations.contact?.form?.name) {
      nameInput.placeholder = translations.contact.form.name;
    }
    
    if (emailInput && translations.contact?.form?.email) {
      emailInput.placeholder = translations.contact.form.email;
    }
    
    if (messageTextarea && translations.contact?.form?.message) {
      messageTextarea.placeholder = translations.contact.form.message;
    }
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav) {
      mobileNav.classList.toggle('active', this.isMenuOpen);
    }
    
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', this.isMenuOpen);
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav) {
      mobileNav.classList.remove('active');
    }
    
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    document.body.style.overflow = '';
  }

  initializeFeatherIcons() {
    if (window.feather) {
      feather.replace();
    }
  }

  setupScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe elements that should fade in
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .project-card, .skill-category, .contact-content');
    animatedElements.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.gradient-blob');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  setupProjectModals() {
    // Project modal functionality is handled in the event listeners
    // This method can be used for additional modal setup if needed
  }

  openProjectModal(projectId) {
    const project = window.projectData[projectId];
    const modal = document.getElementById('projectModal');
    
    if (!project || !modal) return;

    const translations = window.translations[this.currentLanguage];
    
    // Update modal content
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalTech = modal.querySelector('.modal-tech');
    const modalDemo = modal.querySelector('.modal-demo');
    const modalCode = modal.querySelector('.modal-code');

    if (modalImage) {
      modalImage.src = project.image;
      modalImage.alt = project.title[this.currentLanguage];
      modalImage.onerror = () => {
        console.error(`Failed to load image: ${project.image}`);
        modalImage.style.display = 'none';
      };
      modalImage.onload = () => {
        modalImage.style.display = 'block';
      };
    }
    if (modalTitle) modalTitle.textContent = project.title[this.currentLanguage];
    if (modalDescription) modalDescription.textContent = project.description[this.currentLanguage];
    
    if (modalTech) {
      modalTech.innerHTML = '';
      project.tech.forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag';
        techTag.textContent = tech;
        modalTech.appendChild(techTag);
      });
    }

    // Handle demo link
    if (modalDemo && project.demoUrl) {
      modalDemo.href = project.demoUrl;
      modalDemo.style.display = 'inline-flex';
      modalDemo.removeAttribute('disabled');
      console.log('Demo link set:', project.demoUrl);
    } else if (modalDemo) {
      modalDemo.href = '#';
      modalDemo.style.display = 'none';
    }
    
    // Handle code link - hide if null (client work)
    if (modalCode && project.codeUrl) {
      modalCode.href = project.codeUrl;
      modalCode.style.display = 'inline-flex';
      modalCode.removeAttribute('disabled');
      console.log('Code link set:', project.codeUrl);
    } else if (modalCode) {
      modalCode.href = '#';
      modalCode.style.display = 'none';
      console.log('Code link hidden - client work or no URL');
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    modal.querySelector('.modal-close').focus();
  }

  closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form before submission
      const isValid = this.validateForm(form);
      if (!isValid) return;

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonHTML = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span>Sending...</span><i data-feather="loader" style="animation: spin 1s linear infinite;"></i>';
      
      // Re-render feather icons
      if (window.feather) {
        feather.replace();
      }

      try {
        // Submit to Formspree
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          this.showFormSuccess();
          form.reset();
        } else {
          const data = await response.json();
          if (data.errors) {
            this.showFormError(data.errors.map(error => error.message).join(', '));
          } else {
            this.showFormError('There was a problem sending your message. Please try again.');
          }
        }
      } catch (error) {
        this.showFormError('Network error. Please check your connection and try again.');
        console.error('Form submission error:', error);
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
        if (window.feather) {
          feather.replace();
        }
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');
    this.removeFieldError(field);

    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;
        
      case 'text':
        if (!value) {
          errorMessage = 'Name is required';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        }
        break;
        
      default:
        if (field.tagName === 'TEXTAREA') {
          if (!value) {
            errorMessage = 'Message is required';
            isValid = false;
          } else if (value.length < 10) {
            errorMessage = 'Message must be at least 10 characters';
            isValid = false;
          }
        }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--primary)';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--space-1)';
    
    field.parentNode.appendChild(errorDiv);
  }

  removeFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    this.removeFieldError(field);
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showFormSuccess() {
    this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
  }

  showFormError(message) {
    this.showFormMessage(message, 'error');
  }

  showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Add to form
    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  setupSmoothScrolling() {
    // Handle navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80; // Account for fixed header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }


}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Additional utility functions
const utils = {
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Format date for internationalization
  formatDate(date, language = 'en') {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    try {
      return new Intl.DateTimeFormat(language, options).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Export utils for potential use in other scripts
window.portfolioUtils = utils;
