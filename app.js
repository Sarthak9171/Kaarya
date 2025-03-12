document.addEventListener('DOMContentLoaded', () => {
    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.material-icons-round');
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? 'light_mode' : 'dark_mode';
    }

    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Navigation handling
    const navLinksAll = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinksAll.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinksAll.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            link.classList.add('active');
            const sectionId = link.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');

            // Close mobile menu after clicking a link
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });
});
