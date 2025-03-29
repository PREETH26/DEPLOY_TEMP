import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true,default:"" },
  expiresAt: { type: Date, required: true,default:0 },
}, { timestamps: true });

export default mongoose.model("OTP",otpSchema)