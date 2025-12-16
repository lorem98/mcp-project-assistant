# MCP Project Assistant

A small TypeScript toolkit and server that helps automate project scanning, branch/commit checks, and task suggestions. It's intended as the backend toolkit for the MCP (Model Context Protocol) assistant and includes standalone tools that can be run directly or via a small server.

## Highlights

- Scans repositories for `TODO` comments and produces task suggestions.
- Validates branch names and checks conventional commit messages.
- Generates simple task checklists for common workflows.
- Modular tools under `src/tools` and a compiled `build/` output for quick execution.

## Prerequisites

- Node.js 16 or higher
- npm (or yarn)

## Install

```bash
npm install
```

## Available scripts

Scripts are defined in `package.json`:

- `npm run build` — compile TypeScript with `tsc` into `build/`.
- `npm run start` — run the compiled server (`node build/server.js`).
- `npm run dev` — run the TypeScript server directly with `ts-node` (`src/server.ts`).

Run the server in development:

```bash
npm run dev
```

Build and run the compiled server:

```bash
npm run build
npm run start
```

## Usage — tools

Tools are implemented under `src/tools` and a compiled copy lives in `build/tools`.
You can run a compiled tool directly, for example:

```bash
node build/tools/scanProject.js --path ../some-repo
```

Each tool accepts its own CLI options; run with `--help` to see usage where supported.

## Configuration

This project loads environment variables via `dotenv`. Create a `.env` file at the repository root to set values used by the server or tools (for example `PORT` or API keys).

## Development notes

- Source is in `src/` (TypeScript). Build output goes to `build/`.
- Key files:
  - `src/server.ts` — server entrypoint.
  - `src/tools/` — tools and scripts.
  - `config/` — runtime configuration.
- Dependencies used include `@modelcontextprotocol/sdk`, `dotenv`, and TypeScript tooling.

If you add linters or tests, please wire them into `package.json` scripts for convenience.

## Contributing

Contributions welcome. When opening PRs:

- Use clear, descriptive commit messages (conventional commits are encouraged).
- Add tests or at least manual verification steps for new behavior.
- Update the README or docs when behavior or CLI options change.

## License

This repository is available under the MIT License.

---

If you'd like, I can also:

- Add example `package.json` `scripts` for formatting/linting.
- Add a short `CONTRIBUTING.md` with PR checklist.
- Run the server locally and report any runtime errors.

Tell me which of those you'd like next.
