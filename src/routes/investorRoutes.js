import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getInvestorsByCategory,
  getAllInvestors,
  sendProjectPackage
} from "../controllers/investorController.js";

const router = express.Router();

// Get all investors in a given category
router.get("/category/:categoryName", authenticate, getInvestorsByCategory);

// Get all investors (community)
router.get("/all", authenticate, getAllInvestors);

// investors inbox
import { getInvestorInbox, respondToRequest, getInvestorProfile, getHubFeed} from "../controllers/investorController.js";
router.get("/inbox", authenticate, getInvestorInbox);
router.post("/respond", authenticate, respondToRequest);
router.get("/investor/profile/:uid", authenticate, getInvestorProfile);
// send project package
router.post("/send-package", authenticate, sendProjectPackage);


router.get("/hub-feed", authenticate, getHubFeed);


export default router;
