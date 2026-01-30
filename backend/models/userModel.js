import db from "../utilities/db.js"


class usermodel {
    static insertUser = async (username, password) => {

        const shamsiDate = new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            calendar: 'persian',
            numberingSystem: 'latn' 
        }).format(new Date());
        
        const [result] = await db.query(`INSERT INTO users (id, username, password, created_at) 
            VALUES (uuid(), ?, ?, ?)`, [username, password, shamsiDate]);
        return result;
    }

    static getUser = async(username)=>{
        const [result] = await db.query(`select * from users where username = ?`,[username])
        return result
    }

    static updateUsername = async(userId , username)=>{
        const [result] = await db.query(`update users set username = ? where id = ? `,[username, userId])
        return result
    }

    static fetchDate = async(userId)=>{
        const [result] = await db.query(`select created_at from users where id = ?`,[userId])
        return result;
    }
    }

export default usermodel