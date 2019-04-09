const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE("objectValue", () => {
        let value
        value = $.OR([
            // using ES6 Arrow functions to reduce verbosity.
            { ALT: () => $.SUBRULE($.object) },
            { ALT: () => $.SUBRULE($.array) }
        ])
        return value
    })

    // the parsing methods
    $.RULE("object", () => {
        let obj = {}
        $.CONSUME(toks.LBrace)
        $.OPTION(()=>$.CONSUME(toks.Indent))
        $.MANY_SEP({
            SEP: toks.Comma,
            DEF: () => {
                let {key, value} = $.SUBRULE2($.objectItem)
                obj[key] = value
            }
        })
        $.OPTION1(()=>$.CONSUME(toks.Outdent))
        $.CONSUME(toks.RBrace)
        return obj
    })

    $.RULE("objectItem", () => {
        let key
        $.OR([
            {ALT: ()=> key = $.trimString($.CONSUME(toks.StringLiteral).image)},
            {ALT: ()=> key = $.CONSUME(toks.Identifier).image}
        ])
        
        $.CONSUME(toks.Colon)
        let value = $.SUBRULE($.value)
        return {key, value}
    })

    $.RULE("array", () => {
        let arr = []
        $.CONSUME(toks.LBracket)
        $.MANY_SEP({
            SEP: toks.Comma,
            DEF: () => {
                arr.push($.SUBRULE2($.value))
            }
        })
        $.CONSUME(toks.RBracket)
        return arr
    })

    $.RULE("value", () => {
        let value 
        value = $.OR([
            { ALT: () => $.trimString($.CONSUME(toks.StringLiteral).image) },
            { ALT: () => Number($.CONSUME(toks.IntegerLiteral).image) },
            { ALT: () => Number($.CONSUME(toks.NumberLiteral).image) },
            { ALT: () => $.SUBRULE($.object) },
            { ALT: () =>  $.SUBRULE($.array) },
            { ALT: () => $.SUBRULE($.booleanValue) },
            { ALT: () => $.CONSUME(toks.Null).image? null:undefined }
        ])
        return value
    })
    $.RULE("booleanValue", () => {
        
        return $.OR([
            { ALT: () => $.CONSUME(toks.True).image? true: false  },
            { ALT: () => $.CONSUME(toks.False).image? false:true },
        ])
    })
}