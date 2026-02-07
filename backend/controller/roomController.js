import roomModel from "../models/roomModel.js";

async function getroom(req,res){
    try{
        const roomId = req.params;
        const room = await roomModel.getRoom(roomId);
	    if(!room){
		res.json({success: false,error: "Room Not Found"})
	    }
	    res.json({success: true,data: room})
    }catch(err){
        console.log(err);
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

const roomsController={
    getAllRooms,
    getroom
}

export default roomsController;
