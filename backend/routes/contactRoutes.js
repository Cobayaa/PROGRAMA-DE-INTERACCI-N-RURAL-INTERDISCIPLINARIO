import express from "express";
import { getContactInfo, updateContactInfo, sendContactMessage } from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getContactInfo);
router.post("/send-message", sendContactMessage);

router.put("/", protect, adminOnly, updateContactInfo);

export default router;