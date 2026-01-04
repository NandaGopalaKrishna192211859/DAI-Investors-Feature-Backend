import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getInvestorsByCategory,
  getAllInvestors,
  sendProjectPackage,
  getProjectRequestPackage,
  getInvestorFeed
} from "../controllers/investorController.js";

const router = express.Router();

// Get all investors in a given category
router.get("/category/:categoryName", authenticate, getInvestorsByCategory);

// Get all investors (community)
router.get("/all", authenticate, getAllInvestors);

// investors inbox
import { getInvestorInbox, respondToRequest, getInvestorProfile, getDirectSentProjects, getHubSentProjects, getDirectProjectInvestors, getFounderRequests, sendInvestorRequest, getInvestorMyRequests, getInvestorRequestsForProject, cancelAllDirectRequests, cancelSingleDirectRequest, cancelInvestorMyRequest, cancelHubProject, updateInvestorRequestStatus, deleteInvestorRequest, getFounderConnectors, getAcceptedConnectors, getInvestorFeedFiltered} from "../controllers/investorController.js";


router.get("/inbox", authenticate, getInvestorInbox);
router.post("/respond", authenticate, respondToRequest);
router.get("/investor/profile/:uid", authenticate, getInvestorProfile);
// send project package
router.post("/send-package", authenticate, sendProjectPackage);

router.get(
  "/projects/request/:requestId",
  authenticate,
  getProjectRequestPackage
);

router.get(
  "/feed",
  authenticate,
  getInvestorFeed
);

router.get(
  "/projects/sent/direct",
  authenticate,
  getDirectSentProjects
);

router.get(
  "/projects/sent/hub",
  authenticate,
  getHubSentProjects
);

router.get(
  "/projects/:projectId/direct-investors",
  authenticate,
  getDirectProjectInvestors
);

router.get(
  "/requests/founder",
  authenticate,
  getFounderRequests
);

router.post("/send-request", authenticate, sendInvestorRequest);
router.get("/requests/mine", authenticate, getInvestorMyRequests);

router.get(
  "/founder/investor-requests/:pid",
  authenticate,
  getInvestorRequestsForProject
);

router.post(
  "/cancel/direct/single",
  authenticate,
  cancelSingleDirectRequest
);

// ❌ Cancel ALL direct requests for a project
router.post(
  "/cancel/direct/all",
  authenticate,
  cancelAllDirectRequests
);


router.post(
  "/requests/cancel",
  authenticate,
  cancelInvestorMyRequest
);

// routes/projectRoutes.js
router.post(
  "/cancel/hub",
  authenticate,
  cancelHubProject
);


router.post(
  "/requests/update-status",
  authenticate,
  updateInvestorRequestStatus
);

// DELETE REQUEST (INVESTOR SIDE)
router.post(
  "/requests/delete",
  authenticate,
  deleteInvestorRequest
);

router.get(
  "/founders/connectors",
  authenticate,
  getFounderConnectors
);

router.get(
  "/investors/connectors/accepted",
  authenticate,
  getAcceptedConnectors
);


router.get(
  "/filter/feed",
  authenticate,
  getInvestorFeedFiltered
);


// ........................................................................
// Chat work
import {
  getOrCreateChat,
  sendChatMessage,
  getChatMessages
} from "../controllers/investorController.js";

router.get("/chat/:requestId", authenticate, getOrCreateChat);
router.post("/chat/send", authenticate, sendChatMessage);
router.get("/chat/messages/:chatId", authenticate, getChatMessages);

export default router;
