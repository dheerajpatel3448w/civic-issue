import { Router } from "express";
import { verifyToken } from "../middlewares/user.middleware.js";
import { Addressbylanlat } from "../controllers/map.controller.js";
const router2 = Router();

router2.route('/address').get(Addressbylanlat);

export default router2;