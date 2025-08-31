import { Router } from "express";
import { verifyToken } from "../middlewares/user.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { allcomplaint, assignedWorker, createcomplaint } from "../controllers/complaint.controller.js";
import { verifyToken2 } from "../middlewares/officertoken.js";


const router3 = Router();

router3.route('/createcomplaint').post(verifyToken,upload.fields([
        {
            name: "media",
            maxCount: 2
    
        },
 ]),createcomplaint)
 router3.route('/allcomplaint').get(allcomplaint);
 router3.route('/assignworker').post(verifyToken2,assignedWorker);

 export default router3