const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // role-list
    // : ROLE_ID 
    // | LBRACKET ROLE_ID* RBRACKET
    // ;
    $.RULE("roleIdList", () => {
        let roles = []
        $.OR([
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                       roles.push($.CONSUME(toks.RoleId).image)
                    })
                    $.CONSUME(toks.RBracket);
                }
            },
            { ALT: () => roles.push($.CONSUME2(toks.RoleId).image) },
        ])
        return roles;
    })
    // role-list
    // : ROLE_ID 
    // | LBRACKET ROLE_ID* RBRACKET
    // ;
    $.RULE("roleCastIdList", () => {
        let list = []
        $.OR([
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        list.push($.SUBRULE($.roleCastId))
                    })
                    $.CONSUME(toks.RBracket);
                }
            },
            { ALT: () => list.push($.SUBRULE1($.roleCastId)) },
        ])
        return list
    })
    $.RULE("roleCastId", () => {
        let id 
        $.OR([
            { ALT: () => id  = $.CONSUME(toks.RoleId).image },
            { ALT: () => id = $.CONSUME(toks.CastId).image }
        ])
        return id
    })
    
    $.RULE("ObjectiveIdList", () => {
        let list = []
        $.OR([
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        list.push($.CONSUME(toks.ObjectiveId).image)
                    })
                    $.CONSUME(toks.RBracket);
                }
            },
            { ALT: () => list.push($.CONSUME1(toks.ObjectiveId).image) },
        ])
        return list
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
