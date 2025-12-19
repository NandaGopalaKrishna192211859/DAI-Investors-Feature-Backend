import express from "express";
import { register, login, sendOTP, resetPassword } from "../controllers/authController.js";
import upload from "../middlewares/uploadProfileImage.js";
import { uploadProfileImage, getProfile, updateProfile, deleteAccount } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Existing register + login
router.post(
  "/register",
  upload.single("profile_image"), // image field name
  register
);
router.post("/login", login);

// Task 10 — Upload Profile Image
router.post("/profile-image", authenticate, upload.single("image"), uploadProfileImage);
// Step 2: Forgot Password
router.post("/forgot-password", sendOTP);
router.post("/reset-password", resetPassword);


// Task - get profile data
router.get("/me", authenticate, getProfile);

// Task 14 - update profile data
router.put(
  "/update-profile",
  authenticate,
  upload.single("profile_image"), 
  updateProfile
);
// Task 15: Delete the account
router.delete("/delete-account", authenticate, deleteAccount);

export default router;

