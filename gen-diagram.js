
const spsParse = require("./sps-parse")
const fs = require("fs")
const path = require("path")
const chevrotain = require("chevrotain")
// extract the serialized grammar.
const parserInstance = spsParse.parser
const serializedGrammar = parserInstance.getSerializedGastProductions()

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar)

// Write the HTML file to disk
const outPath = path.resolve(__dirname, "./")
fs.writeFileSync(outPath + "/generated_diagrams.html", htmlText)