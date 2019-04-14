  const chalk = require("chalk");
// var chalk = require('ascii-art/kaolin');
var art = require("ascii-art");

// const figlet = require("figlet");
const readline = require('readline');
const NutParser = require("./nut-parser")
const NutListener = require("./nut-listener")
const {runStory} = require("./nut-commands-local")
const { Parser, Lexer, createToken } = require("chevrotain")

// reuse the same parser instance.
const listener = new NutListener()
const parser = new NutParser(listener)
art.Figlet.fontPath = __dirname + '/fonts/';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "mast>"
});


const init = () => {
    // DOS Rebel
     return art.font('M', 'ANSI Shadow', 'green')
    .font('A', 'ANSI Shadow', 'blue')
    .font('S', 'ANSI Shadow', 'yellow')
    .font('T', 'ANSI Shadow', 'magenta').toPromise().then((rendered)=> {
        console.log(chalk.blue('Multi-Audience Storytelling'))
        console.log(rendered);
        console.log(chalk.keyword("orange")('Control your narrative'))
    })
}

const main = async () => {
    await init();
    rl.prompt()
}

const run = createToken({ name: "run", pattern: /run/ })
const exit = createToken({ name: "exit", pattern: /exit/ })
const load = createToken({ name: "load", pattern: /load/ })
const list = createToken({ name: "list", pattern: /list/ })
const WhiteSpace = createToken({name: "WhiteSpace", pattern: /[ \t\n\r]+/,group: Lexer.SKIPPED})
const file = createToken({ name: "file", pattern: /[\w+\/\.]+/ })
const allTokens = [load,run,exit, list,WhiteSpace,file]
const commandLexer = new Lexer(allTokens);

class CommandParser extends Parser {
    constructor() {
        super(allTokens, {outputCst: false})
        this.commands(this)
        this.performSelfAnalysis()
    }
    parse(input) {
        return this.parseFragment(input, "commands")
    }

    parseFragment(input, fragment) {
        const lexResult = commandLexer.tokenize(input)
        if (lexResult.errors.length > 0) {
            return {
                value: undefined, 
                lexErrors: lexResult.errors,
                parseErrors: []
            }    
        }
        // setting a new input will RESET the parser instance's state.
        this.input = lexResult.tokens
        // any top level rule may be used as an entry point
        const value = this[fragment]()
        return {
            value: value, // this is a pure grammar, the value will always be <undefined>
            lexErrors: lexResult.errors,
            parseErrors: this.errors
        }
    }

    commands ($) {
        // This the main entry point
        $.RULE("commands", ()=> {
            return $.OR([
                {ALT: ()=> $.SUBRULE($.loadCmd)},
                {ALT: ()=> $.SUBRULE($.runCmd)},
                {ALT: ()=> $.SUBRULE($.exitCmd)},
                {ALT: ()=> $.SUBRULE($.listCmd)}
            ])
        })

        $.RULE("listCmd", () => {
            $.CONSUME(list)
            for(let k of Object.keys(listener.symTable)) {
                console.log(k)
            }
            return true;
        })

        $.RULE("exitCmd", () => {
            $.CONSUME(exit)
            process.exit()
            return true;
        })

        $.RULE("runCmd", () => {
            $.CONSUME(run)
            // real early days hard coding to run story startup
            runStory(listener)
            return true;
        })

        $.RULE("loadCmd", () => {
            $.CONSUME(load)
            let fileName = $.OPTION(()=> $.CONSUME(file).image)
            fileName = fileName ? fileName : 'tests/sample/hello.nut'
            try {
                
                let out = parser.parseFile(fileName)
                console.log(`Lex Errors: ${out.lexErrors.length} Parse errors: ${out.parseErrors.length}`)
                for (let le of out.lexErrors) {
                    console.log(`${le.line}:${le.offset} - ${le.message}`)
                }
                for (let pe of out.parseErrors) {
                    console.log(`${pe.token.startLine}:${pe.token.startOffset} - ${pe.message}`)
                }
                return true;      
            } catch(e) {
                console.log(e.message)
            }
        })
    }
}
cmdLine = new CommandParser()

rl.on('line', (line) => {
    rl.prompt();
    // could have another parser here
    let out = cmdLine.parse(line)
    if (out.value) {
       // console.log(out.value)
    } else {
        console.log(chalk.red(`WHAT ${line}???`))
    }
    
  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  });

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

main()