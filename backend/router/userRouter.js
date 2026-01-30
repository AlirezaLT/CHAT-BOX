import express from "express"
const userRouter = express.Router()
import panelcontroller from "../controller/userpanelController.js";
import auth from "../middleware/auth.js";

userRouter.post('/api/fetch/date',panelcontroller.userDate)
userRouter.post('/panel',panelcontroller.changeUsername)
userRouter.get('/logout',auth,panelcontroller.logout)


export default userRouter