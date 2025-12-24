console.log("🔥 projectRoutes loaded from:", import.meta.url);
import { getMyConnectors } from "../controllers/investorController.js";
import { createProjectPackage } from "../controllers/projectController3.js";
import { getProjectPackage } from "../controllers/projectPackageController.js";
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";

import {
  exportPNG,
  exportPDF,
  exportJSON
} from "../controllers/projectExportController.js";

import {
  createDraftProject,
  saveCategoryAnswers,
  saveExtraFeatures,
  generateLLDForProject,
  getProjectById,
  getDraftProjects,
  getSavedProjects,
  modifyProject,
  deleteProject
} from "../controllers/projectController.js";

import { renameProject, deleteDraftProject, deleteSavedProject } from "../controllers/projectController2.js";


const router = express.Router();

/* ---------------------------------------
TASK 1 — CREATE DRAFT
--------------------------------------- */
router.post("/create", authenticate, createDraftProject);

/* ---------------------------------------
TASK 2 — SAVE Q7–Q17 (CATEGORY ANSWERS)
--------------------------------------- */
router.put("/save-category/:pid", authenticate, saveCategoryAnswers);

/* ---------------------------------------
TASK 3 — SAVE Q18 + BUILD full_input
--------------------------------------- */
router.put("/save-features/:pid", authenticate, saveExtraFeatures);

/* ---------------------------------------
TASK 4 — GENERATE LLD (Summary → UML)
--------------------------------------- */
router.post("/generate-lld/:pid", authenticate, generateLLDForProject);


// Task 5.2 Get all drafts
router.get("/drafts", authenticate, getDraftProjects);

// Task 5.3 Get all saved projects
router.get("/saved", authenticate, getSavedProjects);


/* ---------------------------------------
TASK 8 — Chatbot Modification API
--------------------------------------- */
router.post("/modify/:pid", authenticate, modifyProject);

// Task 9 — DELETE project
router.delete("/:pid", authenticate, deleteProject);

// Task 11 - Rename title - for saved as well as drafts
router.put("/rename/:pid", authenticate, renameProject);

// Task 12 - delete draft using pid
router.delete("/delete-draft/:pid", authenticate, deleteDraftProject);

// Task 13 - delete saved using pid
router.delete("/delete-saved/:pid", authenticate, deleteSavedProject);


// EXPORT ROUTES
router.get("/export/png/:pid", authenticate, exportPNG);
router.get("/export/pdf/:pid", authenticate, exportPDF);
router.get("/export/json/:pid", authenticate, exportJSON);

import { DmodifyProject, DgenerateLLDForProject } from "../controllers/DgroqController.js";

//GROQ SERVICE

router.post("/dmodify/:pid", authenticate, DmodifyProject);
router.post("/dgenerate-lld/:pid", authenticate, DgenerateLLDForProject);


// Project package - post and get
// we will add linkdin option later 
router.post("/package/:pid", authenticate, createProjectPackage);
router.get("/package/:pid", authenticate, getProjectPackage);




router.get("/test-route", (req, res) => res.send("Matched test-route"));

// my connectors
router.get("/my-connectors", authenticate, getMyConnectors);

import { sendMessage, getMessages } from "../controllers/investorController.js";

router.post("/chat/send", authenticate, sendMessage);
router.get("/chat/messages", authenticate, getMessages);

import { checkChatAccess } from "../controllers/investorController.js";
router.get("/chat/check-access", authenticate, checkChatAccess);

import { getFounderProfile } from "../controllers/investorController.js";
router.get("/founder/profile/:uid", authenticate, getFounderProfile);


/* ---------------------------------------
TASK 5.1 — RETRIEVING individual
--------------------------------------- */
router.get("/:pid", authenticate, getProjectById);

export default router;
