// Dark Mode Toggle
document.getElementById('themeToggle').onclick = () =>
  document.documentElement.classList.toggle('dark');

// Mobile Nav Toggle
document.getElementById('navToggle').onclick = () =>
  document.getElementById('mobileMenu').classList.toggle('hidden');
