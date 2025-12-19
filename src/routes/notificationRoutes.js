import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getNotifications, markNotificationsRead } from "../controllers/investorController.js";

const router = express.Router();

// Get notifications for logged-in user
router.get("/", authenticate, getNotifications);

// Mark one or multiple notifications as read
router.post("/mark-read", authenticate, markNotificationsRead);

router.get("/test", (req, res) => {
  res.send("Notifications route is working");
});

export default router;
