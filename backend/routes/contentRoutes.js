import express from "express";
import { 
    getPageContent, 
    getAllPagesContent, 
    updatePageContent
} from "../controllers/contentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:page", getPageContent);

router.put("/:page", protect, updatePageContent);

router.get("/admin/all", protect, adminOnly, getAllPagesContent);

export default router;