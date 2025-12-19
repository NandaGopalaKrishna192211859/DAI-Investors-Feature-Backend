// only diagramming ai code - uncomment below code

import axios from "axios";
import fs from "fs";

const DIAGRAMMING_AI_URL = process.env.DIAGRAMMING_AI_ENDPOINT;
const DIAGRAMMING_AI_KEY = process.env.DIAGRAMMING_AI_KEY;

/* ================================================================
   STEP 1 — SUMMARIZE THE INPUT (Q1–Q18)
================================================================ */
export async function summarizeIdea(fullInput) {
  try {
    const prompt = `
Summarize this startup idea in 3-4 simple sentences.
Make it clear, short, and beginner-friendly.
Focus on: users, features, flows, goals.

"${fullInput}"

Return ONLY the summary text. No bullets. No numbering.
    `;

    const res = await axios.post(
      `${DIAGRAMMING_AI_URL}?key=${DIAGRAMMING_AI_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    let summary =
      res?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // debug save
    fs.writeFileSync("src/storage/debug/summary.txt", summary);

    return summary;
  } catch (err) {
    console.error("SUMMARY ERROR >>>", err.response?.data || err.message);
    throw err;
  }
}

/* ================================================================
   STEP 2 — GENERATE UML FROM SUMMARY
================================================================ */
export async function generateLLDFromSummary(summary) {
  try {
    const prompt = `
Generate a valid PlantUML Low Level Design (LLD) for this app:

"${summary}"

Return STRICT JSON ONLY:
{
"uml": "PlantUML content WITHOUT @startuml or @enduml",
"explanation": "Start with: Low level design contains ..."
}

UML RULES:
- At least 16 meaningful components.
- Include classes, attributes, methods.
- Include interfaces.
- Include valid relationships:
  A -- B, A --> B, A <|-- B, A *-- B, A o-- B.
- Use List, ArrayList, HashMap when suitable.
- Include 5–6 logical packages.
- Include database schema as classes (PK, FK).
- Include 1 package named API with simple note blocks.

FORMAT MUST BE:
package Name {
 class X {
   attributes...
   methods...
 }
 interface Y {
   methods...
 }
}

NOTES RULES (STRICT):
- Notes MUST attach to a class or use "note as ID".
- Valid examples:
    note as Api1
      POST /orders
    end note

    note right of OrderService
      GET /orders/:id
    end note
- Floating notes like "note left" or "note right" without target ARE NOT ALLOWED.


Relationships must be valid and placed outside packages.

Return ONLY JSON.`;

    const res = await axios.post(
        `${DIAGRAMMING_AI_URL}?key=${DIAGRAMMING_AI_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );


    let text = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // save raw
    fs.writeFileSync("src/storage/debug/raw_uml_response.txt", text);

    // remove fencing
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    // extract JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Diagramming AI did not return JSON.");
    text = match[0];

    // fix trailing commas
    text = text.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    return JSON.parse(text);
  } catch (err) {
    console.error("GENERATE UML ERROR >>>", err.response?.data || err.message);
    throw err;
  }
}


