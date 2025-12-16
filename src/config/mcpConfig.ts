import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mcpConfig = {
  projectRoot:
    process.env.PROJECT_ROOT || path.join(__dirname, "../../demo-project"),
};
