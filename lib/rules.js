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
            let lines = '';
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
            let bool = false;
            let lines = '';
            const LINES = source.split("\r\n");
            LINES.forEach((line, index) => {
                if (/[ ]+$/.test(line)) return lines = index + 1, bool = true;
            });
            return {
                status: bool,
                lines: lines
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
                lines: node?.loc?.start?.line
            }
        },
    },
    spaceBetweenOperators: {
        message: "Missing spaces before or after operator.",
        check(node, source) {
            const LINES = source.split("\r\n");
            if (node?.type === "BinaryExpression") {
                let regex = [...LINES[node?.loc?.start?.line - 1].matchAll(`\\${node.operator}`)];
                if (regex.length <= 1) {
                    if (LINES[node?.loc?.start?.line - 1][regex[0].index - 1] !== " " || LINES[node?.loc?.start?.line - 1][regex[0].index + regex[0][0].length] !== " ") return {
                        status: true,
                        lines: node?.loc?.start?.line
                    }
                } else {
                    console.log('\n-----')
                    console.log(regex)
                    console.log(node)
                    console.log(LINES[node?.loc?.start?.line - 1])

                    console.log("Index End : " + node?.loc?.end?.column)
                    console.log(LINES[node?.loc?.start?.line - 1][node?.loc?.end?.column])
                }
                // console.log(node?.loc?.start?.line)
                // regex.forEach(operator => {
                    // console.log(LINES[node?.loc?.start?.line - 1])
                    // console.log(LINES[node?.loc?.start?.line - 1][operator.index - 1] !== " ")
                    // console.log(LINES[node?.loc?.end?.line - 1][operator.index + operator[0].length] !== " ")
                    // if (LINES[node?.loc?.start?.line - 1][operator.index - 1] !== " " || LINES[node?.loc?.end?.line - 1][operator.index + operator[0].length] !== " ") return {
                        // status: true,
                        // lines: node?.loc?.start?.line
                    // }
                // })
                /*
                start = node?.loc?.start?.column + (node?.left?.end - node?.left?.start) + ((node?.left?.type === 'BinaryExpression' && node?.left?.right?.type === 'Literal') ? (node?.left?.loc?.end?.column - node?.left?.loc?.start?.column) : 0)//node?.loc?.start?.column + (node?.left?.end - node?.left?.start);
                end = start + node.operator.length + 1;
                // console.log(node?.loc?.start?.column + (node?.left?.end - node?.left?.start) + ((node?.left?.type === 'BinaryExpression' && node?.left?.operator.length > 1) ? node?.left?.operator.length : 0))
                if (node?.left?.type === 'BinaryExpression' && node?.left?.right?.type === 'Literal') console.log(node?.operator + " " + node?.loc?.start?.line)
                if (LINES[node?.loc?.start?.line - 1][start] !== " " || LINES[node?.loc?.start?.line - 1][end] !== " ") {
                    console.log("\n*-----*")
                    console.log("Operator : " + node.operator)
                    console.log("Line : " + node?.loc?.start?.line)
                    console.log("Index Start: " + start)
                    console.log("Index End : " + end)
                    console.log()
                    console.log(LINES[node?.loc?.start?.line - 1])
                    console.log("Code Start : " + LINES[node?.loc?.start?.line - 1][start])
                    console.log("Code End : " + LINES[node?.loc?.start?.line - 1][end])
                    console.log(node)
                    // console.log(regex[0].index)
                }*/
                // if (LINES[node?.loc?.start?.line - 1][start] !== " " || LINES[node?.loc?.start?.line - 1][end] !== " ") return {
                //     status: true,
                //     lines: node?.loc?.start?.line
                // }
            }
            return {
                status: false,
                lines: node?.loc?.start?.line
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
                (node.loc.end.line-node.loc.start.line-1) > CONFIG.rules['maxLinesPerFunction']) return {
                    status: true,
                    lines: node?.loc?.start?.line
                }
            return {
                status: false,
                lines: ''
            }
        },
    },
};

module.exports = RULES;