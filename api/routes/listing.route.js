import { Router } from "express";
const router = Router();

import {
  createListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
