    // main.js

    // Tarih ve saat güncelleme
    window.addEventListener('DOMContentLoaded', () => {
      const dateDiv = document.getElementById('date-div');
      function updateClock() {
        const now = new Date();
        dateDiv.textContent = now.toLocaleString('tr-TR', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
      }
      updateClock(); setInterval(updateClock, 1000);
    });
    
    // Bootstrap modal için gerekli kod
    window.addEventListener('DOMContentLoaded', () => {
      // Sayfa açıldığında modalı göster
      const loginModal = new bootstrap.Modal(
        document.getElementById('loginModal')
      );
      loginModal.show();

      // Lokal sabit şifre
      const CORRECT_PASSWORD = 'admin';

      // Şifre giriş butonuna tıklama olayını dinle
      document.getElementById('loginBtn')
        .addEventListener('click', () => {
          const pw = document.getElementById('inputPassword').value;
          const errorEl = document.getElementById('loginError');

          if (pw === CORRECT_PASSWORD) {
            // password doğruysa, paneli gizle
            loginModal.hide();
          } else {
            // hatalı şifre girildiyse, hata mesajını göster
            errorEl.style.display = 'block';
          }
        });
    });

    // şifre görünürlüğünü değiştirme
    const passwordInput = document.getElementById('inputPassword');
    const toggleBtn     = document.getElementById('togglePassword');
    toggleBtn.addEventListener('click', () => {
      const isPwd = passwordInput.type === 'password';
      passwordInput.type = isPwd ? 'text' : 'password';
      const icon = toggleBtn.querySelector('i');
      icon.classList.toggle('bi-eye');
      icon.classList.toggle('bi-eye-slash');
    });