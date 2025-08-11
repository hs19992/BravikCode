// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupScrollAnimations();
    setupMetricCounters();
    setupServiceCards();
    setupTechnologyTooltips();
    setupContactForm();
    setupIntersectionObserver();
    setupSmoothScrolling();
}

// Navigation Setup
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    });
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function for buttons
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll Animations Setup
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.metric-card, .service-card, .tech-item, .review-card, .contact-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Metric Counters Setup
function setupMetricCounters() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    let countersStarted = false;

    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;

        metricNumbers.forEach(numberElement => {
            const target = parseInt(numberElement.dataset.target);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    numberElement.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    numberElement.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    };

    // Start counters when metrics section is visible
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(metricsSection);
    }
}

// Service Cards Interaction
function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const details = card.querySelector('.service-details');
        
        // Initially hide details
        details.style.maxHeight = '0';
        details.style.opacity = '0';
        details.style.overflow = 'hidden';
        details.style.transition = 'max-height 0.4s ease, opacity 0.4s ease';

        card.addEventListener('mouseenter', () => {
            details.style.maxHeight = '200px';
            details.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            details.style.maxHeight = '0';
            details.style.opacity = '0';
        });

        // Click interaction for mobile
        card.addEventListener('click', () => {
            const isExpanded = details.style.maxHeight !== '0px';
            
            // Close all other cards
            serviceCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherDetails = otherCard.querySelector('.service-details');
                    otherDetails.style.maxHeight = '0';
                    otherDetails.style.opacity = '0';
                }
            });

            // Toggle current card
            if (isExpanded) {
                details.style.maxHeight = '0';
                details.style.opacity = '0';
            } else {
                details.style.maxHeight = '200px';
                details.style.opacity = '1';
            }
        });
    });
}

// Technology Tooltips Setup
function setupTechnologyTooltips() {
    const techItems = document.querySelectorAll('.tech-item');
    const tooltip = document.getElementById('tooltip');

    if (!tooltip) return;

    techItems.forEach(item => {
        const tooltipText = item.dataset.tooltip;

        item.addEventListener('mouseenter', (e) => {
            if (!tooltipText) return;
            
            tooltip.textContent = tooltipText;
            tooltip.style.opacity = '1';
            updateTooltipPosition(e);
        });

        item.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });

        item.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    function updateTooltipPosition(e) {
        const tooltipRect = tooltip.getBoundingClientRect();
        let x = e.pageX + 10;
        let y = e.pageY - 10;

        // Prevent tooltip from going off screen
        if (x + tooltipRect.width > window.innerWidth) {
            x = e.pageX - tooltipRect.width - 10;
        }
        
        if (y - tooltipRect.height < 0) {
            y = e.pageY + 20;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
}

// Contact Form Setup
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.submit-button');
    const originalButtonText = submitButton.innerHTML;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span><div class="button-ripple"></div>';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Show success message
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }, 2000);
    });

    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        if (!name) {
            showNotification('Please enter your name.', 'error');
            return false;
        }

        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        if (!service) {
            showNotification('Please select a service.', 'error');
            return false;
        }

        if (!message) {
            showNotification('Please enter your message.', 'error');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff, #7b68ee)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ff4757, #ff6b7a)' : 
                     'linear-gradient(135deg, #00d4ff, #7b68ee)'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    // Style the close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Close functionality
    const closeNotification = () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };

    closeButton.addEventListener('click', closeNotification);

    // Auto close after 5 seconds
    setTimeout(closeNotification, 5000);
}

// Intersection Observer for general animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const optimizedScrollHandler = throttle(() => {
    // Handle scroll events efficiently
    const scrollY = window.scrollY;
    
    // Update navbar background
    const navbar = document.querySelector('.navbar');
    if (scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
    
    // Parallax effect for hero particles (if needed)
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles && scrollY < window.innerHeight) {
        heroParticles.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Resize handler for responsive adjustments
const optimizedResizeHandler = debounce(() => {
    // Handle window resize events
    const viewportWidth = window.innerWidth;
    
    // Close mobile menu on resize to desktop
    if (viewportWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Recalculate tooltip positions
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Focus management for modal-like components
    if (e.key === 'Tab') {
        // Handle tab navigation if needed
    }
});

// Error handling for images and resources
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        // Handle image load errors
        console.warn('Image failed to load:', e.target.src);
        // Could set a fallback image here
    }
}, true);

// Console welcome message
console.log(`
🚀 TechFlow Agency Website
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with vanilla JavaScript, CSS3, and HTML5
Performance optimized and fully responsive
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        showNotification,
        debounce,
        throttle
    };
}