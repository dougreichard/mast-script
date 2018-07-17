const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE("objectValue", () => {
        $.OR([
            // using ES6 Arrow functions to reduce verbosity.
            { ALT: () => $.SUBRULE($.object) },
            { ALT: () => $.SUBRULE($.array) }
        ])
    })

    // the parsing methods
    $.RULE("object", () => {
        $.CONSUME(toks.LBrace)
        $.MANY_SEP({
            SEP: toks.Comma,
            DEF: () => {
                $.SUBRULE2($.objectItem)
            }
        })
        $.CONSUME(toks.RBrace)
    })

    $.RULE("objectItem", () => {
        $.CONSUME(toks.StringLiteral)
        $.CONSUME(toks.Colon)
        $.SUBRULE($.value)
    })

    $.RULE("array", () => {
        $.CONSUME(toks.LBracket)
        $.MANY_SEP({
            SEP: toks.Comma,
            DEF: () => {
                $.SUBRULE2($.value)
            }
        })
        $.CONSUME(toks.RBracket)
    })

    $.RULE("value", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.StringLiteral) },
            { ALT: () => $.CONSUME(toks.IntegerLiteral) },
            { ALT: () => $.CONSUME(toks.NumberLiteral) },
            { ALT: () => $.SUBRULE($.object) },
            { ALT: () => $.SUBRULE($.array) },
            { ALT: () => $.SUBRULE($.booleanValue) },
            { ALT: () => $.CONSUME(toks.Null) }
        ])
    })
    $.RULE("booleanValue", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.True) },
            { ALT: () => $.CONSUME(toks.False) },
        ])
    })
}