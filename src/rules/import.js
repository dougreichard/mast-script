const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE('imports', () => {
        $.CONSUME(toks.ImportSec).image
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)  
        $.MANY(() => {
            $.CONSUME(toks.StringLiteral)
        })
        $.CONSUME(toks.Outdent)  
    })
}