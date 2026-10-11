import Animal from "../models/Animal.js";
 
export const createAnimal = async (req, res) => {
  try {
    const { name, species, breed, age, gender, size, description, healthStatus, temperament, photoUrl } = req.body;
 
    if (!name || !species || !age || !gender || !description || !photoUrl) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
 
    const animal = await Animal.create({
      name, species, breed, age, gender, size, description, healthStatus, temperament, photoUrl,
      shelter: req.user._id,
    });
 
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// NOTE: Eita basic version - shudhu status ar shelter filter kore.
// Sazid "Search & Filter" PR e eita enhance korbe (species/gender/size/age/search/sort add hobe).
export const getAnimals = async (req, res) => {
  try {
    const { status, shelter } = req.query;
    const filter = {};
 
    if (status) filter.status = status;
    if (shelter) filter.shelter = shelter;
 
    const animals = await Animal.find(filter).populate("shelter", "name email").sort({ createdAt: -1 });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
export const getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate("shelter", "name email");
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
export const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
 
    const isOwner = animal.shelter.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }
 
    Object.assign(animal, req.body);
    await animal.save();
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
export const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
 
    const isOwner = animal.shelter.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }
 
    await animal.deleteOne();
    res.status(200).json({ message: "Animal listing deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
