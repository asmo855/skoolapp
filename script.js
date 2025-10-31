// Popup Advertisement System with User Control
class AdPopupManager {
    constructor() {
        this.POPUP_COOLDOWN = 60 * 60 * 1000; // 60 minutes in milliseconds
        this.POPUP_DELAY = 2000; // 2 seconds delay after page load
        this.AUTO_CLOSE_DELAY = 3000; // 3 seconds auto-close
        this.STORAGE_KEYS = {
            lastShown: 'adPopup_lastShown',
            enabled: 'adPopup_enabled'
        };
        
        this.popup = document.getElementById('adPopup');
        this.closeBtn = document.getElementById('closeAdPopup');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.popupToggle = document.getElementById('popupToggle');
        
        this.init();
    }
    
    init() {
        // Initialize popup enabled state
        const isEnabled = this.getPopupEnabled();
        this.popupToggle.checked = isEnabled;
        
        // Set up event listeners
        this.closeBtn.addEventListener('click', () => this.closePopup());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        this.popupToggle.addEventListener('change', (e) => this.togglePopup(e.target.checked));
        
        // Close modal when clicking outside
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
        
        // Close popup when clicking outside
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup();
            }
        });
        
        // Show popup if conditions are met
        if (isEnabled && this.canShowPopup()) {
            setTimeout(() => {
                this.showPopup();
            }, this.POPUP_DELAY);
        }
    }
    
    getPopupEnabled() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.enabled);
        return stored === null ? true : stored === 'true';
    }
    
    setPopupEnabled(enabled) {
        localStorage.setItem(this.STORAGE_KEYS.enabled, enabled.toString());
    }
    
    getLastShownTime() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.lastShown);
        return stored ? parseInt(stored, 10) : 0;
    }
    
    setLastShownTime(time) {
        localStorage.setItem(this.STORAGE_KEYS.lastShown, time.toString());
    }
    
    canShowPopup() {
        const now = Date.now();
        const lastShown = this.getLastShownTime();
        const timeSinceLastShown = now - lastShown;
        
        return timeSinceLastShown >= this.POPUP_COOLDOWN;
    }
    
    showPopup() {
        this.popup.classList.add('active');
        this.setLastShownTime(Date.now());
        
        // Auto-close after delay
        this.autoCloseTimeout = setTimeout(() => {
            this.closePopup();
        }, this.AUTO_CLOSE_DELAY);
    }
    
    closePopup() {
        this.popup.classList.remove('active');
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
        }
    }
    
    openSettings() {
        this.settingsModal.classList.add('active');
    }
    
    closeSettingsModal() {
        this.settingsModal.classList.remove('active');
    }
    
    togglePopup(enabled) {
        this.setPopupEnabled(enabled);
        
        // Show feedback
        const feedback = enabled ? 'Popup ads enabled' : 'Popup ads disabled';
        this.showToast(feedback);
    }
    
    showToast(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 3000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        this.links = document.querySelectorAll('.mobile-nav-link');
        
        this.init();
    }
    
    init() {
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }
    
    toggleMenu() {
        this.menu.classList.toggle('active');
        
        // Animate hamburger
        const spans = this.menuBtn.querySelectorAll('span');
        if (this.menu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    closeMenu() {
        this.menu.classList.remove('active');
        const spans = this.menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
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

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        // Observe elements
        const animateElements = document.querySelectorAll('.month-card, .module-card, .stat-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number, .summary-value');
        this.init();
    }
    
    init() {
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, options);
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/\$?([\d,]+\.?\d*)/);
        
        if (!match) return;
        
        const target = parseFloat(match[1].replace(/,/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                const formatted = this.formatNumber(current);
                element.textContent = text.replace(match[0], formatted);
                requestAnimationFrame(updateCounter);
            } else {
                const formatted = this.formatNumber(target);
                element.textContent = text.replace(match[0], formatted);
            }
        };
        
        updateCounter();
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return '$' + num.toFixed(2);
    }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ad popup manager
    new AdPopupManager();
    
    // Initialize mobile menu
    new MobileMenu();
    
    // Initialize smooth scrolling
    new SmoothScroll();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize counter animations
    new CounterAnimation();
    
    // Add fade-out animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(10px);
            }
        }
    `;
    document.head.appendChild(style);
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const settingsModal = document.getElementById('settingsModal');
        const adPopup = document.getElementById('adPopup');
        
        if (settingsModal.classList.contains('active')) {
            settingsModal.classList.remove('active');
        }
        
        if (adPopup.classList.contains('active')) {
            adPopup.classList.remove('active');
        }
    }
});
