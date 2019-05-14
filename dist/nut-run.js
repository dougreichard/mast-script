const NutParser = require("./nut-parser");
const NutListener = require("./nut-listener");
const { Runner } = require("./nut-commands-local");
// reuse the same parser instance.
const listener = new NutListener();
const parser = new NutParser(listener);
const runner = new Runner();
const path = require('path');
function run(fileName) {
    //fileName = fileName ? fileName : '../tests/sample/flow.nut'
    //fileName = fileName ? fileName : '../tests/sample/flow-do.nut'
    //fileName = fileName ? fileName : '../tests/sample/groundcontrol.nut'
    fileName = fileName ? fileName : path.resolve('./tests/sample/choice.nut');
    //fileName = fileName ? fileName : '../harold.nut' 
    try {
        listener.reset();
        let out = parser.parseFile(fileName);
        console.log(`Lex Errors: ${out.lexErrors.length} Parse errors: ${out.parseErrors ? out.parseErrors.length : 'not run'}`);
        for (let le of out.lexErrors) {
            console.log(`${le.line}:${le.column} - ${le.message}`);
        }
        for (let pe of out.parseErrors) {
            console.log(`${pe.token.startLine}:${pe.token.startOffset} - ${pe.message}`);
        }
        runner.runStory(listener);
        return true;
    }
    catch (e) {
        console.log(e.message);
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
run(path.resolve(process.argv[2]));
