const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // role-list
    // : ROLE_ID 
    // | LBRACKET ROLE_ID* RBRACKET
    // ;
    $.RULE("roleIdList", () => {
        $.OR([
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        $.CONSUME(toks.RoleId)
                    })
                    $.CONSUME(toks.RBracket);
                }
            },
            { ALT: () => $.CONSUME2(toks.RoleId) },
        ])
    })
    // role-list
    // : ROLE_ID 
    // | LBRACKET ROLE_ID* RBRACKET
    // ;
    $.RULE("roleCastIdList", () => {
        $.OR([
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        $.SUBRULE($.roleCastId)
                    })
                    $.CONSUME(toks.RBracket);
                }
            },
            { ALT: () => $.SUBRULE1($.roleCastId) },
        ])
    })
    $.RULE("roleCastId", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.RoleId) },
            { ALT: () => $.CONSUME(toks.CastId) }
        ])
    })
    
    $.RULE("ObjectiveIdList", () => {
        $.OR([
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        $.CONSUME(toks.ObjectiveId)
                    })
                    $.CONSUME(toks.RBracket);
                }
            },
            { ALT: () => $.CONSUME2(toks.ObjectiveId) },
        ])
    })



    $.RULE('mTime', () => {
        $.CONSUME(toks.MinuteLiteral)
        $.OPTION(()=> $.CONSUME(toks.SecondLiteral))
        $.OPTION1(()=> $.CONSUME(toks.MillisecondLiteral))
    })
    $.RULE('sTime', () => {
        $.CONSUME(toks.SecondLiteral)
        $.OPTION(()=> $.CONSUME(toks.MillisecondLiteral))
    })
    $.RULE('msTime', () => {
        $.CONSUME(toks.MillisecondLiteral)
    })

    // time-unit
    // : minutes seconds milliseconds
    // |  minutes seconds
    // |  seconds milliseconds
    // |  minutes 
    // |  seconds
    // |  milliseconds
    // ;
    $.RULE('timeUnits', () => {
        $.OR([
            { ALT: () => $.SUBRULE($.mTime) },
            { ALT: () => $.SUBRULE($.sTime) },
            { ALT: () => $.SUBRULE($.msTime) }
        ])


    })
}
