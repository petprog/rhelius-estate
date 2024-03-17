import { Router } from "express";
const router = Router();

import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";

router.post("/create", verifyToken, createListing);

export default router;
