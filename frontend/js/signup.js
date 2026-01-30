// developed by Alireza-Hashamdar

const form = document.querySelector('form');
const username = form.querySelector('input[name="username"]');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const submitBtn = form.querySelector('button[type="submit"]');

function mapError(code) {
  if (!code) return `خطا: نامشخص`;
  if (code === 'UserAlreadyExists') return 'کاربر از قبل وجود دارد.';
  if (code === 'invalidInput') return 'لطفا ورودی‌ها را بررسی کنید.';
  if (code === 'serverError') return 'خطای سرور. بعداً تلاش کنید.';
  return code;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (submitBtn) submitBtn.disabled = true;


  if (password.value !== confirmPassword.value) {
    showError('رمزها یکسان نیستند');
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  const body = {
    username: username.value.trim(),
    password: password.value,
    confirmPassword: confirmPassword.value
  };

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });

    let data = null;
    try { data = await res.json(); } catch (err) {
      try { const text = await res.text(); console.log('signup response text:', text); } catch (tErr) { }
    }

    if (res.ok && data && data.success) {
      try { localStorage.setItem('username', data.username); } catch (e) { }
      showSuccess('ثبت‌نام با موفقیت انجام شد');
      setTimeout(function () { location.href = '/'; }, 600);
      return;
    }

    const msg = mapError(data && data.error);
    showError(msg);

  } catch (err) {
    showError('خطا در شبکه. دوباره تلاش کنید.');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});
