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
};

module.exports = RULES;