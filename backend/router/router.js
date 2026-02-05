import express from "express"
import pageController from "../controller/pageController.js"
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";
import chatController from "../controller/chatController.js";
const router = express.Router();


router.get('/',auth,pageController.home)
router.get('/api/fetch/message',auth,chatController.getMessage)

router.post('/login',userController.login)
router.get('/login',pageController.login)

router.post('/signup',userController.signup)
router.get('/signup',pageController.signup)

router.get('/user/panel',auth,pageController.panel)

router.get('/about',pageController.about)

export default router