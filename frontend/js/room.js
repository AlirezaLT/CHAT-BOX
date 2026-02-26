
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const logoutBtn = document.getElementById('logoutBtn');
const createRoomModal = document.getElementById('createRoomModal');
const closeCreateRoomModal = document.getElementById('closeCreateRoomModal');
const confirmCreateRoom = document.getElementById('confirmCreateRoom');
const roomNameInput = document.getElementById('roomNameInput');


const dropdownMenu = document.getElementById('dropdown');


if (createRoomBtn) {
    createRoomBtn.addEventListener('click', () => {
        createRoomModal.classList.add('active');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
        roomNameInput.value = '';
        roomNameInput.focus();
    });
}


if (closeCreateRoomModal) {
    closeCreateRoomModal.addEventListener('click', () => {
        createRoomModal.classList.remove('active');
    });
}


window.addEventListener('click', (e) => {
    if (e.target === createRoomModal) {
        createRoomModal.classList.remove('active');
    }
});


if (confirmCreateRoom) {
    confirmCreateRoom.addEventListener('click', async () => {
        const roomName = roomNameInput.value.trim();

        if (!roomName) {
            showError('لطفا نام اتاق را وارد کنید');
            return;
        }

        try {
            confirmCreateRoom.disabled = true;

            const res = await fetch('/api/create-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ roomName })
            });

            const data = await res.json();

            if (data.success) {
                showSuccess(`اتاق "${roomName}" با موفقیت ایجاد شد`);
                createRoomModal.classList.remove('active');
                
                
                setTimeout(() => {
                    window.location.href = `/room/${data.roomId}`;
                }, 1000);
            } else {
                showError(data.error || 'خطا در ایجاد اتاق');
            }
        } catch (err) {
            showError('خطا در اتصال');
        } finally {
            confirmCreateRoom.disabled = false;
        }
    });
}

if (joinRoomBtn) {
    joinRoomBtn.addEventListener('click', () => {
        const roomId = prompt('شناسه اتاق را وارد کنید:');
        if (roomId && roomId.trim()) {
            window.location.href = `/room/${roomId.trim()}`;
        }
    });
}


if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        showSuccess('خروج موفق');
        setTimeout(() => {
            window.location.href = '/login';
        }, 500);
    });
}

function showError(msg) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <span class="message">${msg}</span>
        <button class="close-btn">&times;</button>
    `;
    container.appendChild(notification);
    
    notification.querySelector('.close-btn').addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showSuccess(msg) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <span class="message">${msg}</span>
        <button class="close-btn">&times;</button>
    `;
    container.appendChild(notification);
    
    notification.querySelector('.close-btn').addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}


async function loadRooms() {
    try {
        const res = await fetch('/api/rooms', { credentials: 'include' });
        const data = await res.json();

        if (data.success) {
            displayRooms(data.data);
        }
    } catch (err) {
        console.error("Error loading rooms:", err);
    }
}

function displayRooms(rooms) {
    const roomsList = document.getElementById('rooms-list');
    if (!roomsList) return;

    roomsList.innerHTML = '';

    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'room-item';
        roomElement.innerHTML = `
            <h3>${room.room_name}</h3>
            <p>روم ID: ${room.room_id}</p>
            <a href="/room/${room.room_id}" class="room-link">وارد شوید</a>
        `;
        roomsList.appendChild(roomElement);
    });
}

