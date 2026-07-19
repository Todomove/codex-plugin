#!/usr/bin/env node
"use strict";

// Reports a session-lifecycle event to Todomove's coding-tool-plugin endpoint
// (POST /api/v1/ai/runs/active/state). See docs/m10_ai_delegation_plan.md, Phase 2
// step 4. Never blocks or fails the coding tool's own flow: any error here is logged to
// stderr and swallowed — a broken Todomove connection must not break the user's session.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const EVENT = process.argv[2];
const CONFIG_PATH = path.join(os.homedir(), ".todomove", "config.json");
const TIMEOUT_MS = 5000;
const API_BASE_URL = "https://todomove.ru/api/v1";

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function drainStdin() {
  // The hook host writes a JSON payload we don't need (the connector token already
  // identifies the one active run — see "one agent runs one task" in the plan). Still
  // read and discard it so the host isn't left writing to a pipe nobody reads.
  try {
    fs.readFileSync(0);
  } catch {
    // No stdin (e.g. a manual test run) — nothing to drain.
  }
}

async function main() {
  drainStdin();

  if (!EVENT) {
    process.exit(0);
  }

  const config = loadConfig();
  if (!config || !config.token) {
    process.stderr.write(
      `todomove plugin: no valid config at ${CONFIG_PATH} (need "token"), skipping ${EVENT}\n`,
    );
    process.exit(0);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/ai/runs/active/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify({ event: EVENT }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      process.stderr.write(`todomove plugin: ${EVENT} -> HTTP ${res.status}\n`);
    }
  } catch (err) {
    process.stderr.write(`todomove plugin: ${EVENT} failed: ${err.message}\n`);
  }

  process.exit(0);
}

main();
