// scripts/shared.js

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}



// Future shared functionality will go here
// (Example: Navbar highlight, user login checks, etc.)
// Mobile nav toggle
const navToggle    = document.getElementById('navToggle');
const mobileMenu   = document.getElementById('mobileMenu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}
