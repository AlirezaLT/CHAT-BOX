import jwt from "jsonwebtoken";
import chatModel from "../models/chatModel.js";

function chat(io, socket) {
    try {
        socket.on("chatMessage",async ({ token, message, roomId }) => {

            const user = jwt.verify(token, process.env.SECRET_KEY);
            const username = user.username

            // date setting
            const time = new Date();
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            const timestamp = time.toLocaleString('fa-IR', options)
            
            const userId = user.id
            await chatModel.saveMessage(userId,roomId || 'public',message,timestamp)


            socket.emit("message", { username: username, message, self: true, timestamp });

            socket.broadcast.emit("message", { username: username, message, self: false, timestamp });
        });

        socket.on("disconnect", () => {
            console.log("a user disconnected");
        });

    } catch (error) { console.log(error) }


}

const chatController = {
    chat
}
export default chatController