const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE("Condition", () => {
        $.SUBRULE($.Expression)
        $.OPTION(() => {
            $.SUBRULE1($.Operator)
            $.SUBRULE2($.Expression)
        })
    })
    $.RULE("Operator", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.Equals) },
            { ALT: () => $.CONSUME(toks.NotEquals) },
            { ALT: () => $.CONSUME(toks.IsOp) },
            { ALT: () => $.CONSUME(toks.GT_Op) },
            { ALT: () => $.CONSUME(toks.LT_Op) },
            { ALT: () => $.CONSUME(toks.GE_Op) },
            { ALT: () => $.CONSUME(toks.AndCond) },
            { ALT: () => $.CONSUME(toks.OrCond) },
            { ALT: () => $.CONSUME(toks.HasRoleCond) },

        ])
    })
    $.RULE("roleCastLHS", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.Identifier) },
            { ALT: () => $.SUBRULE($.roleCastIdList) },
            //{ ALT: () => $.CONSUME(toks.CastId) }
        ])
        $.OPTION(()=>{
            $.MANY(() => {
                $.CONSUME(toks.DataId)
            })
        })
    })
    $.RULE("roleCastExpression", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.Identifier) },
            { ALT: () => $.SUBRULE($.roleCastId) },
            //{ ALT: () => $.CONSUME(toks.CastId) }
        ])
        $.OPTION(()=>{
            $.MANY(() => {
                $.CONSUME(toks.DataId)
            })
        })
    })
    $.RULE("Expression", () => {
        $.OR([
            { ALT: () => $.SUBRULE($.roleCastExpression) },
            { ALT: () => $.CONSUME(toks.StringLiteral) },
            { ALT: () => $.CONSUME(toks.IntegerLiteral) },
            { ALT: () => $.CONSUME(toks.NumberLiteral) },
            { ALT: () => $.SUBRULE($.booleanValue) },
            { ALT: () => $.CONSUME(toks.Null) },
            { ALT: () => $.SUBRULE($.parenthesisExpression) },

        ])
    })
   
    $.RULE("parenthesisExpression", () => {
        $.CONSUME(toks.LParen)
        $.SUBRULE($.Condition)
        $.CONSUME(toks.RParen)
    })
}