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
                    const CHECK = RULE.check(node, file.content);
                    if (CHECK.status) {
                        ISSUES.push({ message: `Line ${CHECK.lines}: `.gray + `${RULE.message}`, node });
                    }
                }
            });
        },
    });
    // Handle Per-line Checks
    const CHECKWHITESPACE = rules["noTrailingWhitespace"].check('', file.content);
    const CHECKINDENTATION = rules["consistentIndentation"].check(config.rules['consistentIndentation'], file.content);
    const CHECKFILENAME = rules["fileNamingConvention"].check(file.name);
    if (CHECKWHITESPACE.status) ISSUES.push({ message: `Line ${CHECKWHITESPACE.lines}: `.gray + `${rules["noTrailingWhitespace"].message}` });
    if (CHECKINDENTATION.status) ISSUES.push({ message: `Line ${CHECKINDENTATION.lines}: `.gray + `${rules["consistentIndentation"].message}` });
    if (CHECKFILENAME.status) ISSUES.push({ message: `Line ${CHECKFILENAME.lines}: `.gray + `${rules["fileNamingConvention"].message}` });
    return ISSUES;
}

module.exports = { lint };