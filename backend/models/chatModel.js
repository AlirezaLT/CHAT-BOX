import db from "../utilities/db.js"
class chatModel{
    static saveMessage = async(userId, username, roomId, message, timestamp)=>{
        const [result]= await db.query(
            `INSERT INTO messages (id, sender_id, username, room_id, message, created_at)
             VALUES (UUID(), ?, ?, ?, ?, ?)`,
            [userId, username, roomId, message, timestamp]
        )
        return result
    }
    
    static getMessage = async(roomId)=>{
        const [result]= await db.query(
            `SELECT id, sender_id, username, message, room_id, created_at FROM messages 
             WHERE room_id = ? 
             ORDER BY created_at ASC`,
            [roomId]
        )
        return result
    }
}

export default chatModel