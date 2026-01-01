import express from "express";
// import socket.io from "socket.io";
import dotenv from "dotenv";
import router from "./router/router.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname,"../frontend")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',router)

app.listen(port,()=>{
    console.log("Server is running on port "+ port)
})