import { Router } from "express";
import usersRouter from "./user.route.js";
import authRouter from "./auth.route.js";

const router = Router();

router.use("/api/user", usersRouter);
router.use("/api/auth", authRouter);

export default router;
