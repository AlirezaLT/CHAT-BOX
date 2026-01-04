import express from "express";
import dotenv from "dotenv";
import router from "./router/router.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT;


app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


io.on("connection", (socket) => {
    console.log("یک کاربر وصل شد:", socket.id);

    socket.on("chatMessage", ({ username, message }) => {
        // خود فرستنده
        socket.emit("message", { username, message, self: true });
        // بقیه
        socket.broadcast.emit("message", { username, message, self: false });
    });

    socket.on("disconnect", () => {
        console.log("یک کاربر قطع شد:", socket.id);
    });
});


app.use('/', router);


server.listen(port, () => {
    console.log("Server is running on port " + port);
});
