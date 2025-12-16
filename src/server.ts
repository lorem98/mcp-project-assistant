import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { reviewBranchName } from "./tools/reviewBranchName.js";
import { log } from "./utils/log.js";
import {
  checkConventionalCommit,
  commitInputSchema,
} from "./tools/checkConventionalCommit.js";
import { mcpConfig } from "./config/mcpConfig.js";

async function main() {
  try {
    log("Starting MCP server...", "INFO");
    log(`Project Root: ${mcpConfig.projectRoot}`, "INFO");

    const server = new McpServer({
      name: "mcp-project-assistant",
      version: "1.0.0",
    });

    log("Server instance created successfully!", "INFO");

    // --- TOOL 1: review_branch_name ---
    server.registerTool(
      "review_branch_name",
      {
        description:
          "Checks if the branch name respects the conventions <type>/<JIRA-ID>-description.",
        inputSchema: z.object({
          name: z.string().describe("Branch name to check"),
        }),
      },
      async ({ name }: { name: string }) => {
        try {
          log(`Reviewing branch name: ${name}`, "DEBUG");
          const result = await reviewBranchName(name, mcpConfig.projectRoot);
          const status = result.valid
            ? "✅ Valid branch name ✅"
            : "❌ Invalid branch name ❌";
          const text = `${status}\n${result.message}`;

          return {
            content: [{ type: "text", text }],
          };
        } catch (err) {
          log(`Error in review_branch_name: ${err}`, "ERROR");
          throw err;
        }
      }
    );

    // --- TOOL 2: check_conventional_commit ---
    server.registerTool(
      "check_conventional_commit",
      {
        description:
          "Validates a commit message using Conventional Commits rules.",
        inputSchema: commitInputSchema,
      },
      async ({ message }) => {
        try {
          const result = await checkConventionalCommit(message);
          const status = result.valid ? "🟢 Valid commit" : "❌ Invalid commit";

          return {
            content: [{ type: "text", text: `${status}\n${result.message}` }],
          };
        } catch (err) {
          log(`Error in check_conventional_commit: ${err}`, "ERROR");
          throw err;
        }
      }
    );

    log("All tools registered successfully", "INFO");

    const transport = new StdioServerTransport();
    await server.connect(transport);

    log("Server connected and ready", "INFO");
  } catch (err) {
    log(`Fatal error in main: ${err}`, "ERROR");
    throw err;
  }
}

main().catch((err) => {
  console.error("Error starting MCP server:", err);
  log(`FATAL: ${err}`, "ERROR");
  process.exit(1);
});
