const chatBox = document.querySelector(".chat-display");
const messageInput = document.getElementById("chat-sender");
const sendBtn = document.querySelector(".send-b");

const token = localStorage.getItem("token");

let currentRoom = "public";
let currentUser = null; 

const socket = io();

window.addEventListener("load", () => {
    socket.emit("joinRoom", { token, roomId: currentRoom });
    getMessage();
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
        const res = await fetch('/api/fetch/message', { credentials: 'include' });
        const data = await res.json();

        if (data.success) {
           
            if (data.currentUser) {
                currentUser = data.currentUser;
            }

            data.messages.forEach(msg => {
             
                const isSelf = data.currentUser && msg.sender_id === data.currentUser.id;
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

    socket.emit("chatMessage", { message });
    messageInput.value = "";
}


socket.on("message", ({ username, message, timestamp, userId, self }) => {
    
    const isSelf = currentUser && userId === currentUser.id;
    renderMessage(username, message, timestamp, isSelf);
});

socket.on("joinRoomSuccess", ({ username, roomId }) => {
    console.log(`Joined room: ${roomId} as ${username}`);
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
