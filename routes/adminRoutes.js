import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.get("dashboard", protect, authorize("admin"),(req,res)=>{
    res.status(200).json({
        message: `Welcome Admin ${req.user.name}`
    });
});
    router.get("/shelter-only", protect, authorize("shelter","admin"),(req,res)=>{
        res.status(200).json({
            message: `Welcome &{req.user.role} &{req.user.name}`
        });
    });
export default router;