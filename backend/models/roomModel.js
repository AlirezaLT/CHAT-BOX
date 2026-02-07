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
}
export default roomModel;
