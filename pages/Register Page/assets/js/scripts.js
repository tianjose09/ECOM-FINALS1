function togglePassword(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const toggleIcon = document.getElementById(iconId);

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.textContent = 'visibility';
  } else {
    passwordInput.type = 'password';
    toggleIcon.textContent = 'visibility_off';
  }
}

function showPopupMessage(message, type = 'success', redirectUrl = null) {
  const popup = document.createElement('div');
  popup.className = `custom-popup ${type}`;

  const icon = type === 'success' ? 'check_circle' : 'error';

  popup.innerHTML = `
    <span class="material-icons popup-icon">${icon}</span>
    <span class="popup-text">${message}</span>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.remove();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 300);
  }, 1500);
}

async function getSessionUser() {
  try {
    const response = await fetch('../../api/auth/me.php', {
      credentials: 'same-origin'
    });
    return await response.json();
  } catch (error) {
    return { success: false, loggedIn: false };
  }
}

function setupDropdown(sessionData) {
  const accountContainer = document.getElementById('accountDropdown');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (!accountContainer || !dropdownMenu) return;

  if (sessionData.loggedIn) {
    dropdownMenu.innerHTML = `
      <a href="#">${sessionData.user.name}</a>
      <a href="#" id="logoutLink">Logout</a>
    `;
  } else {
    dropdownMenu.innerHTML = `
      <a href="../Login Page/index.html">Login</a>
      <a href="../Register Page/index.html">Register</a>
    `;
  }

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

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', async function (e) {
      e.preventDefault();

      const response = await fetch('../../api/auth/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
      });

      const data = await response.json();

      if (data.success) {
        showPopupMessage('Logged out successfully!', 'success', '../../index.html');
      } else {
        showPopupMessage(data.message || 'Logout failed.', 'error');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const sessionData = await getSessionUser();
  setupDropdown(sessionData);

  if (sessionData.loggedIn) {
    if (sessionData.user.role === 'admin') {
      window.location.href = '../../pages/Admin Dashboard/index.html';
    } else {
      window.location.href = '../../index.html';
    }
    return;
  }

  const registerBtn = document.getElementById('registerBtn');
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');

  if (registerBtn) {
    registerBtn.addEventListener('click', async function (e) {
      e.preventDefault();

      const name = nameInput.value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmInput.value.trim();

      if (!name || !password || !confirmPassword) {
        showPopupMessage('Please fill in all fields.', 'error');
        return;
      }

      if (name.length < 3) {
        showPopupMessage('Username must be at least 3 characters long.', 'error');
        return;
      }

      if (!/^[A-Za-z0-9_]+$/.test(name)) {
        showPopupMessage('Username can only contain letters, numbers, and underscore.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showPopupMessage('Passwords do not match.', 'error');
        return;
      }

      if (password.length < 8) {
        showPopupMessage('Password must be at least 8 characters long.', 'error');
        return;
      }

      try {
        const response = await fetch('../../api/auth/register.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            name,
            password,
            confirmPassword
          })
        });

        const data = await response.json();

        if (data.success) {
          showPopupMessage('Registration successful!', 'success', '../Login Page/index.html');
        } else {
          showPopupMessage(data.message || 'Registration failed.', 'error');
        }
      } catch (error) {
        console.error(error);
        showPopupMessage('Registration failed.', 'error');
      }
    });
  }
});