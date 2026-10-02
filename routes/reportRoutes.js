import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, getReports);
router.get("/:id", protect, getReportById);
router.patch("/:id/status", protect, authorize("shelter", "admin"), updateReportStatus);

export default router;