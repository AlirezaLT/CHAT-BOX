import roomModel from "../models/roomModel.js";

async function getRoom(req, res) {
    try {
        const { roomId } = req.params;
        const room = await roomModel.getRoom(roomId);
        if (!room) {
            return res.json({ success: false, error: "Room Not Found" });
        }
        res.json({ success: true, data: room });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

async function getAllRooms (req,res){
    try{
        const rooms = await roomModel.getAllRooms();
        res.json({success: true,data: rooms});
    }
    catch(err){
        console.log(err)
    }
}
async function createRoom(req, res) {
    try {
        const { roomName } = req.body;
        const userId = req.user.id;

        if (!roomName || roomName.trim() === '') {
            return res.status(400).json({ success: false, error: 'Room name is required' });
        }

        const roomId = 'room_' + Date.now();
        await roomModel.createRoom(roomId, roomName, userId);

        // ✅ Build the roomUrl the frontend expects
        const roomUrl = `${req.protocol}://${req.get('host')}/room/${roomId}`;

        res.json({ success: true, roomId, roomName, roomUrl, message: 'Room created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

const roomController={
    getAllRooms,
    getRoom,
    createRoom
}

export default roomController;
