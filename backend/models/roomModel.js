import db from "../utilities/db.js";

class roomModel  {
    static getAllRooms = async () => {
        const [result] = await db.query(`select * from rooms`);
        return result;
    }
    static getRoom = async (roomId) => {
        const [result] = await db.query(`select * from rooms where room_id = ?`,[roomId])
	    return result
    }
    static createRoom = async (roomId, roomName, createdBy) => {
        const createdAt = new Date();
        const [result] = await db.query(
            `INSERT INTO rooms (room_id, room_name, created_by, created_at) VALUES (?, ?, ?, ?)`,
            [roomId, roomName, createdBy, createdAt]
        );
        return result;
    }
}
export default roomModel;
