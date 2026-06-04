import express from "express";
import { getAllUsers, activateUser, updateUserRole } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.put("/users/:userId/activate", activateUser);
router.put("/users/:userId/role", updateUserRole);

export default router;