import express from "express"
import pageController from "../controller/pageController.js"
const router = express.Router()
import chatController from "../controller/chatController.js";
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";


router.post('/',auth,chatController.sendMessage)
router.get('/',auth,pageController.home)

router.post('/login',userController.login)
router.get('/login',pageController.login)

router.post('/signup',userController.signup)
router.get('/signup',pageController.signup)

export default router