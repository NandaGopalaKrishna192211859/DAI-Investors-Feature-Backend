import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import db from "../config/db.js";

// ensure folders exist
const exportDir = {
  png: "src/storage/export/png",
  pdf: "src/storage/export/pdf",
  json: "src/storage/export/json"
};

Object.values(exportDir).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ======================================================
   EXPORT PNG
====================================================== */
export async function exportPNG(req, res) {
  try {
    const { pid } = req.params;

    const [rows] = await db.query(
      "SELECT image_path FROM projects WHERE pid = ?",
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const sourcePath = rows[0].image_path;
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ error: "Image not found on server." });
    }

    const filename = `${pid}_${Date.now()}.png`;
    const exportPath = path.join(exportDir.png, filename);

    fs.copyFileSync(sourcePath, exportPath);

    return res.download(exportPath);
  } catch (err) {
    console.error("EXPORT PNG ERROR >>>", err);
    res.status(500).json({ error: "Failed to export PNG." });
  }
}

/* ======================================================
   EXPORT JSON
====================================================== */
export async function exportJSON(req, res) {
  try {
    const { pid } = req.params;

    const [rows] = await db.query(
      `SELECT pid, project_title, q1, q2, q3, q4, q5,
              full_input, explanation, modification_version,
              uml_path, image_path, created_at, updated_at
       FROM projects
       WHERE pid = ?`,
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = rows[0];
    const filename = `${pid}_${Date.now()}.json`;
    const exportPath = path.join(exportDir.json, filename);

    fs.writeFileSync(exportPath, JSON.stringify(projectData, null, 2));

    return res.download(exportPath);
  } catch (err) {
    console.error("EXPORT JSON ERROR >>>", err);
    res.status(500).json({ error: "Failed to export JSON." });
  }
}

/* ======================================================
   EXPORT PDF
====================================================== */
export async function exportPDF(req, res) {
  try {
    const { pid } = req.params;

    const [rows] = await db.query(
      "SELECT image_path, explanation FROM projects WHERE pid = ?",
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const { image_path, explanation } = rows[0];

    if (!fs.existsSync(image_path)) {
      return res.status(404).json({ error: "UML image not found." });
    }

    const filename = `${pid}_${Date.now()}.pdf`;
    const exportPath = path.join(exportDir.pdf, filename);

    // Create PDF
    const doc = new PDFDocument();
    const pdfStream = fs.createWriteStream(exportPath);
    doc.pipe(pdfStream);

    doc.fontSize(20).text("LLD Export", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("Explanation:", { underline: true });
    doc.fontSize(12).text(explanation);
    doc.moveDown(2);

    doc.addPage();
    doc.fontSize(14).text("UML Diagram:", { underline: true });
    doc.image(image_path, { fit: [500, 600], align: "center" });

    doc.end();

    pdfStream.on("finish", () => {
      return res.download(exportPath);
    });

  } catch (err) {
    console.error("EXPORT PDF ERROR >>>", err);
    res.status(500).json({ error: "Failed to export PDF." });
  }
}
