const chalk = require("chalk");
const figlet = require("figlet");
const readline = require('readline');
const NutParser = require("./nut-parser")
const NutListener = require("./nut-listener")
const { Parser, Lexer, createToken } = require("chevrotain")

// reuse the same parser instance.
const listener = new NutListener()
const parser = new NutParser(listener)


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "mast>"
});


const init = () => {
    console.log(chalk.green(
        figlet.textSync("Mast", {font: "DOS Rebel", kerning: "fitted"})
    ))
}

const main = async () => {
    init();
    rl.prompt()
}


const load = createToken({ name: "load", pattern: /load/ })
const list = createToken({ name: "list", pattern: /list/ })
const WhiteSpace = createToken({name: "WhiteSpace", pattern: /[ \t\n\r]+/,group: Lexer.SKIPPED})
const file = createToken({ name: "file", pattern: /[\w+\/\.]+/ })

const allTokens = [
    load,
    list,
    WhiteSpace,
    file
]
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

        $.RULE("loadCmd", () => {
            $.CONSUME(load)
            let fileName = $.CONSUME(file).image
            try {
                
                let out = parser.parseFile(fileName)
                console.log(`Lex Errors: ${out.lexErrors.length} Parse errors: ${out.parseErrors.length}`)
                return true;      
            } catch(e) {
                console.log(e.message)
            }
        })
    }
}
cmdLine = new CommandParser()

rl.on('line', (line) => {
    // could have another parser here
    let out = cmdLine.parse(line)
    if (out.value) {
        console.log(out.value)
    } else {
        console.log(chalk.red(`WHAT ${line}???`))
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  });

main()