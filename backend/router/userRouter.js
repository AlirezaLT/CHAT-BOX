import express from "express"
const userRouter = express.Router()
import panelcontroller from "../controller/userpanelController.js";
import auth from "../middleware/auth.js";

userRouter.get('/api/fetch/username',auth,panelcontroller.username)
userRouter.get('/api/fetch/date',auth,panelcontroller.userDate)
userRouter.post('/panel',auth,panelcontroller.changeUsername)
userRouter.get('/logout',auth,panelcontroller.logout)


export default userRouter