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

    import chatController from "./backend/controller/chatController.js";

    app.use(express.static(path.join(__dirname, "/frontend")));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    
    app.use('/', router);
    app.use('/user', userRouter)

    io.on("connection", (socket) => {
        chatController.chat(io,socket)
    });


server.listen(port, '0.0.0.0', () => {
  console.log("Server running on 0.0.0.0:" + port);
});