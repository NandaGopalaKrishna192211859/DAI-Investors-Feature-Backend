import express from "express";
import { cancelProjectRequest, listSentProjectRequests, listReceivedProjectRequests, updateRequestStatus } from "../controllers/ProjectInvestorController.js";
import { authenticate } from "../middlewares/authMiddleware.js";


const router = express.Router();
router.post("/cancel-request", authenticate, cancelProjectRequest);

router.get("/sent-requests", authenticate, listSentProjectRequests);

router.get("/received-requests", authenticate, listReceivedProjectRequests);

router.post("/update-status", authenticate, updateRequestStatus);




export default router;


