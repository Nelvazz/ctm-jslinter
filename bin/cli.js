#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
require("colors");
const { lint } = require("../lib/linter");
const rules = require("../lib/rules");
const config = require(path.resolve("./linter.config.json"));

const [,, filePath] = process.argv;

if (!filePath) {
  console.error("Error: No file specified.".red);
  process.exit(1);
}

const code = fs.readFileSync(path.resolve(filePath), "utf8");
const results = lint(code, rules, config);

if (results.length === 0) {
  console.log("✅ No issues found!".green);
} else {
  console.log("❌ Issues detected:".red);
  results.forEach((issue, idx) =>
    console.log(`${idx + 1}. ${issue.message}`.yellow)
  );
}
