import jwt from "jsonwebtoken"
import usermodel from "../models/userModel.js";
import Joi from "joi";

async function username(req,res) {
    try {
        const username = req.user.username;
        res.json({success: true,data:username})
    } catch (error) {
        console.log(error)
    }
}

async function userDate(req,res) {
    try {
        const userId = req.user.id
        
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

        res.clearCookie('token');
        const newtoken=jwt.sign({id: userId,username:username},process.env.SECRET_KEY,{expiresIn: '7d'});
        res.cookie('token', newtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV ,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ success: true ,data:newtoken});
        
        
    } catch (error) {
        console.log(error)
    }

}

function logout(req,res) {
res.clearCookie('token');
res.redirect('/login')

}

const panelcontroller = {
    username,
    userDate,
    changeUsername,
    logout
}

export default panelcontroller