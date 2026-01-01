// Usage examples:
// showError('Passwords do not match');
// showSuccess('Account created successfully');

const form = document.querySelector('form');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');

form.addEventListener('submit', (e) => {
  if (passwordInput.value !== confirmInput.value) {
    e.preventDefault();
    showNotification('Passwords do not match', 'error');
  }
});
