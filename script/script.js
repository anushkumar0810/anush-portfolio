/* ==========================================================================
   DOM Elements
   ========================================================================== */

const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navbar = document.getElementById('navbar');
const currentYearSpan = document.getElementById('year');

/* ==========================================================================
   Theme Toggle Logic
   ========================================================================== */

// Check local storage for theme
const savedTheme = localStorage.getItem('portfolio-theme');

// Apply saved theme or default to dark
if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('bx-sun', 'bx-moon');
} else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('bx-moon', 'bx-sun');
}

// Theme Button Click
themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('portfolio-theme', 'light');
        themeIcon.classList.replace('bx-sun', 'bx-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio-theme', 'dark');
        themeIcon.classList.replace('bx-moon', 'bx-sun');
    }
});

/* ==========================================================================
   Mobile Menu Logic
   ========================================================================== */

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scrolling
});

// Close mobile menu when a link is clicked
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

/* ==========================================================================
   Navbar Scroll Effect
   ========================================================================== */

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link Highlight
    highlightNavLinks();
});

// Highlight navigation links on scroll
function highlightNavLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Optional: Stop observing once revealed
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Observe all elements with reveal classes
document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2').forEach(element => {
    observer.observe(element);

    // Calculate delay for staggered animations
    if (element.classList.contains('reveal-delay')) {
        element.style.transitionDelay = '0.2s';
    } else if (element.classList.contains('reveal-delay-2')) {
        element.style.transitionDelay = '0.4s';
    }
});

/* ==========================================================================
   Footer Year
   ========================================================================== */

if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Initial trigger for scroll animations visible on load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal, .hero .reveal-delay').forEach(element => {
            element.classList.add('active');
        });
    }, 100);
});
