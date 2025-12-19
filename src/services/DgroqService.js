
import axios from "axios";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// -----------------------------
// PATHS FOR UML + DIAGRAM FILES
// -----------------------------
const UML_FOLDER = path.join("src", "storage", "uml");
const DIAGRAM_FOLDER = path.join("src", "storage", "diagrams");

if (!fs.existsSync(UML_FOLDER)) fs.mkdirSync(UML_FOLDER, { recursive: true });
if (!fs.existsSync(DIAGRAM_FOLDER)) fs.mkdirSync(DIAGRAM_FOLDER, { recursive: true });

// -------------------------------------------------------
// CLEAN OUTPUT — remove markdown, extra whitespace, junk
// -------------------------------------------------------
export function cleanUML(text) {
  if (!text) return "";

  return text
    .replace(/```(plantuml)?/g, "")  // remove ``` blocks
    .replace(/```/g, "")
    .replace(/<think>[\s\S]*?<\/think>/g, "") // remove reasoning sections
    .trim();
}

// -------------------------------------------------------
// ENSURE UML ALWAYS VALID
// -------------------------------------------------------
function ensureValidUML(umlText) {
  if (!umlText || umlText.includes("undefined") || umlText.trim() === "") {
    return `
@startuml
note "AI did not generate UML diagram" as N1
@enduml
`;
  }

  // Ensure @startuml & @enduml exist
  if (!umlText.startsWith("@startuml")) umlText = "@startuml\n" + umlText;
  if (!umlText.endsWith("@enduml")) umlText += "\n@enduml";

  return umlText;
}

// -------------------------------------------------------
// 🔥 GROQ LLM CALL
// -------------------------------------------------------
export async function callGroq(prompt) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content || "";
  } catch (err) {
    console.log("GROQ ERROR >>>", err);
    throw new Error("Groq request failed");
  }
}

// -------------------------------------------------------
// Step 1 — SUMMARIZE IDEA (for headings)
// -------------------------------------------------------
export async function summarizeIdea(projectInputText) {
  const prompt = `
Summarize the startup idea in 5-6 simple sentences.
Return ONLY the summary, no bullets.

Idea:
${projectInputText}
`;

  const result = await callGroq(prompt);
  return result.trim();
}

// -------------------------------------------------------
// Step 2 — GENERATE LLD (text version)
// -------------------------------------------------------
export async function generateLLD(projectFullText) {
  const prompt = `
Generate a clean Low-Level Design (LLD) for this startup.

Include:
- Modules
- Features
- Data Flow
- Technology suggestions
- Database tables
- API routes
- Any required logic flow

Return plain text only. No UML here.

Project description:
${projectFullText}
`;

  const result = await callGroq(prompt);
  return result.trim();
}

// -------------------------------------------------------
// Step 3 — Extract UML from LLD using safe prompt
// -------------------------------------------------------
export async function generateUMLFromLLD(lldText) {
  const prompt = `
Generate ONLY a PlantUML CLASS DIAGRAM.
NO explanation, NO markdown, NO extra text.

Format MUST be EXACTLY:

@startuml
(class diagram elements)
@enduml

If diagram cannot be generated, return:

@startuml
note "No UML generated" as N1
@enduml

LLD:
${lldText}
`;

  let uml = await callGroq(prompt);
  uml = cleanUML(uml);
  uml = ensureValidUML(uml);

  return uml;
}

// -------------------------------------------------------
// Step 4 — Write UML to file and generate PNG from PlantUML
// -------------------------------------------------------
export async function generateUMLDiagram(projectId, umlText) {
  return new Promise((resolve, reject) => {
    const fileName = `${projectId}_${Date.now()}.uml`;
    const filePath = path.join(UML_FOLDER, fileName);

    // save UML file
    fs.writeFileSync(filePath, umlText, "utf8");

    const command = `java -jar plantuml.jar -o "${DIAGRAM_FOLDER}" "${filePath}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("LLD GENERATION ERROR >>>", err);
        return reject(err);
      }
      resolve(fileName.replace(".uml", ".png"));
    });
  });
}

// -------------------------------------------------------
// MASTER FUNCTION FOR CONTROLLER
// -------------------------------------------------------
export async function createFullLLD(projectText, projectId) {
  try {
    const summary = await summarizeIdea(projectText);
    const lld = await generateLLD(projectText);
    const uml = await generateUMLFromLLD(lld);

    const diagramFile = await generateUMLDiagram(projectId, uml);

    return {
      summary,
      lld,
      uml,
      diagramFile
    };

  } catch (err) {
    console.error("FULL LLD ERROR >>>", err);
    throw err;
  }
}

export async function generateLLDFromSummary(summaryText) {
    const prompt = `
Based on this summary, generate a clear and structured Low-Level Design (LLD).
The LLD must include:
- Modules
- Classes with attributes & methods
- Data flow
- API list
- Technology recommendations

Keep it simple, clean, and developer-friendly.

SUMMARY:
${summaryText}

Return only the LLD text.
`;

    return await callGroq(prompt);
}

