import mysql2 from "mysql2/promise"
import dotenv from "dotenv"
import path from "path";
dotenv.config({ path: path.resolve("./.env") }); 


const db = mysql2.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
   
} )

export default db