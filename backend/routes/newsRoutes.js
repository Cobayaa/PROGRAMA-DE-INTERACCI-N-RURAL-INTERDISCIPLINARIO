import express from "express";
import { 
    getAllNews, 
    getAllNewsAdmin, 
    getNewsById,
    createNews, 
    updateNews, 
    deleteNews 
} from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.get("/admin/all", protect, getAllNewsAdmin);
router.post("/", protect, createNews);
router.put("/:id", protect, updateNews);
router.delete("/:id", protect, deleteNews);

export default router;