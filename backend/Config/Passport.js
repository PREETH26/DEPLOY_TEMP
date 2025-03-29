import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/UserSchema.js";
import { generateRandomPass } from "../Config/generateRandomPass.js";
import bcrypt from "bcryptjs"
import 'dotenv/config'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback", // Make sure this matches your Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Extract email from Google profile
        const email = profile.emails[0].value.toLowerCase();
        const name = profile.displayName;
        const googleId = profile.id;

        // 2. Look for existing user by email
        let user = await User.findOne({ email });

        // 3. If no user found, create a new one
        if (!user) {
          const randomPass = generateRandomPass(8);
          const hashedpassword = await bcrypt.hash(randomPass,12);
          user = new User({
            name,
            email,
            password: hashedpassword,  // or a random string
            googleId,      // store for reference
            isVerified:true
          });
          await user.save();
        } else {
          // If user found but no googleId yet, optionally set it
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
        }

        // 4. Done
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// If using sessions (optional):
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
