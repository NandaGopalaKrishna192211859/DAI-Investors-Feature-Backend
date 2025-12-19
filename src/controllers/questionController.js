import db from "../config/db.js";

// ============================
// TASK: 7 GET ALL CATEGORIES (for dropdown)
// ============================
export async function getAllCategories(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, category_name FROM categories ORDER BY id ASC"
    );

    return res.json({
      categories: rows
    });

  } catch (err) {
    console.error("GET CATEGORIES ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}
// ------------------------------------------------------
// TASK 6: GET CATEGORY QUESTIONS (Q7–Q17)
// ------------------------------------------------------
export async function getCategoryQuestions(req, res) {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Fetch questions for this category
    const [rows] = await db.query(
      `SELECT q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17 
       FROM categories 
       WHERE category_name = ? 
       LIMIT 1`,
      [category]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json({
      category: category,
      questions: rows[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch questions" });
  }
}
