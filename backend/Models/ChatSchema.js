import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  name: { type: String }, // e.g., "CS101 Discussion" or "Private Chat"
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 

}, { timestamps: true });

export default mongoose.model("Chat",chatSchema)