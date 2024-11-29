const ESPREE = require("espree");

function parseCode(code) {
    return ESPREE.parse(code, {
        ecmaVersion: 2023,
        sourceType: "module",
        loc: true,
        tokens: true
    });
}

module.exports = { parseCode };