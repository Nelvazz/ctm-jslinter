#!/usr/bin/env node

const FS = require("fs");
const PATH = require("path");
require("colors");
const { lint } = require("../lib/linter");
const RULES = require("../lib/rules");
const CONFIG = require(PATH.resolve("./linter.config.json"));

const [,, PARAMETER] = process.argv;

if (!PARAMETER) {
    console.error("Error: No file specified.".red);
    process.exit(1);
}

switch (PARAMETER) {
    case '-all':
    case '-a':
        const FILES = getAllFiles(process.cwd());
        FILES.forEach(lintFile);
        break;
    default:
        const TARGET = PATH.resolve(PARAMETER);
        if (!FS.existsSync(TARGET)) {
            console.error("Error: This file or folder does not exist.".red);
            process.exit(1);
        }
        const STAT = FS.statSync(TARGET);

        if (STAT.isDirectory()) {
            const FILES = getAllFiles(TARGET);
            FILES.forEach(lintFile);
        } else {
            lintFile(TARGET);
        }
        break;
}

function getAllFiles(folderPath) {
    const FILES = [];
    const ITEMS = FS.readdirSync(folderPath);

    for (const ITEM of ITEMS) {
        const FULLPATH = PATH.join(folderPath, ITEM);
        const STAT = FS.statSync(FULLPATH);

        if (STAT.isDirectory() && !CONFIG.ignore.some(word => FULLPATH.includes(word))) {
            FILES.push(...getAllFiles(FULLPATH));
        } else if (ITEM.endsWith(".js")) {
            FILES.push(FULLPATH);
        }
    }
    return FILES;
}

function lintFile(file) {
    const CODE = FS.readFileSync(PATH.resolve(file), "utf8");
    const RESULTS = lint({
        name: PATH.parse(file).base,
        content: CODE
    }, RULES, CONFIG);

    if (RESULTS.length === 0) {
        console.log(`-`.gray+` ${file.replace(process.cwd(), '')} : ✅ No issues found!`.green);
    } else {
        console.log(`┌`.gray+` ${file.replace(process.cwd(), '')} : ❌ Issues detected`.red);
        RESULTS.forEach((issue, idx) =>
            console.log(`${RESULTS.length !== idx + 1 ? "├" : "└"}`.gray+` ${idx + 1}. ${issue.message}`.yellow)
        );
    }
}
