import { z } from "zod";

export const commitInputSchema = z.object({
  message: z.string().describe("Commit message to validate"),
});

export async function checkConventionalCommit(message: string) {
  const pattern = /^(\w+)(\([\w-]+\))?:\s(.+)$/;
  const match = message.match(pattern);

  if (!match) {
    return {
      valid: false,
      message: `Invalid commit format.
      Expected: <type>(optional-scope): description
      Example: feat(auth): add login flow`,
    };
  }

  const [, type, , desc] = match;

  const allowed = ["feat", "fix", "chore", "refactor", "docs", "test", "style"];

  if (!allowed.includes(type)) {
    return {
      valid: false,
      message: `Invalid commit type: ${type}.
      Allowed types: ${allowed.join(", ")}`,
    };
  }

  return {
    valid: true,
    message: `Commit message is valid.\nType: ${type}\nDescription: ${desc}`,
  };
}
