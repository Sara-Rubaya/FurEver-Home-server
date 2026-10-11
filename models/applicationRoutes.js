import express from "express";
import { createApplication, getApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
 
const router = express.Router();
 
router.post("/", protect, authorize("adopter"), createApplication);
router.get("/", protect, getApplications);
router.patch("/:id/status", protect, authorize("shelter", "admin"), updateApplicationStatus);
 
export default router;
