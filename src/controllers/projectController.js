import fs from "fs";
import util from "util";
import path from "path";
import db from "../config/db.js";
import { summarizeIdea, generateLLDFromSummary } from "../services/diagrammingAIService.js";
import { wrapUML } from "../utils/plantumlWrapper.js";
import { generatePNG } from "../services/plantumlService.js";
import { exec } from "child_process";


/* =======================================================
TASK 1 — CREATE DRAFT
======================================================= */
export async function createDraftProject(req, res) {
  try {
    const { q1, q2, q3, q4, q5, category_id } = req.body;
    const uid = req.user.uid;

    if (!q1 || !q2 || !q3 || !q4 || !q5 || !category_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    /* -----------------------------------------
       STEP 1 — Count existing drafts for user
       (status = 0 means draft)
    ----------------------------------------- */
    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM projects WHERE uid = ? AND status = 0",
      [uid]
    );

    const nextNumber = countRows[0].total + 1;
    const autoTitle = `draft${nextNumber}`;

    /* -----------------------------------------
       STEP 2 — Insert draft project
    ----------------------------------------- */
    const [rows] = await db.query(
      `INSERT INTO projects 
        (uid, project_title, q1, q2, q3, q4, q5, category_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [uid, autoTitle, q1, q2, q3, q4, q5, category_id]
    );

    return res.json({
      message: "Draft project created successfully.",
      pid: rows.insertId,
      title: autoTitle,
    });
  } catch (err) {
    console.error("CREATE DRAFT ERROR >>>", err);
    return res.status(500).json({ error: "Failed to create draft project." });
  }
}


/* =======================================================
TASK 2 — SAVE CATEGORY ANSWERS (Q7–Q17)
======================================================= */
export async function saveCategoryAnswers(req, res) {
  try {
    const { pid } = req.params;
    const answers = req.body;
    
    let updateArr = [];
    let values = [];
    
    Object.keys(answers).forEach((key) => {
      updateArr.push(`${key} = ?`);
      values.push(answers[key]);
    });
    
    values.push(pid);
    
    await db.query(
      `UPDATE projects SET ${updateArr.join(", ")} WHERE pid = ?`,
      values
    );
    
    res.json({ message: "Category answers saved." });
  } catch (err) {
    console.error("CATEGORY SAVE ERROR >>>", err);
    res.status(500).json({ error: "Failed to save category answers." });
  }
}

/* =======================================================
TASK 3 — SAVE EXTRA FEATURES (Q18) + FULL INPUT
======================================================= */
export async function saveExtraFeatures(req, res) {
  try {
    const { pid } = req.params;
    const { q18 } = req.body;
    
    // fetch project
    const [rows] = await db.query("SELECT * FROM projects WHERE pid = ?", [
      pid,
    ]);
    
    if (rows.length === 0)
      return res.status(404).json({ error: "Project not found" });
    
    const p = rows[0];
    
    // build full input
    const fullInput = `
    Q1: ${p.q1}
    Q2: ${p.q2}
    Q3: ${p.q3}
    Q4: ${p.q4}
    Q5: ${p.q5}
    
    Q7: ${p.q7}
    Q8: ${p.q8}
    Q9: ${p.q9}
    Q10: ${p.q10}
    Q11: ${p.q11}
    Q12: ${p.q12}
    Q13: ${p.q13}
    Q14: ${p.q14}
    Q15: ${p.q15}
    Q16: ${p.q16}
    Q17: ${p.q17}
    
    Q18: ${q18}
    `.trim();
    
    await db.query(
      `UPDATE projects SET q18=?, full_input=? WHERE pid=?`,
      [q18, fullInput, pid]
    );
    
    res.json({
      message: "Extra features + full input saved.",
      fullInput,
    });
  } catch (err) {
    console.error("FEATURES ERROR >>>", err);
    res.status(500).json({ error: "Failed to save extra features." });
  }
}

/* =======================================================
TASK 4 — LLD GENERATION (Summary → UML)
======================================================= */
const execAsync = util.promisify(exec);

export async function generateLLDForProject(req, res) {
  try {
    const { pid } = req.params;
    const uid = req.user.uid;

    /* 1. Fetch Project */
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, uid]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Project not found." });

    const project = rows[0];

    if (!project.full_input)
      return res.status(400).json({
        error: "Please complete all questions before generating LLD."
      });


    /* 2. Summarize & Generate UML */
    const summary = await summarizeIdea(project.full_input);
    const result = await generateLLDFromSummary(summary);
    const { uml, explanation } = result;

    const wrapped = wrapUML(uml);

    /* 3. Paths */
    const timestamp = Date.now();

    // RELATIVE paths (saved in DB)
    const umlPath = `src/storage/uml/${pid}_${timestamp}.uml`;
    const pngPath = `src/storage/diagrams/${pid}_${timestamp}.png`;

    // ABSOLUTE paths for PlantUML
    const absoluteUML = path.resolve(umlPath);
    const absolutePNGdir = path.resolve("src/storage/diagrams");

    // Ensure folders exist
    if (!fs.existsSync("src/storage/diagrams")) {
      fs.mkdirSync("src/storage/diagrams", { recursive: true });
    }
    if (!fs.existsSync("src/storage/uml")) {
      fs.mkdirSync("src/storage/uml", { recursive: true });
    }

    /* 4. Save UML */
    fs.writeFileSync(absoluteUML, wrapped);

    /* 5. Generate PNG — CORRECT FIX */
    await execAsync(
      `java -jar plantuml.jar -o "${absolutePNGdir}" "${absoluteUML}"`
    );

    /* 6. Auto rename draft → saved */
    const [savedCountRows] = await db.query(
      "SELECT COUNT(*) AS total FROM projects WHERE uid = ? AND status = 1",
      [uid]
    );
    const savedNumber = savedCountRows[0].total + 1;
    const autoSavedTitle = `saved${savedNumber}`;

    /* 7. Update project */
    await db.query(
      `UPDATE projects SET 
        project_title = ?, 
        uml_path = ?, 
        image_path = ?, 
        explanation = ?, 
        status = 1,
        updated_at = NOW()
      WHERE pid = ?`,
      [autoSavedTitle, umlPath, pngPath, explanation, pid]
    );

    /* 8. Response */
    return res.json({
      message: "LLD generated successfully.",
      pid,
      title: autoSavedTitle,
      png: pngPath.replace("src/", ""),
      version: project.version + 1,
      explanation
    });

  } catch (err) {
    console.error("LLD GENERATION ERROR >>>", err);
    return res.status(500).json({ error: "Failed to generate LLD." });
  }
}


/* =======================================================
   TASK 5.1 — RETRIEVING individual
======================================================= */
export async function getProjectById(req, res) {
  try {
    const { pid } = req.params;
    const uid = req.user.uid;

    // Fetch project belonging to this user
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = rows[0];

    // ==========================
    // CASE 1 — DRAFT (status = 0)
    // ==========================
    if (project.status === 0) {
      return res.json({
        status: "draft",
        pid: project.pid,
        pending_questions: {
          q1: project.q1,
          q2: project.q2,
          q3: project.q3,
          q4: project.q4,
          q5: project.q5,
          category_id: project.category_id,
          q7: project.q7,
          q8: project.q8,
          q9: project.q9,
          q10: project.q10,
          q11: project.q11,
          q12: project.q12,
          q13: project.q13,
          q14: project.q14,
          q15: project.q15,
          q16: project.q16,
          q17: project.q17,
          q18: project.q18
        },
        created_at: project.created_at,
        updated_at: project.updated_at
      });
    }

    // =======================
    // CASE 2 — SAVED (status = 1)
    // =======================
    return res.json({
      status: "saved",
      pid: project.pid,
      full_input: project.full_input,
      uml_path: project.uml_path,
      image_path: project.image_path,
      explanation: project.explanation,
      version: project.modification_version,
      modified_input: project.modified_input,
      created_at: project.created_at,
      updated_at: project.updated_at
    });

  } catch (err) {
    console.error("GET PROJECT ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch project." });
  }
}

/* =======================================================
   TASK 5.2 — ALL Drafts
======================================================= */
export async function getDraftProjects(req, res) {
  try {
    const uid = req.user.uid;

    const [rows] = await db.query(
      `SELECT pid, q1, category_id, created_at, updated_at 
       FROM projects 
       WHERE uid = ? AND status = 0
       ORDER BY created_at DESC`,
      [uid]
    );

    return res.json({
      status: "drafts",
      count: rows.length,
      drafts: rows
    });
  } catch (err) {
    console.error("GET DRAFTS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch drafts." });
  }
}

/* =======================================================
   TASK 5.3 — RETRIEVING
======================================================= */
export async function getSavedProjects(req, res) {
  try {
    const uid = req.user.uid;

    const [rows] = await db.query(
      `SELECT pid, full_input, image_path, explanation, modification_version, created_at, updated_at
       FROM projects 
       WHERE uid = ? AND status = 1
       ORDER BY updated_at DESC`,
      [uid]
    );

    return res.json({
      status: "saved",
      count: rows.length,
      saved_projects: rows
    });
  } catch (err) {
    console.error("GET SAVED ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch saved projects." });
  }
}

/* =======================================================
   TASK 8 — Chatbot Modification API
======================================================= */

export async function modifyProject(req, res) {
  try {
    const { pid } = req.params;
    const modification_text = req.body?.modification_text;

    if (!modification_text || !modification_text.trim()) {
      return res.status(400).json({ error: "Modification text is required." });
    }

    // Fetch project belonging to this user
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, req.user.uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = rows[0];

    // -----------------------------
    // STEP 1 — Append modification
    // -----------------------------
    let updatedModifiedInput = project.modified_input || "";
    updatedModifiedInput += `\n- ${modification_text}`;

    // -----------------------------
    // STEP 2 — Build NEW full input
    // -----------------------------
    const combinedInput = `
${project.full_input}

MODIFICATIONS BY USER:
${updatedModifiedInput}
    `.trim();

    // -----------------------------
    // STEP 3 — Summarize the idea
    // -----------------------------
    const summary = await summarizeIdea(combinedInput);

    // -----------------------------
    // STEP 4 — Generate UML from summary
    // -----------------------------
    const daiOutput = await generateLLDFromSummary(summary);

    const explanation = daiOutput.explanation || "";
    let umlBody = daiOutput.uml || "";
    umlBody = umlBody.replace(/@startuml/gi, "").replace(/@enduml/gi, "").trim();

    const finalUML = wrapUML(umlBody);

    // -----------------------------
    // STEP 5 — Save UML + PNG
    // -----------------------------
    const umlDir = "src/storage/uml";
    const diagramsDir = "src/storage/diagrams";

    const fileId = `${pid}_${Date.now()}`;
    const umlPath = `${umlDir}/${fileId}.uml`;
    const pngPath = `${diagramsDir}/${fileId}.png`;

    fs.writeFileSync(umlPath, finalUML, "utf-8");

    const generatedPngPath = await generatePNG(umlPath);

    // -----------------------------
    // STEP 6 — Increment version
    // -----------------------------
    let version = project.modification_version || "1.0.0";
    let parts = version.split(".").map(n => parseInt(n));
    parts[2] += 1;
    let newVersion = parts.join(".");

    // -----------------------------
    // STEP 7 — Update database
    // -----------------------------
    await db.query(
      `UPDATE projects 
       SET modified_input=?, 
           modification_version=?, 
           uml_path=?, 
           image_path=?, 
           explanation=?,
           updated_at=CURRENT_TIMESTAMP
       WHERE pid=?`,
      [
        updatedModifiedInput,
        newVersion,
        umlPath,
        generatedPngPath,
        explanation,
        pid
      ]
    );

    return res.json({
      message: "Project modified and regenerated successfully.",
      pid,
      version: newVersion,
      summary,
      uml: finalUML,
      png: generatedPngPath,
      explanation
    });

  } catch (err) {
    console.error("MODIFY PROJECT ERROR >>>", err);
    return res.status(500).json({ error: "Failed to modify project." });
  }
}




/* ============================================================
   TASK 9 — DELETE PROJECT BY PID 
============================================================ */
export async function deleteProject(req, res) {
  try {
    const { pid } = req.params;
    const uid = req.user.uid;

    // Check if project exists AND belongs to this user
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [pid, uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found or unauthorized." });
    }

    // Delete project (UML + PNG are not deleted but can be if needed)
    await db.query("DELETE FROM projects WHERE pid = ?", [pid]);

    return res.json({
      message: "Project deleted successfully.",
      pid: pid
    });

  } catch (err) {
    console.error("DELETE PROJECT ERROR >>>", err);
    return res.status(500).json({ error: "Failed to delete project." });
  }
}

