document.addEventListener('DOMContentLoaded', () => {
    // Navigation logic
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active classes
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active classes
            link.classList.add('active');
            document.getElementById(link.dataset.section).classList.add('active');
        });
    });
});
