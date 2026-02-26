
  function ensureContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&"'<>]/g, (s) => ({
      '&': '&amp;', '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;'
    })[s]);
  }

  function showNotification(message, type = 'info', duration = 3000) {
    const container = ensureContainer();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span class="message">${escapeHTML(message)}</span> <button class="close-btn" aria-label="close">&times;</button>`;

    const remove = () => {
      if (!notification.parentNode) return;
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(30px)';
      setTimeout(() => notification.remove(), 300);
    };

    let removeTimeout = setTimeout(remove, duration);


    notification.addEventListener('mouseenter', () => {
      clearTimeout(removeTimeout);
    });
    notification.addEventListener('mouseleave', () => {
      removeTimeout = setTimeout(remove, 1500);
    });

    // Close button
    notification.querySelector('.close-btn').addEventListener('click', remove);

    container.appendChild(notification);

    return notification;
  }

  function showSuccess(message, duration = 3000) { return showNotification(message, 'success', duration); }
  function showError(message, duration = 4000) { return showNotification(message, 'error', duration); }
  function showInfo(message, duration = 3000) { return showNotification(message, 'info', duration); }


  window.showNotification = showNotification;
  window.showSuccess = showSuccess;
  window.showError = showError;
  window.showInfo = showInfo;


  (function showFlashFromQuery() {
    try {
      const params = new URLSearchParams(window.location.search);

      
      const map = {
        'UserAlreadyExists': 'User already exists',
        'UserRegistered': 'Your account was created',
        'invalidInput': 'Please check your input',
        'invalidCredentials': 'Invalid username or password',
        'serverError': 'Server error, please try again later'
      };

      const prettify = (raw) => {
        if (!raw) return '';
        let s = decodeURIComponent(raw);
        s = s.replace(/\+/g, ' ').replace(/_/g, ' ');
        s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
        return s;
      };

      let handled = false;

      if (params.has('error')) {
        const raw = params.get('error');
        const key = raw ? raw : '';
        const msg = map[key] || prettify(key) || 'Error';
        showError(msg);
        params.delete('error');
        handled = true;
      }

      if (params.has('success')) {
        const raw = params.get('success');
        const key = raw ? raw : '';
        const msg = map[key] || prettify(key) || 'Success';
        showSuccess(msg);
        params.delete('success');
        handled = true;
      }


      if (handled) {
        const url = new URL(window.location);

        url.search = params.toString();
        window.history.replaceState({}, '', url.toString());
      }
    } catch (err) {
      console.log(err);
    }
  })();
