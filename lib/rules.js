const RULES = {
    noVar: {
        message: "Avoid using 'var'. Use 'let' or 'const' instead.",
        check(node) {
            return node.type === "VariableDeclaration" && node.kind === "var";
        },
    },
    noConsoleLog: {
        message: "Avoid using 'console.log'.",
        check(node) {
            return (
                node.type === "CallExpression" &&
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
                node.type === "VariableDeclaration" &&
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
        check(node, source) {
            const lines = source.split("\r\n");
            lines.forEach((line, index) => {
                if (line.trim().length == 0) return;
                const leadingSpaces = line.search(/\S|$/);
                if (leadingSpaces % 4 !== 0) return true;
            });
        },
    },
    noTrailingWhitespace: {
        message: "Trailing whitespace detected.",
        check(node, source) {
            const lines = source.split("\r\n");
            return lines.some(line => /[ ]+$/.test(line))
        },
    },

    preferConst: {
        message: "Use 'const' instead of 'let' for variables that are not reassigned.",
        check(node) {
            if (node.type === "VariableDeclaration" && node.kind === "let") {
                const isReassigned = node.declarations.some((decl) => decl.init);
                if (!isReassigned) {
                    return true;
                }
            }
            return false;
        },
    },

    noEmptyBlocks: {
        message: "Empty block statement is not allowed.",
        check(node) {
            return node.type === "BlockStatement" && node.body.length === 0;
        },
    },

    useTripleEquals: {
        message: "Use '===' instead of '=='.",
        check(node) {
            return (
                node.type === "BinaryExpression" &&
                (node.operator === "==" || node.operator === "!=")
            );
        },
    },
};

module.exports = RULES;