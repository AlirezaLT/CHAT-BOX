import jwt from "jsonwebtoken";
import chatModel from "../models/chatModel.js";

function chat(io, socket) {

    
    socket.on("joinRoom", ({ token, roomId }) => {
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);

            socket.userId = user.id;
            socket.username = user.username;
            socket.roomId = roomId || "public";

            socket.join(socket.roomId);
            socket.emit("joinRoomSuccess", { username: socket.username, roomId: socket.roomId });
            console.log(`${socket.username} joined room ${socket.roomId}`);

        } catch (err) {
            console.log("joinRoom error:", err.message);
            socket.emit("messageError", "Invalid token, please login again");
        }
    });


    socket.on("chatMessage", async ({ message, roomId }) => {
        try {
          
            if (!socket.username || !socket.roomId) {
                socket.emit("messageError", "You must join a room first");
                return;
            }

            const username = socket.username;
            const userId = socket.userId;
            
            const actualRoomId = roomId || socket.roomId;

            const time = new Date();
            const timestamp = time.toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit' });

            await chatModel.saveMessage(userId, username, actualRoomId, message, timestamp);

            io.to(actualRoomId).emit("message", { username, message, timestamp, userId, self: false });

        } catch (err) {
            console.log("chatMessage error:", err.message);
            socket.emit("messageError", "Something went wrong");
        }
    });

    socket.on("disconnect", () => {
        console.log(`${socket.username || "A user"} disconnected`);
    });
}

// دریافت پیام‌های یک روم مشخص
async function getMessage(req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, error: "Token required" });

        const user = jwt.verify(token, process.env.SECRET_KEY);
        const userId = user.id;

        // دریافت roomId از query parameter
        const roomId = req.query.roomId || "public";
        const messages = await chatModel.getMessage(roomId);

        // اضافه کردن self به هر پیام
        const formattedMessages = messages.map(msg => ({
            username: msg.username,
            message: msg.message,
            created_at: msg.created_at,
            self: msg.sender_id === userId, 
            sender_id: msg.sender_id
        }));

        res.json({ 
            success: true, 
            messages: formattedMessages,
            currentUser: {
                id: user.id,
                username: user.username
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}


export default { chat, getMessage };
