document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Typing Effect
    // ============================================
    const typingElement = document.querySelector('.typing-content');
    const cursorElement = document.querySelector('.typing-cursor');
    const wordsAttr = document.querySelector('.typing-text').getAttribute('data-words');
    const words = wordsAttr.split(',');

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 300;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 500);

    // ============================================
    // Bottom Dock — Active Section + Scroll Hide
    // ============================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.dock-link');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollY = 0;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Hide dock on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;

        // Active section highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ============================================
    // Smooth Scroll
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll-Triggered Animations
    // ============================================
    const animateElements = document.querySelectorAll('.anim-flip, .anim-scale-rotate, .anim-slide-up, .animate-left, .animate-right');

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        animateObserver.observe(element);
    });

    // ============================================
    // 3D Icon Tilt Effect
    // ============================================
    document.querySelectorAll('.skill-icon-3d').forEach(icon => {
        icon.addEventListener('mousemove', (e) => {
            const rect = icon.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            icon.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.15)`;
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ============================================
    // Image Error Handling
    // ============================================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            const fallback = img.nextElementSibling;
            if (fallback && (fallback.classList.contains('profile-fallback') ||
                fallback.classList.contains('about-fallback') ||
                fallback.classList.contains('project-placeholder') ||
                fallback.classList.contains('blog-placeholder'))) {
                fallback.style.display = 'flex';
            }
        });
    });

    // ============================================
    // Skills Bar Animation
    // ============================================
    const barFills = document.querySelectorAll('.bar-fill');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute('data-level');
                // Stagger animation
                const delay = Array.from(barFills).indexOf(bar) * 100;
                setTimeout(() => {
                    bar.style.width = level + '%';
                    bar.classList.add('animated');
                }, delay);
                barObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.2
    });

    barFills.forEach(bar => {
        barObserver.observe(bar);
    });

    // ============================================
    // Testimonial Carousel
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % testimonialCards.length;
        showSlide(next);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Start auto-rotation
    startAutoSlide();

    // ============================================
    // Form Validation
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('formSuccess');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, errorId, message) {
        input.classList.add('error');
        input.classList.remove('success');
        document.getElementById(errorId).textContent = message;
    }

    function showSuccess(input, errorId) {
        input.classList.remove('error');
        input.classList.add('success');
        document.getElementById(errorId).textContent = '';
    }

    function validateName() {
        const value = nameInput.value.trim();
        if (!value) {
            showError(nameInput, 'nameError', 'Please enter your name');
            return false;
        }
        if (value.length < 2) {
            showError(nameInput, 'nameError', 'Name must be at least 2 characters');
            return false;
        }
        showSuccess(nameInput, 'nameError');
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (!value) {
            showError(emailInput, 'emailError', 'Please enter your email');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailInput, 'emailError', 'Please enter a valid email address');
            return false;
        }
        showSuccess(emailInput, 'emailError');
        return true;
    }

    function validateSubject() {
        const value = subjectInput.value.trim();
        if (!value) {
            showError(subjectInput, 'subjectError', 'Please enter a subject');
            return false;
        }
        showSuccess(subjectInput, 'subjectError');
        return true;
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        if (!value) {
            showError(messageInput, 'messageError', 'Please enter your message');
            return false;
        }
        if (value.length < 10) {
            showError(messageInput, 'messageError', 'Message must be at least 10 characters');
            return false;
        }
        showSuccess(messageInput, 'messageError');
        return true;
    }

    // Real-time validation on blur
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    subjectInput.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);

    // Clear error on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                input.nextElementSibling.textContent = '';
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Simulate form submission
            formSuccess.classList.add('show');
            contactForm.reset();

            // Remove success classes from inputs
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                input.classList.remove('success');
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
        }
    });

    // ============================================
    // Back to Top Button
    // ============================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // Scroll indicator click
    // ============================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        scrollIndicator.style.cursor = 'pointer';
    }
});
