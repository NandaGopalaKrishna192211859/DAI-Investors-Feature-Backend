import db from "../config/db.js";
import fs from "fs";
import path from "path";

export async function getProjectPackage(req, res) {
  try {
    const { pid } = req.params;

    // 1️⃣ Fetch project + founder details
    const [rows] = await db.query(
      `
      SELECT 
        p.pid,
        p.project_title,
        p.full_input AS lld,
        p.explanation AS summary,
        p.uml_path,
        p.image_path,
        p.modification_version,
        p.created_at,
        p.updated_at,

        u.uid AS founder_uid,
        u.name AS founder_name,
        u.email AS founder_email,
        u.phone AS founder_phone

      FROM projects p
      JOIN users u ON p.uid = u.uid
      WHERE p.pid = ?
      `,
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = rows[0];

    // 2️⃣ Resolve file paths
    const pngPath = project.image_path
      ? path.join("src", "storage", "diagrams", path.basename(project.image_path))
      : null;

    const umlFilePath = project.uml_path
      ? path.join("src", "storage", "uml", path.basename(project.uml_path))
      : null;

    const pdfFilePath = path.join("src", "storage", "export", "pdf", `${pid}.pdf`);
    const jsonFilePath = path.join("src", "storage", "export", "json", `${pid}.json`);

    // 3️⃣ Return Final Response
    return res.json({
      message: "Project package fetched successfully",

      project: {
        pid: project.pid,
        title: project.project_title,
        version: project.modification_version,
        created_at: project.created_at,
        updated_at: project.updated_at,
      },

      founder: {
        uid: project.founder_uid,
        name: project.founder_name,
        email: project.founder_email,
        phone: project.founder_phone
      },

      contents: {
        summary: project.summary,
        lld: project.lld,
        uml_file: umlFilePath,
        image_file: pngPath,
        pdf_file: pdfFilePath,
        json_file: jsonFilePath
      }
    });

  } catch (err) {
    console.error("PACKAGE ERROR >>>", err);
    return res.status(500).json({
      message: "Failed to fetch project package",
      error: err.message
    });
  }
}
