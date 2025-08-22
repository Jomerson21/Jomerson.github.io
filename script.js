// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initStatCounters();
    initContactForm();
    initSmoothScrolling();
    initMobileMenu();
    initTypingEffect();
    initServiceInquiry();
    initProjectRouting();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Update active navigation link on scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[index].classList.add('active');
            }
        });
    }

    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
            setTimeout(() => ticking = false, 100);
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenu = document.getElementById('nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                mobileMenu.classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for project cards
                if (entry.target.classList.contains('project-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, Math.random() * 300);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.about-text, .stat-item, .project-card, .contact-info, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('scroll-animation');
        observer.observe(el);
    });
}

// Animated counters for statistics
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, observerOptions);

    // Observe the stats section
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 200;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                stat.textContent = Math.ceil(current);
                
                // Add percentage symbol for client satisfaction
                if (stat.parentElement.querySelector('.stat-label').textContent.includes('Satisfaction')) {
                    stat.textContent = Math.ceil(current) + '%';
                }
            }, 10);
        });
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageField = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validate form
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create message content
            const messageContent = `Hello! I'm ${name}.\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`;
            
            // Show options for contact
            showContactOptions(name, email, message, messageContent);
            
            // Reset form
            form.reset();
            showNotification('Thank you for your message! Choose your preferred contact method below.', 'success');

        } catch (error) {
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Expose helper to prefill and focus from Services
    window.prefillContactMessage = function(templateText) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const y = contactSection.offsetTop - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        if (messageField) {
            messageField.value = `Hi Jomerson, ${templateText} \n\n  ${name}`;
            messageField.focus();
        }
    }
}

// Show contact options modal
function showContactOptions(name, email, message, messageContent) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Choose Your Preferred Contact Method</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Your message is ready! Choose how you'd like to send it:</p>
                <div class="contact-options">
                    <a href="mailto:Jomersonnazaire@gmail.com?subject=Project Inquiry from ${name}&body=${encodeURIComponent(messageContent)}" class="contact-option">
                        <i class="fas fa-envelope"></i>
                        <span>Email</span>
                    </a>
                    <a href="https://wa.me/639461448138?text=${encodeURIComponent(messageContent)}" target="_blank" class="contact-option">
                        <i class="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </a>
                    <a href="viber://chat?number=+639461448138&text=${encodeURIComponent(messageContent)}" class="contact-option">
                        <i class="fab fa-viber"></i>
                        <span>Viber</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = `
        .contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .contact-modal.show {
            opacity: 1;
        }
        .modal-content {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            border: 1px solid var(--border-color);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        .contact-modal.show .modal-content {
            transform: translateY(0);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1rem;
        }
        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        .close-modal:hover {
            background: var(--hover-bg);
            color: var(--text-primary);
        }
        .modal-body p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        .contact-options {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .contact-option {
            flex: 1;
            min-width: 120px;
            padding: 1rem;
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            text-decoration: none;
            color: var(--text-primary);
            text-align: center;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        .contact-option:hover {
            background: var(--accent-primary);
            border-color: var(--accent-primary);
            transform: translateY(-2px);
        }
        .contact-option i {
            font-size: 1.5rem;
        }
        @media (max-width: 480px) {
            .contact-options {
                flex-direction: column;
            }
            .contact-option {
                flex-direction: row;
                justify-content: center;
            }
        }
    `;

    // Add styles to document
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }

    // Add modal to document
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    }

    // Auto-close after 30 seconds
    setTimeout(closeModal, 30000);
}

// Services → Prefill contact and scroll
function initServiceInquiry() {
    const serviceButtons = document.querySelectorAll('.service-cta');
    const serviceCards = document.querySelectorAll('.service-card');

    function handleInquiry(element) {
        const template = element.getAttribute('data-template');
        if (template && typeof window.prefillContactMessage === 'function') {
            window.prefillContactMessage(template);
        } else {
            // Fallback: scroll to contact without template
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const y = contactSection.offsetTop - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.service-card');
            if (card) handleInquiry(card);
        });
    });

    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Ignore clicks on links (none for now) to avoid conflicts
            if ((e.target && e.target.closest('button'))) return; // button handled above
            handleInquiry(card);
        });
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInquiry(card);
            }
        });
    });
}

// Project detail routing (project.html)
function initProjectRouting() {
    const container = document.getElementById('project-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || '';

    const projects = {
        'csharp-apps': {
            title: 'C# Applications',
            imageSeed: 'csharp',
            summary: 'Production-grade C# solutions including Windows apps, MVC web apps, and Windows Services engineered for reliability and performance.',
            bullets: [
                'Windows desktop apps for streamlined internal operations and data-heavy workflows.',
                'ASP.NET MVC solutions with clean architecture, authentication, and role-based access.',
                'Windows Services for background processing, scheduling, integration, and automation.'
            ],
            tech: ['C#', '.NET Framework', '.NET Core', 'Entity Framework']
        },
        'ph-tax-modules': {
            title: 'Philippine Tax Modules',
            imageSeed: 'tax',
            summary: 'Exclusive in-house product at Xceler8 Technologies Inc. Automates complex PH tax computations and reporting inside SAP Business One.',
            bullets: [
                'Built-in compliance logic for common PH tax scenarios and filings.',
                'Crystal Reports templates with precise document layouts and signatures.',
                'Tight integration with SAP Business One UI/API SDK for seamless workflows.'
            ],
            tech: ['C#', 'SQL', 'Crystal Reports', 'SAP Business One UI/API SDK']
        },
        'integratex': {
            title: 'Integrate X',
            imageSeed: 'integrate',
            summary: 'Create SAP B1 transactions outside the Business One client. Power external workflows with a reliable, secure integration layer.',
            bullets: [
                'API-driven orchestration to generate B1 transactions programmatically.',
                'Resilient error handling, audit logs, and idempotent operations.',
                'Report generation for operational oversight and compliance.'
            ],
            tech: ['C#', 'Entity Framework', 'Crystal Reports', 'SAP Business One UI/API SDK']
        },
        'sap-b1-integration': {
            title: 'Custom SAP Business One Integration',
            imageSeed: 'sap',
            summary: 'Custom middleware and services to produce or sync SAP B1 transactions and data with partner systems using modern APIs.',
            bullets: [
                'Service Layer and DI-API based implementations with strict validation.',
                'Mapping, transformation, and reconciliation pipelines for partner data.',
                'Scalable hosting in Windows services or containers as needed.'
            ],
            tech: ['C#', 'SAP Service Layer', 'JSON']
        }
    };

    const data = projects[slug];
    if (!data) {
        container.innerHTML = '<p>Project not found. <a href="index.html#projects">Back to Projects</a></p>';
        return;
    }

    const techTags = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    const bullets = data.bullets.map(b => `<li>${b}</li>`).join('');
    const coverUrl = `https://picsum.photos/seed/${encodeURIComponent(data.imageSeed)}/1200/500`;

    container.innerHTML = `
        <div class="project-header">
            <h1>${data.title}</h1>
            <p class="project-summary">${data.summary}</p>
            <div class="project-tech">${techTags}</div>
        </div>
        <div class="project-cover" style="background-image:url('${coverUrl}');"></div>
        <div class="project-body">
            <h2>Highlights</h2>
            <ul class="project-highlights">${bullets}</ul>
            <div class="project-cta">
                <a class="btn btn-primary" href="index.html#contact">Discuss a similar project</a>
            </div>
        </div>
    `;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add notification styles if not present
    if (!document.getElementById('notification-styles')) {
        const styles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 350px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
            .notification.success {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            .notification.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            .notification.info {
                background: var(--accent-gradient);
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);

    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Resume button functionality
function initTypingEffect() {
    const resumeBtn = document.getElementById('resume-btn');
    
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Resume download would be available here. Please contact me directly for my latest resume.', 'info');
    });
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Parallax effect for home section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const homeSection = document.querySelector('.home-section');
    const profileCircle = document.querySelector('.profile-circle');
    
    if (homeSection && profileCircle) {
        const rate = scrolled * -0.5;
        profileCircle.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
    }
});

// Lazy loading for better performance
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-src]');
    
    const lazyLoad = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.src = element.dataset.src;
                element.classList.remove('lazy');
                observer.unobserve(element);
            }
        });
    };

    const observer = new IntersectionObserver(lazyLoad, {
        rootMargin: '100px'
    });

    lazyElements.forEach(element => observer.observe(element));
}

// Initialize lazy loading
initLazyLoading();

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.classList.add('loading');
});

// Performance optimization - debounce scroll events
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll events here
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

console.log('Portfolio website initialized successfully! 🚀');
