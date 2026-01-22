import express from "express"
import pageController from "../controller/pageController.js"
const router = express.Router()
import panelcontroller from "../controller/userpanelController.js";
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";



router.get('/',auth,pageController.home)

router.post('/login',userController.login)
router.get('/login',pageController.login)

router.post('/signup',userController.signup)
router.get('/signup',pageController.signup)

router.get('/user/panel',auth,pageController.panel)
router.post('/user/panel',panelcontroller.changeUsername)
router.get('/user/logout',auth,panelcontroller.logout)

router.get('/about',pageController.about)

export default router