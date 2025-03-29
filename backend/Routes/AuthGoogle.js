import express from "express";
import passport from "passport";
import cors from "cors"

const router = express.Router();


/**
 * GET /auth/google
 * Initiate Google OAuth login
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * GET /auth/google/callback
 * Google calls this after the user grants permission
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  (req, res) => {
    // Redirect to frontend after successful login
    res.redirect(`http://localhost:5173/`);
  }
);

// // Optional routes for success/failure
// router.get("/", (req, res) => {
//   // If using sessions, req.user is now the logged-in user
//   res.status(200).json({ success: true, message: "Google login success", user: req.user });
// });

// router.get("/failure", (req, res) => {
//   res.status(400).json({ success: false, message: "Google login failed" });
// });

export default router;
