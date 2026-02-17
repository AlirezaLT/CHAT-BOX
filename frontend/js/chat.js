const chatBox = document.querySelector(".chat-display");
const messageInput = document.getElementById("chat-sender");
const sendBtn = document.querySelector(".send-b");

const token = localStorage.getItem("token");


if (!token) {
    window.location.href = '/login';
}


function getRoomIdFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/room\/(.+)/);
    return match ? match[1] : "public";
}

let currentRoom = getRoomIdFromUrl();
let currentUser = null;

const socket = io();

window.addEventListener("load", async () => {
    socket.emit("joinRoom", { token, roomId: currentRoom });
    await getMessage();
});

function renderMessage(username, message, timestamp, self) {
    const wrapper = document.createElement("div");
    wrapper.className = `chat-message ${self ? "SENT" : "RECEIVED"}`;

    wrapper.innerHTML = `
        <div class="CHAT">
            <div class="sender namem">${username} | ${timestamp}</div>
            <div>${message}</div>
        </div>
    `;

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getMessage() {
    try {
        const res = await fetch(`/api/fetch/message?roomId=${currentRoom}`, {
            credentials: 'include'
        });

        const data = await res.json();

        if (data.success) {

            chatBox.innerHTML = "";

            if (data.currentUser) {
                currentUser = data.currentUser;
            }

            data.messages.forEach(msg => {
                const isSelf = currentUser && msg.sender_id === currentUser.id;
                renderMessage(msg.username, msg.message, msg.created_at, isSelf);
            });
        }

    } catch (err) {
        console.error("Error fetching messages:", err);
    }
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    socket.emit("chatMessage", { message, roomId: currentRoom });
    messageInput.value = "";
}

socket.on("message", ({ username, message, timestamp, userId }) => {
    if (!currentUser) return;

    const isSelf = userId === currentUser.id;
    renderMessage(username, message, timestamp, isSelf);
});

sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
});

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

socket.on("messageError", (msg) => {
    console.log("Message error:", msg);
});
