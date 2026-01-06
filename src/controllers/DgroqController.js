import { cleanUML } from "../services/DgroqService.js";
import fs from "fs";
import util from "util";
import path from "path";
import db from "../config/db.js";
import { exec } from "child_process";
import { callGroq } from "../services/DgroqService.js";
import { generatePNG } from "../services/plantumlService.js";

// ---------------------------
// Version bump helper
// ---------------------------
function bumpVersion(version) {
  if (!version) return "1.0.1";

  let [major, minor, patch] = version.split(".").map(n => parseInt(n, 10));

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    return "1.0.1";
  }

  patch++;
  if (patch >= 10) {
    patch = 0;
    minor++;
  }
  if (minor >= 10) {
    minor = 0;
    major++;
  }

  return `${major}.${minor}.${patch}`;
}

const __dirname = path.resolve();

/* =======================================================
   GENERATE LLD + UML + DIAGRAM (GROQ VERSION)
======================================================= */
export async function DgenerateLLDForProject(req, res) {
  try {
    const pid = req.params.pid;

    // STEP 1 — Fetch project
    const [rows] = await db.query("SELECT * FROM projects WHERE pid = ?", [pid]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    const project = rows[0];

    // STEP 2 — Combine Q1–Q18 for AI
    const fullInput = `
Q1: ${project.q1}
Q2: ${project.q2}
Q3: ${project.q3}
Q4: ${project.q4}
Q5: ${project.q5}

Q7: ${project.q7}
Q8: ${project.q8}
Q9: ${project.q9}
Q10: ${project.q10}
Q11: ${project.q11}
Q12: ${project.q12}
Q13: ${project.q13}
Q14: ${project.q14}
Q15: ${project.q15}
Q16: ${project.q16}
Q17: ${project.q17}
Q18: ${project.q18}
`;

    // STEP 3 — Summary
    const summaryPrompt = `
Summarize this startup idea in 4-5 professional sentences.
Make it clear, short, beginner-friendly.
Focus on users, key features, flows, and goal.

Startup Input:
${fullInput}

Return ONLY the summary text. No bullets. No numbering.
`;
    const summary = await callGroq(summaryPrompt);

    // STEP 4 — LLD
    const lldPrompt = `
Using this startup idea:

${summary}

Create a clear Low-Level Design (LLD) including:
- Modules
- Features
- Data Flow
- Tables
- APIs
- Logic Flow

Write in well-structured plain text.
`;
    const lld = await callGroq(lldPrompt);

    // STEP 5 — UML
    const umlPrompt = `Generate a PlantUML CLASS DIAGRAM.
You are generating a PlantUML class diagram.  
IMPORTANT RULES — MUST FOLLOW STRICTLY:

0. Ensure the diagram looks like a layered architecture by placing each package far apart vertically with clear spacing, and draw arrows flowing only from top packages to bottom packages.

1. The diagram must be 100% standalone.  
   ❌ Do NOT use: !include, !includeurl, !theme, skin libraries, external URLs.  
   Only use @startuml … @enduml.

2. Create 12 packages.  
   Each package MUST contain 4 classes, interfaces, components, and other packages.

3. Every class MUST have:  
   - 4 attributes  
   - 4 operations  
   Attributes must be simple types: int, string, boolean, float.  
   Operations must also be simple and return void, string, int, or boolean.

4. Add EXACTLY 5 notes with stereotype <<api>>.  
   Notes must be attached to any classes.  
   Notes text should be simple (ex: "Handles user API logic").

5. Keep the diagram SIMPLE.  
   Do NOT use generics, collections, templates, interfaces, enums, abstract classes.  
   Use only standard PlantUML syntax: class, package, note, relationships.  
   NO advanced features.

6. Use ONLY these relationship types:  
   - -->  
   - --  
   - ..>  
   (No fancy arrowheads or labels.)

7. Keep names professional & domain-neutral:  
   Example package names:  
   - UserManagement  
   - CoreServices  
   - DataLayer  
   - CommunicationLayer  
   - BillingModule

8. FORMAT MUST BE LIKE THIS (follow structure exactly):

@startuml

package PackageName {
    class ClassName {
        +attribute1: type
        +attribute2: type
        +attribute3: type
        +attribute4: type

        +operation1(): returnType
        +operation2(): returnType
        +operation3(): returnType
        +operation4(): returnType
    }
}

note "API note here" as N1 <<api>>
ClassName .. N1

ClassA --> ClassB
ClassC ..> ClassD

@enduml

---
if their is big stuff happens - remove unnecessary terms and try to keep a neat and clean diagram - don't stress yourself - give me good UML diagram
Now generate the FINAL PlantUML diagram using your own creative structure but MUST obey all rules above.
${lld}

`;

    const umlRaw = await callGroq(umlPrompt);
    const umlText = `@startuml\n${umlRaw || ""}\n@enduml`;

    // STEP 6 — Save UML file
    const umlFilename = `${pid}_${Date.now()}.uml`;
    const umlPath = path.resolve("src/storage/uml", umlFilename);
    fs.writeFileSync(umlPath, umlText);

    // STEP 7 — Generate PNG with ABSOLUTE PATH
    const pngOutputDir = path.resolve("src/storage/diagrams");
    const umlAbsolute = path.resolve(umlPath);

    const cmd = `java -jar plantuml.jar -o "${pngOutputDir}" "${umlAbsolute}"`;
    await new Promise((resolve, reject) => {
      exec(cmd, (err) => (err ? reject(err) : resolve()));
    });

    const diagramFile = umlFilename.replace(".uml", ".png");
    const imageFullPath = path.join("src/storage/diagrams", diagramFile);

    // STEP 8 — Save DB
    await db.query(
      `
      UPDATE projects
      SET 
        explanation = ?, 
        full_input = ?, 
        uml_path = ?, 
        image_path = ?,
        status = 1,
        project_title = 'saved1',
        modification_version = '1.0.0'
      WHERE pid = ?
      `,
      [summary, lld, umlPath, imageFullPath, pid]
    );

    return res.json({
      message: "LLD generated successfully",
      summary,
      lld,
      uml: umlText,
      diagram_url: `/diagrams/${diagramFile}`
    });

  } catch (err) {
    console.error("LLD GENERATION ERROR >>>", err);
    res.status(500).json({ message: "Failed to generate LLD", error: err.message });
  }
}

/* =======================================================
   MODIFY PROJECT (GROQ VERSION)
======================================================= */
export async function DmodifyProject(req, res) {
  try {
    const { pid } = req.params;
    const { modification_text } = req.body;

    if (!modification_text)
      return res.status(400).json({ message: "modified_text is required" });

    // Fetch existing project
    const [rows] = await db.query("SELECT * FROM projects WHERE pid = ?", [pid]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Project not found" });

    const project = rows[0];

    // 1 — Updated Summary
    const summaryPrompt = `
You are updating a startup idea summary.

Original Startup Summary:
${project.explanation || ""}

User Modification Request:
${modification_text}

Task:
Rewrite the startup summary incorporating the user's changes.

Rules:
- 4–5 professional sentences
- Non-technical
- Beginner-friendly
- Focus on users, key features, flows, and overall goal
- Do NOT include LLD, UML, classes, APIs, or technical terms

Return ONLY the updated summary text.
`;

    const updatedSummary = await callGroq(summaryPrompt);

    // 2 — Updated LLD
    const lldPrompt = `
Modify the LLD based on updated summary.

Updated Summary:
${updatedSummary}

Return only LLD text.
`;
    const updatedLLD = await callGroq(lldPrompt);

    // 3 — Updated UML
    const umlPrompt = `
Generate updated PlantUML.
Based on this LLD, generate a valid PlantUML class diagram.

Rules:
- No backticks
- No fences
- Must start with @startuml and end with @enduml
- 5 packages minimum
- 16+ classes minimum
- Each class must have 4 attributes and 4 methods
- Keep diagram simple and error-free
- Use only standard UML syntax

LLD:
${updatedLLD}

Return ONLY UML text.
`;
    let umlText = await callGroq(umlPrompt);
    umlText = cleanUML(umlText);

    // 4 — Save UML File
    const filename = `${pid}_${Date.now()}.uml`;
    const umlPath = path.resolve("src/storage/uml", filename);
    fs.writeFileSync(umlPath, umlText);

    // 5 — Generate PNG
    const pngOutputDir = path.resolve("src/storage/diagrams");
    const umlAbsolute = path.resolve(umlPath);

    const cmd = `java -jar plantuml.jar -o "${pngOutputDir}" "${umlAbsolute}"`;
    await new Promise((resolve, reject) => {
      exec(cmd, (err) => (err ? reject(err) : resolve()));
    });

    const pngFile = filename.replace(".uml", ".png");
    const imageFullPath = `src/storage/diagrams/${pngFile}`;

    // 6 — Version bump
    const newVersion = bumpVersion(project.modification_version);

    // 7 — Save DB
    await db.query(
      `
      UPDATE projects SET
        full_input = ?,
        explanation = ?,
        uml_path = ?,
        image_path = ?,
        updated_at = NOW(),
        modified_input = ?,
        modification_version = ?
      WHERE pid = ?
      `,
      [
        updatedLLD,
        updatedSummary,
        umlPath,
        imageFullPath,
        modification_text,
        newVersion,
        pid
      ]
    );

    return res.json({
      message: "Project modified successfully",
      summary: updatedSummary,
      lld: updatedLLD,
      uml: umlText,
      diagram_url: `/diagrams/${pngFile}`
    });

  } catch (err) {
    console.error("MODIFY PROJECT ERROR >>>", err);
    res.status(500).json({
      message: "Modify project failed",
      error: err.message
    });
  }
}
