import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Exam Schedule Updated"
  content: { type: String, required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  classGroup: { type: mongoose.Schema.Types.ObjectId, ref: "ClassGroup" }, // Optional
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin/Faculty
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification",notificationSchema)


// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//     title: { type: String, required: true }, // e.g., "Exam Schedule Updated" or "New Message from John"
//     content: { type: String, required: true }, // e.g., "Check the updated schedule" or "Hey, I replied to your query"
//     recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // Who gets the notification
//     sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who triggered it (Admin, Faculty, or User)
//     context: { 
//         type: String, 
//         enum: ["classGroup", "subjectGroup", "chat", "general"], 
//         required: true 
//     }, // What type of notification is this
//     contextId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         refPath: "contextRef" // Dynamically references based on context
//     }, // ID of the related entity (ClassGroup, SubjectGroup, Chat)
//     contextRef: { 
//         type: String, 
//         enum: ["ClassGroup", "SubjectGroup", "Chat"], 
//         required: function() { return this.context !== "general"; } 
//     }, // Model to reference
//     isRead: { type: Boolean, default: false }, // Has the recipient seen it?
// }, { timestamps: true });

// // Ensure dynamic referencing works
// notificationSchema.path("contextId").ref = function () {
//     return this.contextRef || null;
// };

// export default mongoose.model("Notification", notificationSchema);