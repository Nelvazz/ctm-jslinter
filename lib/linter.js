const { parseCode } = require("./parser");

function traverse(node, visitors) {
    if (visitors.enter) visitors.enter(node);
    for (const KEY in node) {
        const CHILD = node[KEY];
        if (Array.isArray(CHILD)) {
            CHILD.forEach((c) => traverse(c, visitors));
        } else if (CHILD && typeof CHILD === "object") {
            traverse(CHILD, visitors);
        }
    }
}

function lint(code, rules, config) {
    const AST = parseCode(code);
    const ENABLEDRULES = Object.keys(rules).filter((key) => config.rules[key] !== false);
    const ISSUES = [];

    traverse(AST, {
        enter(node) {
            ENABLEDRULES.forEach((ruleKey) => {
                const RULE = rules[ruleKey];
                if (RULE.check(node)) {
                    ISSUES.push({ message: RULE.message, node });
                }
            });
        },
    });
    return ISSUES;
}

module.exports = { lint };