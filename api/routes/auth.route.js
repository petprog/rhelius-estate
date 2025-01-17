import { Router } from "express";
import {
  google,
  login,
  signup,
  signout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.get("/signout", signout);

export default router;
