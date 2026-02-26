const overlay = document.getElementById("modaloverlay");
const createroommodal = document.getElementById("createroommodal");
const joinroommodal = document.getElementById("joinroommodal");

if (overlay && createroommodal && joinroommodal) {

    function openModal(modal) {
        overlay.classList.add("active");
        modal.classList.add("active");
    }

    function closeModal() {
        overlay.classList.remove("active");
        createroommodal.classList.remove("active");
        joinroommodal.classList.remove("active");
    }

    const ddItems = document.querySelectorAll(".dd-item");
    if (ddItems.length >= 3) {
        ddItems[1].addEventListener("click", () => openModal(createroommodal));
        ddItems[2].addEventListener("click", () => openModal(joinroommodal));
    }

    document.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click", closeModal));
    overlay.addEventListener("click", closeModal);
}

const roomNameInput = document.getElementById('roomNameInput');
const createRoomBtn = document.getElementById('createRoomBTtn');
const roomLinkInput = document.getElementById('roomLinkInput');
const copyRoomBtn = document.getElementById('copyRoomBTtn');
const enterRoomBtn = document.getElementById('enterRoomBTtn');

if (roomNameInput && createRoomBtn) {
    roomNameInput.addEventListener('input', () => {
        const hasText = roomNameInput.value.trim().length > 0;
        createRoomBtn.disabled = !hasText;
        createRoomBtn.setAttribute('aria-disabled', String(!hasText));
    });

    createRoomBtn.addEventListener('click', async () => {
        const roomName = roomNameInput.value.trim();
        if (!roomName) return;

        try {
            const response = await fetch('/api/create-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ roomName })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to create room');
            }

            if (roomLinkInput) roomLinkInput.value = data.roomUrl;
            if (copyRoomBtn) copyRoomBtn.disabled = false;
            if (enterRoomBtn) enterRoomBtn.disabled = false;

            const prev = createRoomBtn.textContent;
            createRoomBtn.textContent = 'Created!';
            setTimeout(() => createRoomBtn.textContent = prev, 1400);

        } catch (err) {
            console.error(err);
            alert('Failed to create room');
        }
    });
}

if (copyRoomBtn) {
    copyRoomBtn.addEventListener('click', async () => {
        const text = roomLinkInput ? roomLinkInput.value : '';
        if (!text) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                roomLinkInput.select();
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
            }

            const prev = copyRoomBtn.textContent;
            copyRoomBtn.textContent = 'Copied!';
            setTimeout(() => copyRoomBtn.textContent = prev, 1200);

        } catch (err) {
            console.error('Copy failed', err);
        }
    });
}

if (enterRoomBtn) {
    enterRoomBtn.addEventListener('click', () => {
        const url = roomLinkInput ? roomLinkInput.value.trim() : '';
        if (!url) return;
        window.location.href = url;
    });
}

const joinLinkInput = document.getElementById('joinLinkInput');
const joinRoomBtn = document.getElementById('joinRoomBTtn');

if (joinLinkInput && joinRoomBtn) {
    joinLinkInput.addEventListener('input', () => {
        const hasText = joinLinkInput.value.trim().length > 0;
        joinRoomBtn.disabled = !hasText;
        joinRoomBtn.setAttribute('aria-disabled', String(!hasText));
    });

    joinRoomBtn.addEventListener('click', () => {
        const url = joinLinkInput.value.trim();
        if (!url) return;

        const finalUrl =
            url.startsWith('http://') || url.startsWith('https://')
                ? url
                : (url.startsWith('/') ? window.location.origin + url : window.location.origin + '/' + url);

        window.location.href = finalUrl;
    });
}