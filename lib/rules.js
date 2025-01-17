const PATH = require("path");
const FS = require("fs");
const CONFIG = FS.existsSync(PATH.resolve("./linter.config.json")) ? require(PATH.resolve("./linter.config.json")) : require("../linter.config.json");
const RULES = {
    noVar: {
        message: "Avoid using 'var'. Use 'let' or 'const' instead.",
        check(node) {
            return {
                status: node?.type === "VariableDeclaration" && node.kind === "var",
                lines: node?.loc?.start?.lines
            }
        },
    },
    noConsoleLog: {
        message: "Avoid using 'console.log'.",
        check(node) {
            return {
                status: (
                    node?.type === "CallExpression" &&
                    node.callee.type === "MemberExpression" &&
                    node.callee.object.name === "console" &&
                    node.callee.property.name === "log"
                ),
                status: node?.loc?.start?.lines
            }
        },
    },
    constantCaps: {
        message: "Constant variable need to be in caps only.",
        check(node) {
            return {
                status: (
                    node?.type === "VariableDeclaration" &&
                    node.kind === "const" &&
                    node.declarations[0].id.name?.match(/[^A-Z]/g)?.length
                ),
                lines: node?.loc?.start?.line
            }
        },
    },
    consistentIndentation: {
        message: "Inconsistent indentation detected.",
        check(config, source) {
            let bool = false;
            let lines;
            const LINES = source.split("\r\n");
            LINES.forEach((line, index) => {
                if (line.trim().length === 0) return;
                const SPACES = line.search(/\S|$/);
                if (SPACES % config !== 0) return lines = index, bool = true;
            });
            return {
                status: bool,
                lines: lines
            }
        },
    },
    noTrailingWhitespace: {
        message: "Trailing whitespace detected.",
        check(node, source) {
            const LINES = source.split("\r\n");
            return {
                status: LINES.some(line => /[ ]+$/.test(line)),
                lines: node?.loc?.start?.lines
            }
        },
    },
    preferConst: {
        message: "Use 'const' instead of 'let' for variables that are not reassigned.",
        check(node) {
            return {
                status: (
                    node?.type === "VariableDeclaration" &&
                    node.kind === "let" &&
                    !node.declarations.some((decl) => decl.init)
                ),
                lines: node?.loc?.start?.line
            }
        },
    },
    noEmptyBlocks: {
        message: "Empty block statement is not allowed.",
        check(node) {
            return {
                status: node?.type === "BlockStatement" && node.body.length === 0,
                lines: node?.loc?.start?.lines
            }
        },
    },
    useTripleEquals: {
        message: "Use '===' instead of '=='.",
        check(node) {
            return {
                status: (
                    node?.type === "BinaryExpression" &&
                    (node.operator === "==" || node.operator === "!=")
                ),
                lines: node?.loc?.start?.lines
            }
        },
    },
    fileNamingConvention: {
        message: "File name '{filename}' does not follow the required naming convention.",
        check(filename) {
            return {
                status: !/^[a-z]+(?:[A-Z]{1}[a-z]+)*\.js$/.test(filename),
                lines: ''
            }
        },
    },
    maxLinesPerFunction: {
        message: `Function exceeds the maximum allowed lines (${CONFIG.rules['maxLinesPerFunction']}).`,
        check(node) {
            if ((node?.type === "FunctionDeclaration" || node?.type === "ArrowFunctionExpression") &&
                (node.loc.end.line - node.loc.start.line - 1) > CONFIG.rules['maxLinesPerFunction']) return {
                    status: true,
                    lines: node?.loc?.start?.lines
                }
            return {
                status: false,
                lines: ''
            }
        },
    },
};

module.exports = RULES;