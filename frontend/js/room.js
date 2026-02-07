
async function loadRooms() {
    try {
        const res = await fetch('/api/rooms', { credentials: 'include' });
        const data = await res.json();

        if (data.success) {
            displayRooms(data.rooms);
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
            <p>روم ID: ${room.id}</p>
            <a href="/room/${room.id}" class="room-link">وارد شوید</a>
        `;
        roomsList.appendChild(roomElement);
    });
}


async function createNewRoom() {
    const roomName = document.getElementById('room-name-input')?.value;

    if (!roomName || roomName.trim() === '') {
        alert('نام روم را وارد کنید');
        return;
    }

    try {
        const res = await fetch('/api/create-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ roomName })
        });

        const data = await res.json();

        if (data.success) {
            const roomLink = `${window.location.origin}${data.roomLink}`;

            alert(`روم ایجاد شد!\n\nلینک روم:\n${roomLink}\n\nروی دکمه OK بزنید تا وارد روم شوید`);

            window.location.href = data.roomLink;
        } else {
            alert('خطا در ایجاد روم: ' + data.error);
        }
    } catch (err) {
        console.error("Error creating room:", err);
        alert('خطای سرور');
    }
}

// بارگذاری روم‌ها وقتی صفحه بارگذاری شود
window.addEventListener('load', () => {
    loadRooms();
});
