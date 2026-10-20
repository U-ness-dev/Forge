#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

run("git add -A");

const staged = run("git diff --cached --name-only");
if (!staged) {
  console.log("Nothing to deploy — working tree is clean.");
  process.exit(0);
}

const files = staged.split(/\r?\n/).filter(Boolean);
const MAX = 12;
let listed = files.slice(0, MAX).join(", ");
if (files.length > MAX) {
  listed += ` (+${files.length - MAX} more)`;
}
const message = `deploy: ${listed}`;

run(`git commit -m ${JSON.stringify(message)}`);
run("git push origin HEAD:main");

const hash = run("git rev-parse --short HEAD");
console.log(`Deployed commit ${hash} to main.`);
console.log("CI is building and deploying — watch:");
console.log("https://github.com/U-ness-dev/Forge/actions");
