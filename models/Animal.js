import mongoose from "mongoose";
 
const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true },
    breed: { type: String, default: "Mixed" },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    size: { type: String, enum: ["Small", "Medium", "Large"], default: "Medium" },
    description: { type: String, required: true },
    healthStatus: { type: String, default: "Vaccinated" },
    temperament: { type: String, default: "Friendly" },
    photoUrl: { type: String, required: true },
    status: { type: String, enum: ["available", "pending", "adopted"], default: "available" },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
 
export default mongoose.model("Animal", animalSchema);
