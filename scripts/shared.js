// scripts/shared.js

// Dark Mode Toggle (with icon swap)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // 1) flip the <html> dark class
    document.documentElement.classList.toggle('dark');

    // 2) swap the icon text between moon and sun
    //    (we assume themeToggle.textContent is either '🌙' or '☀️')
    if (themeToggle.textContent.trim() === '🌙') {
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }
  });
}

// Mobile nav toggle
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}
