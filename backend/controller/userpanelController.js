import jwt from "jsonwebtoken"
import usermodel from "../models/userModel.js";
import Joi from "joi";

async function userDate(req,res) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
        const joinedDateArr = await usermodel.fetchDate(userId);
        const joinedDate = joinedDateArr[0].created_at;
         res.json({ success: true, data: joinedDate });

    } catch (error) {
        console.log(error)
    }
    
}



async function changeUsername(req, res) {
    try {
        const schema = Joi.object({
            userInput: Joi.string().min(5).max(12).required(),

        });
        
        const username = req.body.username
     
        const usernameArr = await usermodel.getUser(username)
        const checkUsername = usernameArr[0];
        
        if (checkUsername) {
                return res.status(409).json({success: false, error:'userAlreadyExists'})
        }

        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
        await usermodel.updateUsername(userId, username);
        res.json({ success: true });
        
        
    } catch (error) {
        console.log(error)
    }

}

function logout(req,res) {
res.clearCookie('token');
res.redirect('/login')

}

const panelcontroller = {
    userDate,
    changeUsername,
    logout
}

export default panelcontroller