import db from "../config/db.js";
import fs from "fs";

/**
 * Rename project title
 * PUT /api/projects/rename/:pid
 */
export async function renameProject(req, res) {
  try {
    const { pid } = req.params;
    const { new_title } = req.body;
    const uid = req.user.uid;

    if (!new_title || new_title.trim() === "") {
      return res.status(400).json({ error: "new_title is required." });
    }

    // Check if project exists & belongs to user
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Update title
    await db.query(
      "UPDATE projects SET project_title = ?, updated_at = NOW() WHERE pid = ?",
      [new_title.trim(), pid]
    );

    return res.json({
      message: "Project title updated successfully.",
      pid,
      new_title,
    });
  } catch (err) {
    console.error("RENAME PROJECT ERROR >>>", err);
    return res.status(500).json({ error: "Failed to rename project." });
  }
}

// Delete the Draft Project
export async function deleteDraftProject(req, res) {
  try {
    const { pid } = req.params;
    const uid = req.user.uid;

    // 1. Check if project exists
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = rows[0];

    // 2. Validate status = 0 (draft)
    if (project.status !== 0) {
      return res.status(400).json({
        error: "This project is not a draft. Cannot delete using this endpoint.",
      });
    }

    // 3. Delete the draft
    await db.query("DELETE FROM projects WHERE pid = ?", [pid]);

    return res.json({
      message: "Draft project deleted successfully.",
      pid,
    });

  } catch (err) {
    console.error("DELETE DRAFT ERROR >>>", err);
    return res.status(500).json({ error: "Failed to delete draft project." });
  }
}

// Delete the Saved Project
export async function deleteSavedProject(req, res) {
  try {
    const { pid } = req.params;
    const uid = req.user.uid;

    // 1. Check if project exists
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = rows[0];

    // 2. Validate status = 1 (saved)
    if (project.status !== 1) {
      return res.status(400).json({
        error: "This project is not saved. Cannot delete using this endpoint.",
      });
    }

    // 3. Delete the saved project
    await db.query("DELETE FROM projects WHERE pid = ?", [pid]);

    return res.json({
      message: "Saved project deleted successfully.",
      pid,
    });

  } catch (err) {
    console.error("DELETE SAVED ERROR >>>", err);
    return res.status(500).json({ error: "Failed to delete saved project." });
  }
}
