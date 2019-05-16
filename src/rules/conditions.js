import spsLexer from '../nut-lex.js'
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

// module.exports = 
export default ($) => {
    $.RULE("Condition", () => {
        $.SUBRULE($.Expression)
        $.OPTION(() => {
            $.SUBRULE1($.Operator)
            $.SUBRULE2($.Expression)
        })
    })
    $.RULE("subOperator", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.Sub) },
            { ALT: () => $.CONSUME(toks.SubOp) }
        ])
        return true
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
        let lhs = []
        $.OR([
            { ALT: () => lhs.push($.SUBRULE($.identifierLHS)) },
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        lhs.push($.SUBRULE1($.identifierLHS)) 
                    })
                    $.CONSUME(toks.RBracket);
                }
            }
        ])
        return lhs
    })
    $.RULE("identifierLHS", () => {
        return $.OR([
            { ALT: () => $.CONSUME(toks.StorySec).image },
            { ALT: () => $.CONSUME(toks.SceneId).image },
            { ALT: () => $.CONSUME(toks.InteractionId).image },
            { ALT: () => $.CONSUME(toks.ObjectiveId).image },
            { ALT: () => $.CONSUME(toks.CastId) },
            { ALT: () => $.CONSUME(toks.RoleId) },
            { ALT: () => $.CONSUME(toks.Identifier).image }
            //{ ALT: () => $.CONSUME(toks.CastId) }
        ])
    })

    $.RULE("setLHS", () => {
        let ids = $.SUBRULE($.identifierLHSList)
        let elements = ""
        $.OPTION(() => {
            $.MANY(() => {
                elements += $.CONSUME(toks.DataId).image
            })
        })
        return {ids, elements}
    })
    $.RULE("identifierExpression", () => {
        let exp = $.SUBRULE($.identifierLHS)
        let annotation = $.OPTION(()=> $.SUBRULE($.annotationId)) 
        annotation = annotation?annotation:'value';
        let sub = ''
        $.OPTION2(() => {
            $.MANY(() => {
               sub += $.CONSUME(toks.DataId).image
            })
        })
        if (sub) {
            exp += annotation + sub
        }
        return exp
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