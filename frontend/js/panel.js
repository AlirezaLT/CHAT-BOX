// developed by Alireza-Hashamdar

const form = document.querySelector('form');
const submitBtn = form.querySelector('button[type="submit"]');
const header = document.getElementById('header')
const savedUsername = localStorage.getItem("username");
const userInput = form.querySelector('#userInput');

header.innerHTML = `HI ${savedUsername} ❤️`



form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const newUsername = userInput.value.trim()
    if (!newUsername) {
      showInfo('Nothing changed');
      return;
    }
    if (userInput.value !== savedUsername) {
      const check = prompt('are you sure?\n(yes,no)')
      if (check !== 'yes') {
        showInfo('Nothing changed');
        return;
      }
      submitBtn.disabled = true;

      const res =await fetch('/user/panel', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({ username: newUsername })

      }); 

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('username', newUsername);
        showSuccess('Username changed successfull y');
      }else if(data.error === 'userAlreadyExists'){
         showError('This username is already taken');   
      }
    }
      
    } catch (err) {
      console.error(err);
      showError('Internal error, try again');

    } finally {
      submitBtn.disabled = false;
    }
  });
 

