import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Convert ES Module paths correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const source = path.join(__dirname, "public", "_redirects");
const destination = path.join(__dirname, "dist", "_redirects"); // Use "dist" for Vite
async function copyRedirects() {
  try {
    await fs.copyFile(source, destination);
    console.log("_redirects file copied successfully to dist folder!");
  } catch (err) {
    console.error("Error copying _redirects file:", err.message);
  }
}
// Execute the function
copyRedirects();