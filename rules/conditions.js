const spsLexer = require('../nut-lex')
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
    $.RULE("identifierLHSList", () => {
        $.OR([
            { ALT: () => $.SUBRULE($.identifierLHS) },
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        $.SUBRULE1($.identifierLHS)
                    })
                    $.CONSUME(toks.RBracket);
                }
            }
        ])
    })
    $.RULE("identifierLHS", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.StorySec) },
            { ALT: () => $.CONSUME(toks.SceneId) },
            { ALT: () => $.CONSUME(toks.InteractionId) },
            { ALT: () => $.CONSUME(toks.ObjectiveId) },
            { ALT: () => $.SUBRULE($.roleCastId) },
            //{ ALT: () => $.CONSUME(toks.CastId) }
        ])
    })

    $.RULE("setLHS", () => {
        $.SUBRULE($.identifierLHSList)
        $.OPTION(() => {
            $.MANY(() => {
                $.CONSUME(toks.DataId)
            })
        })
    })
    $.RULE("identifierExpression", () => {
        $.SUBRULE($.identifierLHS) 
        $.OPTION(() => {
            $.MANY(() => {
                $.CONSUME(toks.DataId)
            })
        })
    })
    $.RULE("Expression", () => {
        $.OR([
            { ALT: () => $.SUBRULE($.identifierExpression) },
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