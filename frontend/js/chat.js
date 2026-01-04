const socket = io();

const chatBox = document.querySelector(".chat-display");
const messageInput = document.getElementById("chat-sender");
const sendBtn = document.querySelector(".send-b");


const username = localStorage.getItem("username");


sendBtn.addEventListener("click", (e) => {
    e.preventDefault(); // جلوگیری از submit فرم
    sendMessage();
});


messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // ارسال پیام به سرور
    socket.emit("chatMessage", { username, message });
    messageInput.value = "";
}

// دریافت پیام از سرور
socket.on("message", ({ username: sender, message, self }) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("CHAT");


    const senderDiv = document.createElement("div");
    senderDiv.classList.add("sender", "namem");
    senderDiv.textContent = sender;
    msgDiv.appendChild(senderDiv);

    const textDiv = document.createElement("div");
    textDiv.textContent = message;
    msgDiv.appendChild(textDiv);
    
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("chat-message");
    wrapperDiv.classList.add(self ? "SENT" : "RECEIVED");

    wrapperDiv.appendChild(msgDiv);
    chatBox.appendChild(wrapperDiv);


    chatBox.scrollTop = chatBox.scrollHeight;
});
