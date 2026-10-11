import express from "express";
import { createAnimal, getAnimals, getAnimalById, updateAnimal, deleteAnimal } from "../controllers/animalController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
 
const router = express.Router();
 
router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.post("/", protect, authorize("shelter", "admin"), createAnimal);
router.patch("/:id", protect, authorize("shelter", "admin"), updateAnimal);
router.delete("/:id", protect, authorize("shelter", "admin"), deleteAnimal);
 
export default router;
