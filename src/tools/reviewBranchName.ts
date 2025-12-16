import fs from "fs/promises";
import path from "path";
import { log } from "../utils/log.js";

export interface BranchReviewResult {
  valid: boolean;
  message: string;
}

export async function reviewBranchName(
  name: string,
  baseDir: string
): Promise<BranchReviewResult> {
  // Rule: <type>/<JIRA-ID>-description
  const pattern = /^([a-z]+)\/([A-Z]+-\d+)-([a-z0-9-]+)$/;

  const match = name.match(pattern);
  if (!match) {
    const extra = await tryReadContributingHint(baseDir);
    return {
      valid: false,
      message:
        "Invalid format. Expected: <type>/<JIRA-ID>-short-description, e.g.: feature/PROJ-123-add-login" +
        (extra ? `\n\nGuidelines from CONTRIBUTING.md:\n${extra}` : ""),
    };
  }

  const [, type, jiraId, desc] = match;
  const allowedTypes = ["feature", "bugfix", "hotfix", "chore"];

  if (!allowedTypes.includes(type)) {
    return {
      valid: false,
      message: `Invalid branch type: ${type}. Allowed types: ${allowedTypes.join(
        ", "
      )}`,
    };
  }

  return {
    valid: true,
    message: `Branch complies with the basic rules.\nType: ${type}\nTicket: ${jiraId}\nDescription: ${desc}`,
  };
}

async function tryReadContributingHint(
  baseDir: string
): Promise<string | null> {
  try {
    const contribPath = path.join(baseDir, "CONTRIBUTING.md");
    log(`Reading CONTRIBUTING.md from: ${contribPath}`, "DEBUG");

    await fs.access(contribPath);
    const contribRaw = await fs.readFile(contribPath, "utf8");
    const lines = contribRaw.split("\n");
    const filtered = lines
      .filter((l) => /branch|naming|type|format/i.test(l))
      .slice(0, 8)
      .join("\n");
    return filtered || null;
  } catch (err) {
    log(`Could not read CONTRIBUTING.md: ${err}`, "DEBUG");
    return null;
  }
}
