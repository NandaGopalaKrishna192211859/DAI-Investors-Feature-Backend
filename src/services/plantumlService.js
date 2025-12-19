import { exec } from "child_process";
import path from "path";

export function generatePNG(umlPath) {
  return new Promise((resolve, reject) => {
    const outPath = umlPath.replace(".uml", ".png");
    const cmd = `java -jar plantuml.jar "${umlPath}"`;

    exec(cmd, (err) => {
      if (err) return reject(err);

      resolve(outPath);
    });
  });
}
