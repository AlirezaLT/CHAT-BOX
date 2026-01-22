import jwt from "jsonwebtoken"
import userModule from "../module/userModule.js";
import Joi from "joi";
async function changeUsername(req, res) {
    try {
        // const schema = Joi.object({
        //     userInput: Joi.string().min(5).max(12).required(),

        // });
        
        const body = req.body.username

        const usernameArr = await userModule.getUser(body)
        const username = usernameArr[0];
        
        if (username) {
            if(req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))){
                return res.status(409).json({success: false,error:'userAlreadyExists'})
            }
        }

    } catch (error) {
        console.log(error)
    }

}

function logout(req,res) {
res.clearCookie('token');
res.redirect('/login')

}

const panelcontroller = {
    changeUsername,
    logout
}

export default panelcontroller