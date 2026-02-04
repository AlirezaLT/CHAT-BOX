import db from "../utilities/db.js"
class chatModel{
    static saveMessage = async(userId,roomId,message,timestamp)=>{
        const [result]= await db.query(`insert into messages (id,sender_id,room_id,message,created_at)
            values(uuid(),?,?,?,?)`,[userId,roomId,message,timestamp])
        return result
    }
}

export default chatModel