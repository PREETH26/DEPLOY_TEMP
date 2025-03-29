import mongoose from 'mongoose'

const institutionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Ensure uniqueness
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track which Admin added it
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Institution", institutionSchema);