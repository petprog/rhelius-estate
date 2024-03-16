import { Router } from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";
const router = Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);

export default router;
