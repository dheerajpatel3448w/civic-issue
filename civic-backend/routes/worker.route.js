import { Router } from "express";
import { verifyToken } from "../middlewares/user.middleware.js";
import { createworker, getallworker } from "../controllers/worker.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken2 } from "../middlewares/officertoken.js";

const router5 = Router();

router5.route('/create').post(verifyToken2,upload.none(),createworker);
router5.route('/getallworker').get(verifyToken2,getallworker)
export default router5;