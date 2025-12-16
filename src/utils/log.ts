import fs from "fs";

// File logging for debug
const logFile = "C:/dev/nodeJS/mcp-demo/server-debug.log";

export const log = (
  msg: string,
  level: "INFO" | "ERROR" | "DEBUG" = "INFO"
) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${msg}\n`;
  fs.appendFileSync(logFile, logMessage);
  if (level === "ERROR") {
    console.error(logMessage);
  }
};
