import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)

const pageController ={
    home:(req,res)=>{
        res.sendFile(path.join(__dirname,'../../frontend','HTML','MAIN-CHAT-BOX.html'))
    },
        login:(req,res)=>{
        res.sendFile(path.join(__dirname,'../../frontend','HTML','login.html'))
    },
        signup:(req,res)=>{
        res.sendFile(path.join(__dirname,'../../frontend','HTML','SignUp.html'))
    }
}

export default pageController