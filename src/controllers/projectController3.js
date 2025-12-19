import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import db from "../config/db.js";
import PDFDocument from "pdfkit";

const __dirname = path.resolve();

// Ensure folders exist
const PACKAGE_DIR = "src/storage/packages";
if (!fs.existsSync(PACKAGE_DIR)) fs.mkdirSync(PACKAGE_DIR, { recursive: true });

// ---------------------------------------------
//  CREATE PROJECT PACKAGE (ZIP)
// ---------------------------------------------
export async function createProjectPackage(req, res) {
  try {
    const { pid } = req.params;

    // 1️⃣ Fetch project data
    const [projectRows] = await db.query(
      "SELECT * FROM projects WHERE pid = ?",
      [pid]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = projectRows[0];

    // 2️⃣ Fetch founder details
    const [userRows] = await db.query(
      "SELECT name, email, phone, linkedin_url FROM users WHERE uid = ?",
      [project.uid]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: "Founder not found." });
    }

    const founder = userRows[0];

    // ---------------------------------------------
    // 3️⃣ Generate JSON File (project.json)
    // ---------------------------------------------
    const projectJSON = {
      pid: project.pid,
      project_title: project.project_title,
      summary: project.explanation,
      lld: project.full_input,
      uml_file: project.uml_path,
      image_file: project.image_path,
      modification_version: project.modification_version
    };

    const jsonContent = JSON.stringify(projectJSON, null, 2);

    // ---------------------------------------------
    // 4️⃣ Generate summary.txt
    // ---------------------------------------------
    const summaryText = project.explanation || "No summary available.";

    // ---------------------------------------------
    // 5️⃣ Generate lld.txt
    // ---------------------------------------------
    const lldText = project.full_input || "No LLD available.";

    // ---------------------------------------------
    // 6️⃣ Generate founder_details.txt
    // ---------------------------------------------
    const founderText = `
Name: ${founder.name}
Email: ${founder.email}
Phone: ${founder.phone}
LinkedIn: ${founder.linkedin_url}
Project Title: ${project.project_title}
`;

    // ---------------------------------------------
    // 7️⃣ Load PNG Image
    // ---------------------------------------------
    const imagePath = project.image_path;
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Project image not found." });
    }

    // ---------------------------------------------
    // 8️⃣ Generate PDF (project.pdf)
    // ---------------------------------------------
    const pdfPath = path.join(PACKAGE_DIR, `project_${pid}_${Date.now()}.pdf`);
    await generatePDFFile(pdfPath, project, imagePath);

    // ---------------------------------------------
    // 9️⃣ Create ZIP package
    // ---------------------------------------------
    const zip = new AdmZip();

    const zipFilename = `project_package_${pid}_${Date.now()}.zip`;
    const zipPath = path.join(PACKAGE_DIR, zipFilename);

    // Add JSON file
    zip.addFile("project.json", Buffer.from(jsonContent, "utf8"));

    // Add summary.txt
    zip.addFile("summary.txt", Buffer.from(summaryText, "utf8"));

    // Add LLD text
    zip.addFile("lld.txt", Buffer.from(lldText, "utf8"));

    // Add founder details
    zip.addFile("founder_details.txt", Buffer.from(founderText, "utf8"));

    // Add PNG image
    zip.addLocalFile(imagePath);

    // Add PDF
    zip.addLocalFile(pdfPath);

    // Write ZIP
    zip.writeZip(zipPath);

    // ---------------------------------------------
    // 🔟 Save zip path to DB
    // ---------------------------------------------
    await db.query(
      "UPDATE projects SET package_path = ? WHERE pid = ?",
      [zipPath, pid]
    );

    // ---------------------------------------------
    // 1️⃣1️⃣ Response
    // ---------------------------------------------
    return res.json({
      message: "Project package created successfully.",
      zip_path: zipPath,
      download_url: `/packages/${zipFilename}`
    });

  } catch (err) {
    console.error("PACKAGE CREATION ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to create project package.",
      details: err.message
    });
  }
}

// --------------------------------------------------
// Helper: Generate PDF for the project
// --------------------------------------------------
async function generatePDFFile(pdfPath, project, imgPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      doc.fontSize(20).text(project.project_title, { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text("Project Summary:", { underline: true });
      doc.fontSize(12).text(project.explanation || "No summary.");
      doc.moveDown(2);

      doc.addPage();
      doc.fontSize(14).text("UML Diagram:", { underline: true });

      if (fs.existsSync(imgPath)) {
        doc.image(imgPath, { fit: [500, 600], align: "center" });
      } else {
        doc.fontSize(12).text("Diagram image not found.");
      }

      doc.end();
      stream.on("finish", resolve);
    } catch (err) {
      reject(err);
    }
  });
}

// src/controllers/projectController3.js
import util from "util";

// Ensure folders exist
const EXPORT_JSON_DIR = path.join("src", "storage", "export", "json");
const EXPORT_PDF_DIR = path.join("src", "storage", "export", "pdf");

if (!fs.existsSync(EXPORT_JSON_DIR)) fs.mkdirSync(EXPORT_JSON_DIR, { recursive: true });
if (!fs.existsSync(EXPORT_PDF_DIR)) fs.mkdirSync(EXPORT_PDF_DIR, { recursive: true });




