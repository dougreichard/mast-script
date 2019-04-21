const { createToken, Lexer } = require("chevrotain")
const { Parser } = require("chevrotain")


const anything = createToken({name: "anything", pattern: /[\w\t ]+/})
const heading = createToken({ name: "heading", pattern: /#/ })
const bold = createToken({ name: "bold", pattern: /\*\*/ })
//const value = createToken({name: "value", pattern: /\$\{[@\$!\*a-zA-Z][\w\.]+\}/ })
const valueStart = createToken({name: "valueStart", pattern: /\$\{/ })
const valueEnd = createToken({name: "valueEnd", pattern: /\}/,  longer_alt: anything })
const image = createToken({name: "image", pattern: /!\[([^\]]+)\]\(([^\)]+)\)/})
const hyperlink = createToken({name: "hyperlink", pattern: /\[([^\]]+)\]\(([^\)]+)\)/})
const olist = createToken({name: "olist", pattern: /\n[0-9]+\./})
const ulist = createToken({name: "ulist", pattern: /\n\*\s/})
const hrule = createToken({name: "hrule", pattern: /\n-{5,}/})
const dot = createToken({name: "dot", pattern: /\./, longer_alt: anything})
const identifier = createToken({name: "identifier", pattern: /[a-zA-Z_][_\w]+/, longer_alt: anything})

const br = createToken({ name: "br", pattern: /\n/ })
const allTokens = [
    anything, 
    br,
    dot, 
    heading,  

    valueStart, 
    valueEnd, 
    image, 
    hyperlink, 
    bold, 
    olist, 
    ulist, 
    hrule,
    identifier
 ]

const commandLexer = new Lexer(allTokens);

class FormatParser extends Parser {
    constructor() {
        super(allTokens, {outputCst: false})
        this.commands(this)
        this.inBold = false
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
        $.RULE("commands", ()=> {
            $.MANY(() => {
                console.log($.SUBRULE($.command))
            })
        })
        $.RULE("command", ()=> {
            return $.OR([
               {ALT: () => $.SUBRULE($.headingCmd)},
               {ALT: () => $.SUBRULE1($.ulistCmd)},
               {ALT: () => $.SUBRULE2($.olistCmd)},
               {ALT: () => $.SUBRULE2($.paragraph)},
            ])
        }) 
        $.RULE("headingCmd", ()=> {
            let level = $.CONSUME(heading).image
            let text = $.SUBRULE($.stuff)
            return `<h1> ${text} </h1>`
        })
        $.RULE("paragraph", ()=> {
            $.CONSUME(br)
            let text = $.SUBRULE($.stuff)
            return `<p> ${text} </p>`
        })
        $.RULE("boldCmd", ()=> {
            $.CONSUME(bold)
            this.inBold = !this.inBold 
            if (this.inBold) {
                return `<strong>`
            }
            return `</strong>`
            
        })
        $.RULE("ulistCmd", ()=> {
            let text = "<ul>"
            $.AT_LEAST_ONE(()=> {
                $.CONSUME(ulist)
                text += "<li>"
                text += $.SUBRULE($.stuff)
                text += "</li>"
            })
            text += '</ul>'
            return text

        })
        $.RULE("olistCmd", ()=> {
            let text = "<ol>"
            $.AT_LEAST_ONE(()=> {
                $.CONSUME(olist)
                text += "<li>"
                text += $.SUBRULE($.stuff)
                text += "</li>"
            })
            text += '</ol>'
            return text
        })
        $.RULE("stuff", ()=> {
            let text = ''
            $.MANY(() => {
                text += $.SUBRULE($.part)
            })
            return text
        })
        $.RULE("fqn", ()=> {
            $.CONSUME(identifier)
            $.MANY({
                GATE: ()=> $.LA(2).tokenType === identifier,
                DEF:  () => {
                    $.CONSUME(dot)
                    $.CONSUME2(identifier)
                }

            })
        })

        $.RULE("value", ()=> {
            $.CONSUME(valueStart)
            $.SUBRULE($.fqn)
            $.CONSUME(valueEnd)
        })


        $.RULE("part", ()=> {
            return $.OR([
                {ALT: () => $.SUBRULE($.value).image+'='},
                {ALT: () => $.CONSUME(image).image},
                
                {ALT: () => $.CONSUME(anything).image},
                {ALT: () => $.CONSUME(hyperlink).image},
                {ALT: ()=> $.SUBRULE($.boldCmd)}
            ])
        }) 
    }
}

let input = "\n## Hello \n* one\n* two\n ${fred.wilma}\n ** Hello **\n"
const lexRsult = commandLexer.tokenize(input)
for(let t of lexRsult.tokens) {
    console.log(`${t.tokenType.name}`)
}

const parser = new FormatParser()
let out = parser.parse(input)
