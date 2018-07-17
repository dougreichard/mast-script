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



    ////////////////////////////////
    // Time stuff
    // minutes
    // : INT MINUTES_STATEMENT
    // ;
    $.RULE('minutes', () => {
        $.CONSUME(toks.IntegerLiteral);
        $.CONSUME(toks.Minutes)
    })

    // seconds
    //     : INT SECONDS_STATEMENT
    //     ;
    $.RULE('seconds', () => {
        $.CONSUME(toks.IntegerLiteral);
        $.CONSUME(toks.Seconds)
    })

    // milliseconds
    //     : INT MILLISECONDS_STATEMENT
    //     ;
    $.RULE('milliseconds', () => {
        $.CONSUME(toks.IntegerLiteral);
        $.CONSUME(toks.MilliSeconds)
    })
    $.RULE('mTime', () => {
        $.SUBRULE($.minutes)
        $.OPTION(()=> $.SUBRULE($.seconds))
        $.OPTION1(()=> $.SUBRULE($.milliseconds))
    })
    $.RULE('sTime', () => {
        $.SUBRULE($.seconds)
        $.OPTION(()=> $.SUBRULE($.milliseconds))
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
            { ALT: () => $.SUBRULE($.milliseconds) }
        ])


    })
}
