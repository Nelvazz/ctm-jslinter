const PATH = require("path");
const CONFIG = FS.existsSync(PATH.resolve("./linter.config")) ? require(PATH.resolve("./linter.config")) : require("../linter.config.json");
const RULES = {
    noVar: {
        message: "Avoid using 'var'. Use 'let' or 'const' instead.",
        check(node) {
            return node?.type === "VariableDeclaration" && node.kind === "var";
        },
    },
    noConsoleLog: {
        message: "Avoid using 'console.log'.",
        check(node) {
            return (
                node?.type === "CallExpression" &&
                node.callee.type === "MemberExpression" &&
                node.callee.object.name === "console" &&
                node.callee.property.name === "log"
            );
        },
    },
    constantCaps: {
        message: "Constant variable need to be in caps only.",
        check(node) {
            return (
                node?.type === "VariableDeclaration" &&
                node.kind === "const" &&
                node.declarations[0].id.name?.match(/[^A-Z]/g)?.length
            );
        },
    },

    enforceSemicolon: { // Don't work
        message: "Missing semicolon at the end of the statement.",
        check(node, source) {
            return (
                node.type !== "BlockStatement" &&
                node.type !== "FunctionDeclaration" &&
                node.type !== "IfStatement" &&
                node.type !== "ForStatement" &&
                node.type !== "WhileStatement" &&
                !node.tokens?.some((token) => token.type === "Punctuator" && token.value === ";")
            );
        },
    },

    consistentIndentation: {
        message: "Inconsistent indentation detected.",
        check(config, source) {
            let bool = false;
            const LINES = source.split("\r\n");
            LINES.forEach((line, index) => {
                if (line.trim().length === 0) return;
                const SPACES = line.search(/\S|$/);
                if (SPACES % config !== 0) return bool = true;
            });
            return bool;
        },
    },
    noTrailingWhitespace: {
        message: "Trailing whitespace detected.",
        check(node, source) {
            const LINES = source.split("\r\n");
            return LINES.some(line => /[ ]+$/.test(line))
        },
    },

    preferConst: { // Don't work
        message: "Use 'const' instead of 'let' for variables that are not reassigned.",
        check(node) {
            if (node?.type === "VariableDeclaration" && node.kind === "let") {
                const ISREASSIGNED = node.declarations.some((decl) => decl.init);
                if (!ISREASSIGNED) {
                    return true;
                }
            }
            return false;
        },
    },

    noEmptyBlocks: {
        message: "Empty block statement is not allowed.",
        check(node) {
            return node?.type === "BlockStatement" && node.body.length === 0;
        },
    },
    useTripleEquals: {
        message: "Use '===' instead of '=='.",
        check(node) {
            return (
                node?.type === "BinaryExpression" &&
                (node.operator === "==" || node.operator === "!=")
            );
        },
    },

    noMagicNumbers: { // detect lonely numbers, but everywhere even when defined in a constant
        message: "Avoid using magic numbers; consider defining them as constants.",
        check(node) {
            return (
                node?.type === "Literal" &&
                typeof node.value === "number" &&
                node.value !== 0 &&
                node.value !== 1 &&
                node.value !== -1
            );
        },
    },

    /*consistentReturn: {
        message: "Inconsistent return statements detected.",
        check(node) {
            if (node?.type === "FunctionDeclaration" || node?.type === "ArrowFunctionExpression") {
                const hasReturn = node.body.body.some((stmt) => stmt.type === "ReturnStatement");
                if (hasReturn && node.body.body.every((stmt) => stmt.type !== "ReturnStatement")) {
                    return true;
                }
            }
            return false;
        },
    },*/

    noParamReassign: { // Don't work, don't check if variable declared is a parameter
        message: "Do not reassign function parameters.",
        check(node) {
            return node?.type === "AssignmentExpression" && node.left.type === "Identifier" && node.left.name === node.right.name;
        },
    },

    noUnreachableCode: { // Don't work
        message: "Unreachable code detected.",
        check(node) {
            return (
                (node?.type === "ReturnStatement" || node?.type === "ThrowStatement") &&
                node.loc.end.line < node.loc.start.line
            );
        },
    },

    fileNamingConvention: {
        message: "File name '{filename}' does not follow the required naming convention.",
        check(filename) {
            return !/^[a-z]+(?:[A-Z]{1}[a-z]+)*\.js$/.test(filename);
        },
    },
    maxLinesPerFunction: {
        message: `Function exceeds the maximum allowed lines (${CONFIG.rules['maxLinesPerFunction']}).`,
        check(node) {
            if ((node?.type === "FunctionDeclaration" || node?.type === "ArrowFunctionExpression") &&
                (node.loc.end.line - node.loc.start.line - 1) > CONFIG.rules['maxLinesPerFunction']) return true;
            return false;
        },
    },
};

module.exports = RULES;