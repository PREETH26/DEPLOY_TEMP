import express from "express";
import multer from "multer";
import cloudinary from "../Config/cloudinary.js";
import User from "../Models/UserSchema.js";
import AuthMiddle from "../Middlewares/AuthMiddleware.js";

const VisualRouter = express.Router();

// Configure Multer to use memory storage (no local saving)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(file.originalname.toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only JPEG, JPG, and PNG files are allowed!"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Route to update profile picture
VisualRouter.put(
    "/update-profile-pic",
    AuthMiddle,
    upload.single("profilePic"), // 'profilePic' is the name of the form field
    async (req, res) => {
        try {
            if (!req.file) {
                console.log("No file uploaded. Request body:", req.body); // Debug log
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            // Get the userId from req.body (parsed by multer)
            const { userId } = req.body;
            console.log("User ID from req.body:", userId); // Debug log
            console.log("req.user from middleware:", req.user); // Debug log to check middleware

            // Convert the file buffer to a base64 string for Cloudinary upload
            const base64Image = req.file.buffer.toString("base64");
            const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(dataUri, {
                folder: "profile_pics", // Organize images in a folder in Cloudinary
                resource_type: "image",
            });

            console.log("Cloudinary URL:", result.secure_url); // Debug log

            // Update the user's profilePic field with the Cloudinary URL
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: result.secure_url },
                { new: true }
            );

            console.log("Updated user:", updatedUser); // Debug log

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            res.status(200).json({
                success: true,
                message: "Profile picture updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Error uploading profile picture to Cloudinary:", error);
            res.status(500).json({ success: false, message: "Failed to update profile picture" });
        }
    }
);

export default VisualRouter;