import Application from "../models/Application.js";
import Animal from "../models/Animal.js";
 
export const createApplication = async (req, res) => {
  try {
    const { animalId, housingType, hasOtherPets, experience, message } = req.body;
 
    if (!animalId || !housingType || !experience) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
 
    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
 
    if (animal.status !== "available") {
      return res.status(400).json({ message: "This animal is not available for adoption" });
    }
 
    const existing = await Application.findOne({ animal: animalId, adopter: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for this animal" });
    }
 
    const application = await Application.create({
      animal: animalId, adopter: req.user._id, housingType, hasOtherPets, experience, message,
    });
 
    animal.status = "pending";
    await animal.save();
 
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied for this animal" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("animal")
      .populate("adopter", "name email")
      .sort({ createdAt: -1 });
 
    let filtered = applications;
    if (req.user.role === "adopter") {
      filtered = applications.filter((a) => a.adopter._id.toString() === req.user._id.toString());
    } else if (req.user.role === "shelter") {
      filtered = applications.filter((a) => a.animal?.shelter?.toString() === req.user._id.toString());
    }
 
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
 
    const application = await Application.findById(req.params.id).populate("animal");
    if (!application) return res.status(404).json({ message: "Application not found" });
 
    const isOwner = application.animal.shelter.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
 
    application.status = status;
    await application.save();
 
    const animal = await Animal.findById(application.animal._id);
    if (status === "approved") animal.status = "adopted";
    else if (status === "rejected") animal.status = "available";
    await animal.save();
 
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
