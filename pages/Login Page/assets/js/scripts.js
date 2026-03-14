function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.getElementById('toggleIcon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.textContent = 'visibility';
  } else {
    passwordInput.type = 'password';
    toggleIcon.textContent = 'visibility_off';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const accountContainer = document.querySelector('.account-dropdown-container');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (accountContainer) {
    accountContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
      accountContainer.classList.toggle('show-logout');

      let expanded = accountContainer.getAttribute('aria-expanded') === 'true';
      accountContainer.setAttribute('aria-expanded', !expanded);
    });

    document.addEventListener('click', (e) => {
      if (!accountContainer.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        accountContainer.classList.remove('show-logout');
        accountContainer.setAttribute('aria-expanded', false);
      }
    });

    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  const loginBtn = document.getElementById('loginBtn');
  const navLoginLink = document.getElementById('navLoginLink');

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }

      alert('Login successful! (demo)');
    });
  }

  if (navLoginLink) {
    navLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Already on Login page');
    });
  }
});