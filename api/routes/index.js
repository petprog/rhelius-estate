import { Router } from "express";
import usersRouter from "./user.route.js";

const router = Router();

router.use("/api/user", usersRouter);

export default router;
