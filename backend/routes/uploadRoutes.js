import express from "express";
import { uploadFile, getFile, deleteFile, getAllFiles } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, uploadFile, (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({ 
        success: true, 
        filename: req.file.filename,
        url: `${baseUrl}/uploads/${req.file.filename}`
    });
});

router.get("/files", protect, getAllFiles);
router.get("/file/:filename", getFile);
router.delete("/file/:filename", protect, deleteFile);

export default router;