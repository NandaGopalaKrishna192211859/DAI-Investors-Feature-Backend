import express from "express";
import { getCategoryQuestions, getAllCategories } from "../controllers/questionController.js";

const router = express.Router();

// GET all categories (for dropdown)
router.get("/categories", getAllCategories);
// GET category questions (Q7–Q17)
router.get("/:category", getCategoryQuestions);

export default router;
