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

function showSuccessMessage(message, redirectUrl) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <span class="material-icons">check_circle</span>
    <span class="message-text">${message}</span>
  `;

  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.style.transition = 'opacity 0.3s ease';
    successDiv.style.opacity = '0';

    setTimeout(() => {
      successDiv.remove();
      window.location.href = redirectUrl;
    }, 300);
  }, 1500);
}

document.addEventListener('DOMContentLoaded', function () {
  const registerBtn = document.getElementById('registerBtn');
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');

  registerBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    if (!name || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('../../api/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          password,
          confirmPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        showSuccessMessage('You registered successfully!', '../Login Page/index.html');
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }
  });
});