/**
 * NorthPeak Digital - Main JavaScript File
 * ========================================
 *
 * This file serves as the entry point for all JavaScript functionality.
 */

// ========================================
// Navbar Module
// ========================================

/**
 * Navbar functionality for mobile menu and scroll state
 */
const navbarModule = (function() {
  // DOM Elements
  const navbar = document.querySelector('.navbar');
  const toggleButton = document.querySelector('.navbar__toggle');
  const nav = document.querySelector('.navbar__nav');
  const navLinks = document.querySelectorAll('.navbar__link');

  // Toggle mobile menu
  function toggleMobileMenu() {
    const isOpen = nav.classList.contains('navbar__nav--open');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Open mobile menu
  function openMobileMenu() {
    nav.classList.add('navbar__nav--open');
    toggleButton.setAttribute('aria-expanded', 'true');
  }

  // Close mobile menu
  function closeMobileMenu() {
    nav.classList.remove('navbar__nav--open');
    toggleButton.setAttribute('aria-expanded', 'false');
  }

  // Handle scroll state for navbar background
  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  // Close mobile menu when a navigation link is clicked
  function handleNavLinkClick() {
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Initialize navbar functionality
  function init() {
    // Set up event listeners
    toggleButton.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);

    // Handle nav link clicks (mobile)
    handleNavLinkClick();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Public API
  return {
    init
  };
})();

// ========================================
// Contact Form Module
// ========================================

/**
 * Contact form validation, error display, and success feedback
 */
const contactFormModule = (function() {
  // DOM Elements
  const form = document.querySelector('.contact__form');

  // Return early if form doesn't exist on the page
  if (!form) {
    return { init: function() {} };
  }

  const fields = {
    name: form.querySelector('#contact-name'),
    email: form.querySelector('#contact-email'),
    project: form.querySelector('#contact-project'),
    message: form.querySelector('#contact-message')
  };

  // Email regex pattern (standard RFC-compatible)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation rules for each field
  const validationRules = {
    name: {
      validate: function(value) { return value.trim().length >= 2; },
      message: 'Please enter your full name.'
    },
    email: {
      validate: function(value) { return EMAIL_REGEX.test(value.trim()); },
      message: 'Please enter a valid email address.'
    },
    project: {
      validate: function(value) { return value !== ''; },
      message: 'Please select a project type.'
    },
    message: {
      validate: function(value) { return value.trim().length >= 10; },
      message: 'Please enter a message (at least 10 characters).'
    }
  };

  // ----------------------------------------
  // Error Handling
  // ----------------------------------------

  /**
   * Show an inline error below a field
   */
  function showError(field, message) {
    const group = field.closest('.contact__form-group');

    // Add error class to the input
    field.classList.add(getErrorClass(field));

    // Only add error message if not already present
    if (!group.querySelector('.contact__form-error')) {
      const errorEl = document.createElement('span');
      errorEl.className = 'contact__form-error';
      errorEl.setAttribute('role', 'alert');
      errorEl.textContent = message;
      group.appendChild(errorEl);
    }
  }

  /**
   * Clear the inline error for a field
   */
  function clearError(field) {
    const group = field.closest('.contact__form-group');

    // Remove error class
    field.classList.remove(getErrorClass(field));

    // Remove error message element
    const errorEl = group.querySelector('.contact__form-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  /**
   * Get the correct BEM error modifier class based on element type
   */
  function getErrorClass(field) {
    if (field.tagName === 'SELECT') return 'contact__form-select--error';
    if (field.tagName === 'TEXTAREA') return 'contact__form-textarea--error';
    return 'contact__form-input--error';
  }

  // ----------------------------------------
  // Validation
  // ----------------------------------------

  /**
   * Validate a single field. Returns true if valid.
   */
  function validateField(key) {
    const field = fields[key];
    const rule = validationRules[key];

    if (!rule.validate(field.value)) {
      showError(field, rule.message);
      return false;
    }

    clearError(field);
    return true;
  }

  /**
   * Validate all fields. Returns true if all are valid.
   */
  function validateAll() {
    let isValid = true;

    Object.keys(validationRules).forEach(function(key) {
      if (!validateField(key)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // ----------------------------------------
  // Success Feedback
  // ----------------------------------------

  /**
   * Show a success toast notification
   */
  function showSuccessToast() {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'contact__success';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML =
      '<i data-lucide="check-circle" class="contact__success-icon" aria-hidden="true"></i>' +
      '<span class="contact__success-text">Thank you! Your message has been received.</span>';

    document.body.appendChild(toast);

    // Re-initialize Lucide icons for the new element
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Trigger slide-in (allow DOM paint before adding visible class)
    requestAnimationFrame(function() {
      toast.classList.add('contact__success--visible');
    });

    // Auto-dismiss after 5 seconds
    setTimeout(function() {
      toast.classList.remove('contact__success--visible');

      // Remove from DOM after transition completes
      setTimeout(function() {
        toast.remove();
      }, 350);
    }, 5000);
  }

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------

  /**
   * Handle form submission
   */
  function handleSubmit(event) {
    event.preventDefault();

    if (validateAll()) {
      showSuccessToast();
      form.reset();
    }
  }

  /**
   * Attach real-time error clearing on user input
   */
  function attachLiveValidation() {
    Object.keys(fields).forEach(function(key) {
      var field = fields[key];
      var eventType = (field.tagName === 'SELECT') ? 'change' : 'input';

      field.addEventListener(eventType, function() {
        // Only clear if the field currently has an error
        if (field.classList.contains(getErrorClass(field))) {
          validateField(key);
        }
      });
    });
  }

  // ----------------------------------------
  // Initialization
  // ----------------------------------------

  /**
   * Initialize contact form functionality
   */
  function init() {
    form.addEventListener('submit', handleSubmit);
    attachLiveValidation();
  }

  // Public API
  return {
    init
  };
})();

// ========================================
// Initialize All Modules
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  navbarModule.init();
  contactFormModule.init();
});