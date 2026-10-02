import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getStats,
  getUsers,
  verifyShelter,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();


router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/verify", verifyShelter);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;