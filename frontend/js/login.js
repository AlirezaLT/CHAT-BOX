// developed by Alireza-Hashamdar

const form = document.querySelector('form');
if (form) {
  const username = form.querySelector('input[name="username"]');
  const password = form.querySelector('input[name="password"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  function mapError(code) {
    if (!code) return 'نام کاربری یا رمز عبور اشتباه است';
    if (code === 'invalidCredentials') return 'نام کاربری یا رمز عبور اشتباه است';
    if (code === 'invalidInput') return 'ورودی نامعتبر است';
    if (code === 'serverError') return 'خطای سرور. بعداً تلاش کنید';
    return code;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;

    const body = { username: username.value.trim(), password: password.value };

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });

      let data = await res.json(); 

      if (res.ok && data && data.success) {
        try { localStorage.setItem('token', data.token); } catch (e) { }
        showSuccess('ورود با موفقیت انجام شد');
        setTimeout(function () { location.href = '/'; }, 500);
        return;
      }

      const msg = mapError(data && data.error);
      showError(msg);

    } catch (err) {
      showError('internal error .try again');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}