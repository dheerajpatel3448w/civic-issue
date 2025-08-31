import { Router } from "express";
import { verifyToken } from "../middlewares/user.middleware.js";
import { createofficer, officerlogin, profile2 } from "../controllers/officer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken2 } from "../middlewares/officertoken.js";

const router = Router();

router.route('/create').post( upload.none(), createofficer);
router.route('/login').post(officerlogin);
router.route('/profile').get(verifyToken2,profile2);
export default router;
