    import express from "express";
    import dotenv from "dotenv";dotenv.config();
    import userRouter from "./backend/router/userRouter.js";
    import router from "./backend/router/router.js";
    import cookieParser from "cookie-parser";
    import http from "http";
    import { Server } from "socket.io";
    import path, { dirname } from "path";
    import { fileURLToPath } from "url";
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    const port = process.env.PORT || 3000;

    app.use(express.static(path.join(__dirname, "/frontend")));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    
    app.use('/', router);
    app.use('/user', userRouter)

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("chatMessage", ({ username, message }) => {
            // date setting
            const time = new Date();
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            const timestamp = time.toLocaleString('fa-IR',options)
            
            socket.emit("message", { username, message, self: true ,timestamp});
        
            socket.broadcast.emit("message", { username, message, self: false,timestamp });
        });

        socket.on("disconnect", () => {
            console.log("a user disconnected");
        });
    });


server.listen(port, '0.0.0.0', () => {
  console.log("Server running on 0.0.0.0:" + port);
});