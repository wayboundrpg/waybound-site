// scripts/shared.js

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// Future shared functionality will go here
// (Example: Navbar highlight, user login checks, etc.)
