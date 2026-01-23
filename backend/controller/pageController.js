import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const FRONTEND_DIR = path.join(__dirname, '../../frontend');

const pageController = {
  home: (req, res) => res.sendFile('HTML/MAIN-CHAT-BOX.html', { root: FRONTEND_DIR }),
  login: (req, res) => res.sendFile('HTML/Login.html', { root: FRONTEND_DIR }),
  signup: (req, res) => res.sendFile('HTML/SignUp.html', { root: FRONTEND_DIR }),
  about: (req, res) => res.sendFile('HTML/AboutUS.html', { root: FRONTEND_DIR }),
  panel: (req, res) => res.sendFile('HTML/UserPanel.html', { root: FRONTEND_DIR }),
};

export default pageController;
