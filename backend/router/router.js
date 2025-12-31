import express from "express"
import pageController from "../controller/pageController.js"
const router = express.Router()
import chatController from "../controller/chatController.js";

router.post('/',chatController.home)
router.get('/',pageController.home)

export default router