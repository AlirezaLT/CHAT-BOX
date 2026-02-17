import express from "express"
import pageController from "../controller/pageController.js"
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";
import chatController from "../controller/chatController.js";
import roomController from "../controller/roomController.js";
const router = express.Router();



router.get('/',auth,pageController.home)
router.get('/room/:roomId',auth,pageController.home)
router.get('/api/fetch/message',auth,chatController.getMessage)

router.post('/login',userController.login)
router.get('/login',pageController.login)

router.post('/signup',userController.signup)
router.get('/signup',pageController.signup)

//create room
router.post('/api/create-room',auth,roomController.createRoom)
router.get('/api/rooms',auth,roomController.getAllRooms)
router.get('/api/room/:roomId',auth,roomController.getRoom)


router.get('/user/panel',auth,pageController.panel)

router.get('/about',pageController.about)

export default router