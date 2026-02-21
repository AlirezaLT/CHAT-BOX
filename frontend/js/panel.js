const form = document.querySelector('form');
const submitBtn = form.querySelector('button[type="submit"]');
const header = document.getElementById('header')
const userInput = form.querySelector('#userInput');
const showDate = document.getElementById('showDate');



async function fetchName() {
  
    const res = await fetch('/user/api/fetch/username', {
      method:"GET",
      headers: { 'Content-Type': 'application/json' },
    });
    if(!res.ok){
      showError('SERVER ERROR')
    }
    
    return res.json();
  
  
}
async function showName() {
  try{  
  const data = await fetchName()
    if(data.success){
      header.innerHTML = `HI ${data.data} ❤️`
    }

  } catch (error) {
    console.log(error)
   }
}

async function fetchDate() {
  try {
    const res = await fetch('/user/api/fetch/date', {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      showDate.innerText = data.data;
    }
  } catch (error) {
    console.log(error);
  }
}

showName();
fetchDate();


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const newUsername = userInput.value.trim()
    if (!newUsername) {
      showInfo('Nothing changed');
      return;
    }
    const fetchUsername = await fetchName();
    if (userInput.value !== fetchUsername.data) {
      const check = prompt('are you sure?\n(yes,no)')
      if (check !== 'yes') {
        showInfo('Nothing changed');
        return;
      }
      submitBtn.disabled = true;

      const res = await fetch('/user/panel', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername })

      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('token');
        localStorage.setItem('token', data.data.token);
        showSuccess('Username changed successfully');
      } else if (data.error === 'userAlreadyExists') {
        showError('This username is already taken');
      }
    }

  } catch (error) {
    console.log(error);
    showError('Internal error, try again');

  } finally {
    submitBtn.disabled = false;
  }
});


