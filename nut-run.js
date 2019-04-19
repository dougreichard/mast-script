const chalk = require("chalk");
// var chalk = require('ascii-art/kaolin');
var art = require("ascii-art");

// const figlet = require("figlet");
const readline = require('readline');
const NutParser = require("./nut-parser")
const NutListener = require("./nut-listener")
const { runStory } = require("./nut-commands-local")

// reuse the same parser instance.
const listener = new NutListener()
const parser = new NutParser(listener)


function run(fileName) {
    //fileName = fileName ? fileName : 'tests/sample/flow-do.nut'
    fileName = fileName ? fileName : 'tests/sample/groundcontrol.nut'
    try {
        listener.reset()
        let out = parser.parseFile(fileName)
        console.log(`Lex Errors: ${out.lexErrors.length} Parse errors: ${out.parseErrors.length}`)
        for (let le of out.lexErrors) {
            console.log(`${le.line}:${le.offset} - ${le.message}`)
        }
        for (let pe of out.parseErrors) {
            console.log(`${pe.token.startLine}:${pe.token.startOffset} - ${pe.message}`)
        }
        runStory(listener)

        return true;
    } catch (e) {
        console.log(e.message)
    }
}
/*
const fs = require("fs")
const path = require("path")
const chevrotain = require("chevrotain")
const serializedGrammar = cmdLine.getSerializedGastProductions()
  
// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar)
 
// Write the HTML file to disk
const outPath = path.resolve(__dirname, "./")
fs.writeFileSync(outPath + "/cmdline_diagrams.html", htmlText)
*/

run()