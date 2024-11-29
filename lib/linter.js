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

function lint(file, rules, config) {
    const AST = parseCode(file.content);
    const ENABLEDRULES = Object.keys(rules).filter((key) => config.rules[key] !== false);
    const ISSUES = [];

    traverse(AST, {
        enter(node) {
            ENABLEDRULES.forEach((ruleKey) => {
                const RULE = rules[ruleKey];
                if (!['noTrailingWhitespace', 'consistentIndentation', 'fileNamingConvention'].includes(ruleKey)) {
                    if (RULE.check(node, file.content)) {
                        // console.log(node)
                        ISSUES.push({ message: RULE.message, node });
                    }
                }
            });
        },
    });
    // Handle Per-line Checks
    if (rules["noTrailingWhitespace"].check('', file.content)) ISSUES.push({ message: rules["noTrailingWhitespace"].message });
    if (rules["consistentIndentation"].check(config.rules['consistentIndentation'], file.content)) ISSUES.push({ message: rules["consistentIndentation"].message });
    if (rules["fileNamingConvention"].check(file.name)) ISSUES.push({ message: rules["fileNamingConvention"].message });
    return ISSUES;
}

module.exports = { lint };