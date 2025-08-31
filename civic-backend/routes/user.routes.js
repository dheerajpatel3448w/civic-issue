import { Router } from "express";
import { login, profile, register ,logout} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/user.middleware.js";
const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(verifyToken,logout);
router.route('/profile').get(verifyToken,profile);
export default router;