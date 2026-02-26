const overlay = 
document.getElementById("modaloverlay");

const creratemodel = 
document.getElementById("createroommodal");

const joinmodel = 
document.getElementById("joinroommodal");

function openmodel(modal) {
    overlay.classList.add("active");
    modal.classList.add("active");
}

function closemodal() {
    overlay.classList.remove("active");
    creratemodel.classList.remove("active");
    joinmodel.classList.remove("active");
}

    document.querySelector(".dd-item:nth-child(2)") . addEventListener("click" , () => openmodel(createroommodal));

    document.querySelector(".dd-item:nth-child(3)") . addEventListener("click" , () => openmodel(joinroommodal));

    document.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click" , closemodal));
    overlay.addEventListener("click" , closemodal);

    const roomNameInput = document.getElementById('roomNameInput');
    const createRoomBTtn = document.getElementById('createRoomBTtn');
    const roomLinkInput = document.getElementById('roomLinkInput');
    const copyRoomBtn = document.getElementById('copyRoomBTtn');
    const enterRoomBTtn = document.getElementById('enterRoomBTtn');

    function makeId(len = 7) {
        return
        Math.random().toString(36).slice(2, 2 + len);
    }

    roomNameInput.addEventListener('input' , () => {
        const hasText = roomNameInput.value.trim().length > 0;
        createRoomBTtn.disabled = !hasText;

        createRoomBTtn.setAttribute('aria-disabled', String(!hasText));
    });

    roomLinkInput.value = roomUrl;
    copyRoomBtn.disabled = false;
    copyRoomBtn.setAttribute('aria-disabled' , 'false');
    enterRoomBTtn.disabled = false;
    enterRoomBTtn.setAttribute('aria-disabled' , 'false');

    const prev = createRoomBTtn.textContent = 'Created' ;
    setTimeout(() => createRoomBTtn.textContent = prev , 1400);

    roomLinkInput.addEventListener('click', async () => {
        const text = roomLinkInput.value;
        if (!text) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText){
                await
                navigator.clipboard.writeText(text);
            } else {
                roomLinkInput.select();
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
            }
            const prev = copyRoomBtn.textContent;
            copyRoomBTtn.textContent = 'Copied!';
            setTimeout(() => copyRoomBTtn.textContent = prev, 1200);
        } catch (err) {
            console.error('Copy failed', err);
        }
    });

    enterRoomBTtn.addEventListener('click', () => {
        const url = roomLinkInput.value;
        if (!url) return;
        window.location.href = url;
    });

    const joinLinkInput = document.getElementById('joinLinkInput');
    const joinRoomBTtn = document.getElementById('joinRoomBTtn');

    if (joinLinkInput && joinRoomBTtn) {
        joinLinkInput.addEventListener('input' , () => {
            const hasText =
            joinLinkInput.value.trim().length > 0;
            joinRoomBTtn.disabled = !hasText;

            joinRoomBTtn.setAttribute('aria-disabled' , String(!hasText));
        });

        joinRoomBTtn.addEventListener('click' , () => {
            const url = joinLinkInput.value.trim();
            if (!url) return;

            const finalUrl = 
            url.startswith('http://') || url.startswith('https://') 
            ? url
            : (url.startswith('/') ? window.location.origin + url : window.location.origin + '/' + url);

            window.location.href = finalUrl;
        });
    }