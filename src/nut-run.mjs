import {NutParser} from "./nut-parser.js"
import {NutListener} from "./nut-listener.js"
import { Runner } from "./nut-commands-local.js"
import {NutVisitor} from './nut-visitor.js'
import path from 'path';
import { readFile } from 'fs';

// reuse the same parser instance.
const listener = new NutListener()
const parser = new NutParser(listener)
const runner = new Runner()


//const myVisitorInstance = new myCustomVisitor()
const visitor = new NutVisitor(listener)


function run(fileNme) {
    try {
        listener.reset()
        let out = parser.parseFile(fileName)
        console.log(`Lex Errors: ${out.lexErrors.length} Parse errors: ${out.parseErrors ? out.parseErrors.length : 'not run'}`)
        for (let le of out.lexErrors) {
            console.log(`${le.line}:${le.column} - ${le.message}`)
        }
        for (let pe of out.parseErrors) {
            console.log(`${pe.token.startLine}:${pe.token.startOffset} - ${pe.message}`)
        }
        visitor.visit(out.value)
        runner.runStory(listener)


        return true;
    } catch (e) {
        console.log(e.message)
        throw e
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

let fileName = process.argv[2]
//fileName = fileName ? fileName : './tests/sample/flow.nut'
//fileName = fileName ? fileName : './tests/sample/flow-do.nut'
//fileName = fileName ? fileName : './tests/sample/groundcontrol.nut'
//fileName = fileName ? fileName : './tests/sample/sets.nut'
fileName = fileName ? fileName : './tests/sample/choice.nut'
//fileName = fileName ? fileName : '../harold.nut' 
//fileName = fileName ? fileName : './tests/parse/for.nut'

fileName = path.resolve(fileName)

run(fileName)