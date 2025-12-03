// Elastic Scroll Effect with Bounce
// Provides smooth, elastic scrolling with bounce effects when reaching scroll boundaries

class ElasticScroll {
  constructor() {
    this.scrollContainers = new Set();
    this.debounceTimeout = null;
    this.lastScrollTime = 0;
    this.scrollVelocity = 0;
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupElasticScroll());
    } else {
      this.setupElasticScroll();
    }
  }

  setupElasticScroll() {
    // Only add elastic scroll to body and document if they're not header/sidebar elements
    if (!this.shouldExcludeFromBounce(document.body)) {
      this.addElasticScrollToContainer(document.body);
    }
    if (!this.shouldExcludeFromBounce(document.documentElement)) {
      this.addElasticScrollToContainer(document.documentElement);
    }
    
    // Apply to common scrollable selectors (with strict filtering)
    const scrollableSelectors = [
      'main',              // Only main content areas
      '.modal-content',
      '.dialog-content',
      '.content-area',
      '.ticket-list',
      '.table-container',
      '.overflow-y-auto:not(header):not(nav):not(aside):not(.header):not(.sidebar)',
      '.overflow-auto:not(header):not(nav):not(aside):not(.header):not(.sidebar)', 
      '.overflow-x-auto:not(header):not(nav):not(aside):not(.header):not(.sidebar)',
      '[style*="overflow: auto"]:not(header):not(nav):not(aside):not(.header):not(.sidebar)',
      '[style*="overflow-y: auto"]:not(header):not(nav):not(aside):not(.header):not(.sidebar)',
      '[style*="max-height"]:not(header):not(nav):not(aside):not(.header):not(.sidebar)'
    ];
    
    scrollableSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Triple check: selector filtering + shouldExcludeFromBounce + manual tag check
          if (!this.shouldExcludeFromBounce(el) && 
              !['HEADER', 'NAV', 'ASIDE'].includes(el.tagName?.toUpperCase()) &&
              !el.closest('header, nav, aside, .header, .sidebar')) {
            this.addElasticScrollToContainer(el);
          }
        });
      } catch (e) {
        // Skip invalid selectors
        console.warn('Invalid selector:', selector);
      }
    });
    
    // Clean up any existing elastic scroll on header/sidebar elements
    this.cleanupNavigationElements();
    
    // Watch for new scrollable elements
    this.observeScrollableElements();
    
    // Handle window scroll
    this.setupWindowScroll();
    
    // Apply visual enhancements
    this.enhanceScrollIndicators();
    
    console.log('🎯 Elastic scroll system initialized with enhanced bounce effects');
  }

  enhanceScrollIndicators() {
    // Add scroll indicators to show scrollable areas
    const style = document.createElement('style');
    style.textContent = `
      .elastic-scroll-enhanced {
        position: relative;
      }
      
      .elastic-scroll-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 1000;
      }
      
      .elastic-scroll-enhanced.scrolling::before {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  addElasticScrollToContainer(element) {
    if (!element || this.scrollContainers.has(element)) return;
    
    // Triple check: absolutely do not add elastic scroll to header/sidebar elements
    if (this.shouldExcludeFromBounce(element)) return;
    if (['HEADER', 'NAV', 'ASIDE'].includes(element.tagName?.toUpperCase())) return;
    if (element.closest('header, nav, aside, .header, .sidebar')) return;
    
    this.scrollContainers.add(element);
    element.classList.add('elastic-scroll');
    
    let lastScrollTop = element.scrollTop;
    let scrollDirection = 'down';
    let isAtTop = false;
    let isAtBottom = false;
    
    const handleScroll = (e) => {
      const currentTime = Date.now();
      const timeDelta = currentTime - this.lastScrollTime;
      
      if (timeDelta > 0) {
        this.scrollVelocity = Math.abs(element.scrollTop - lastScrollTop) / timeDelta;
      }
      
      scrollDirection = element.scrollTop > lastScrollTop ? 'down' : 'up';
      lastScrollTop = element.scrollTop;
      this.lastScrollTime = currentTime;
      
      this.isScrolling = true;
      
      // Check scroll boundaries
      isAtTop = element.scrollTop <= 0;
      isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
      
      // Add momentum effect
      if (this.scrollVelocity > 0.5) {
        element.classList.add('momentum-scroll');
        setTimeout(() => {
          element.classList.remove('momentum-scroll');
        }, 600);
      }
      
      // Handle bounce effects
      if (isAtTop && scrollDirection === 'up') {
        this.triggerBounceEffect(element, 'top');
      } else if (isAtBottom && scrollDirection === 'down') {
        this.triggerBounceEffect(element, 'bottom');
      }
      
      // Debounced scroll end detection
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.scrollVelocity = 0;
      }, 150);
    };
    
    element.addEventListener('scroll', handleScroll, { passive: true });
    
    // Touch handling for mobile elastic scroll
    this.setupTouchScroll(element);
  }

  triggerBounceEffect(element, direction) {
    // Check if element should be excluded from bounce effects
    if (this.shouldExcludeFromBounce(element)) {
      return; // Skip bounce effect for headers/sidebars
    }
    
    // Remove existing bounce classes
    element.classList.remove('bounce-scroll', 'bounce-scroll-top', 'momentum-scroll');
    
    // Add visual enhancement class
    element.classList.add('elastic-scroll-enhanced');
    
    // Add appropriate bounce effect with enhanced feedback
    if (direction === 'bottom') {
      element.classList.add('bounce-scroll');
      
      // Create visual feedback for bottom bounce
      this.createBounceRipple(element, 'bottom');
      
      setTimeout(() => {
        element.classList.remove('bounce-scroll');
      }, 400);
    } else if (direction === 'top') {
      element.classList.add('bounce-scroll-top');
      
      // Create visual feedback for top bounce
      this.createBounceRipple(element, 'top');
      
      setTimeout(() => {
        element.classList.remove('bounce-scroll-top');
      }, 400);
    }
    
    // Enhanced haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short, subtle vibration
    }
  }

  createBounceRipple(element, direction) {
    const ripple = document.createElement('div');
    ripple.className = `bounce-ripple bounce-ripple-${direction}`;
    ripple.style.cssText = `
      position: absolute;
      ${direction}: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
      border-radius: 2px;
      pointer-events: none;
      z-index: 1001;
      animation: bounceRipple 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.querySelector('#bounce-ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'bounce-ripple-styles';
      style.textContent = `
        @keyframes bounceRipple {
          0% { 
            opacity: 0;
            transform: translateX(-50%) scaleX(0.3);
          }
          50% { 
            opacity: 1;
            transform: translateX(-50%) scaleX(1.2);
          }
          100% { 
            opacity: 0;
            transform: translateX(-50%) scaleX(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 400);
  }

  setupTouchScroll(element) {
    let startY = 0;
    let currentY = 0;
    let isTouch = false;
    
    element.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isTouch = true;
    }, { passive: true });
    
    element.addEventListener('touchmove', (e) => {
      if (!isTouch) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      
      // Enhanced touch scrolling feel
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      // Elastic effect at boundaries
      if ((scrollTop <= 0 && deltaY < 0) || 
          (scrollTop + clientHeight >= scrollHeight && deltaY > 0)) {
        // Apply resistance at boundaries
        const resistance = Math.abs(deltaY) * 0.3;
        element.style.transform = `translateY(${deltaY > 0 ? -resistance : resistance}px)`;
      }
    }, { passive: true });
    
    element.addEventListener('touchend', () => {
      isTouch = false;
      // Reset transform
      element.style.transform = '';
    }, { passive: true });
  }

  setupWindowScroll() {
    let ticking = false;
    
    const handleWindowScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Check if at top or bottom
          const isAtTop = scrollTop <= 0;
          const isAtBottom = scrollTop + windowHeight >= documentHeight - 1;
          
          if (isAtBottom) {
            this.triggerBounceEffect(document.body, 'bottom');
          } else if (isAtTop) {
            this.triggerBounceEffect(document.body, 'top');
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
  }

  observeScrollableElements() {
    // Mutation observer to catch dynamically added scrollable elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for scrollable elements
            const scrollableElements = node.querySelectorAll && node.querySelectorAll(
              '.overflow-y-auto, .overflow-auto, [style*="overflow-y: auto"], [style*="overflow: auto"]'
            );
            
            if (scrollableElements) {
              scrollableElements.forEach(el => this.addElasticScrollToContainer(el));
            }
            
            // Check if the node itself is scrollable
            if (this.isScrollable(node)) {
              this.addElasticScrollToContainer(node);
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  isScrollable(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    const overflowY = style.getPropertyValue('overflow-y');
    const overflowX = style.getPropertyValue('overflow-x');
    const overflow = style.getPropertyValue('overflow');
    
    return (
      overflowY === 'auto' || overflowY === 'scroll' ||
      overflowX === 'auto' || overflowX === 'scroll' ||
      overflow === 'auto' || overflow === 'scroll' ||
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }

  // Check if element should be excluded from bounce effects
  shouldExcludeFromBounce(element) {
    if (!element) return true;
    
    // Comprehensive list of selectors/tags that should not have bounce effects
    const excludeSelectors = [
      'header',
      'nav',
      'aside',
      '.header',
      '.navbar',
      '.sidebar',
      '.side-menu',
      '.navigation',
      '.fixed',
      '.sticky',
      '.bg-white',  // Common header/sidebar background
      '.shadow-sm', // Common header/sidebar styling
      '.border-b',  // Header bottom border
      '.border-r',  // Sidebar right border
      '.min-h-screen' // Sidebar full height
    ];
    
    // Check element tag name first (most reliable)
    if (element.tagName) {
      const tagName = element.tagName.toUpperCase();
      if (['HEADER', 'NAV', 'ASIDE'].includes(tagName)) {
        return true;
      }
    }
    
    // Check if element matches any exclude selector
    for (const selector of excludeSelectors) {
      if (selector.startsWith('.')) {
        // Class selector
        if (element.classList.contains(selector.substring(1))) {
          return true;
        }
      } else {
        // Tag selector
        if (element.tagName && element.tagName.toLowerCase() === selector) {
          return true;
        }
      }
    }
    
    // Check for common header/sidebar class combinations
    const classList = Array.from(element.classList);
    const headerSidebarPatterns = [
      ['bg-white', 'shadow-sm'],
      ['bg-white', 'border-b'],
      ['bg-white', 'border-r'],
      ['w-64', 'bg-white'], // Sidebar width + background
      ['flex', 'items-center', 'justify-between'], // Header layout
      ['min-h-screen', 'bg-white'] // Sidebar height + background
    ];
    
    for (const pattern of headerSidebarPatterns) {
      if (pattern.every(cls => classList.includes(cls))) {
        return true;
      }
    }
    
    // Check if element has data attributes indicating it's a header/nav
    const dataComponent = element.getAttribute('data-component');
    if (dataComponent && ['header', 'sidebar', 'navigation', 'navbar'].includes(dataComponent)) {
      return true;
    }
    
    // Check if element is inside a header, nav, or sidebar (traverse up DOM tree)
    let parent = element.parentElement;
    let depth = 0;
    while (parent && depth < 10) { // Limit depth to avoid infinite loops
      if (parent.tagName && ['HEADER', 'NAV', 'ASIDE'].includes(parent.tagName.toUpperCase())) {
        return true;
      }
      if (parent.classList.contains('header') || 
          parent.classList.contains('sidebar') || 
          parent.classList.contains('navbar') ||
          parent.classList.contains('navigation')) {
        return true;
      }
      parent = parent.parentElement;
      depth++;
    }
    
    return false;
  }

  // Public method to manually add elastic scroll to an element
  addElasticScroll(selector) {
    const elements = typeof selector === 'string' 
      ? document.querySelectorAll(selector)
      : [selector];
    
    elements.forEach(el => {
      if (el) this.addElasticScrollToContainer(el);
    });
  }

  // Public method to remove elastic scroll
  removeElasticScroll(selector) {
    const elements = typeof selector === 'string' 
      ? document.querySelectorAll(selector)
      : [selector];
    
    elements.forEach(el => {
      if (el && this.scrollContainers.has(el)) {
        el.classList.remove('elastic-scroll', 'bounce-scroll', 'bounce-scroll-top', 'momentum-scroll');
        this.scrollContainers.delete(el);
      }
    });
  }

  // Clean up any elastic scroll effects from navigation elements
  cleanupNavigationElements() {
    const navigationSelectors = [
      'header',
      'nav', 
      'aside',
      '.header',
      '.navbar',
      '.sidebar',
      '.side-menu',
      '.navigation'
    ];
    
    navigationSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Remove all elastic scroll related classes
          el.classList.remove('elastic-scroll', 'bounce-scroll', 'bounce-scroll-top', 'momentum-scroll');
          
          // Remove from tracking
          if (this.scrollContainers.has(el)) {
            this.scrollContainers.delete(el);
          }
          
          // Also clean up any children that might have these classes
          const children = el.querySelectorAll('.elastic-scroll, .bounce-scroll, .bounce-scroll-top, .momentum-scroll');
          children.forEach(child => {
            child.classList.remove('elastic-scroll', 'bounce-scroll', 'bounce-scroll-top', 'momentum-scroll');
            if (this.scrollContainers.has(child)) {
              this.scrollContainers.delete(child);
            }
          });
        });
      } catch (e) {
        console.warn('Error cleaning up navigation element:', selector, e);
      }
    });
  }
}

// Initialize the elastic scroll system
const elasticScrollSystem = new ElasticScroll();

// Export for manual use
window.ElasticScroll = elasticScrollSystem;

export default elasticScrollSystem;
