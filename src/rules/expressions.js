import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

//module.exports = 
export default ($) => {
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
        let m = $.CONSUME(toks.MinuteLiteral).image
        let s = $.OPTION(()=> $.CONSUME(toks.SecondLiteral).image)
        let ms = $.OPTION1(()=> $.CONSUME(toks.MillisecondLiteral).image)
        // calc time ine milliseconds
        let total = 0
        total += m? parseInt(m)*60000: 0
        total += s? parseInt(s)*1000: 0
        total += ms? parseInt(ms): 0
        return total

    })
    $.RULE('sTime', () => {
        let s = $.CONSUME(toks.SecondLiteral).image
        let ms = $.OPTION(()=> $.CONSUME(toks.MillisecondLiteral).image)
        let total = 0
        total += s? parseInt(s)*1000: 0
        total += ms? parseInt(ms): 0
        return total
    })
    $.RULE('msTime', () => {
        let ms = $.CONSUME(toks.MillisecondLiteral).image
        return parseInt(ms)
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
        let ms = $.OR([
            { ALT: () => $.SUBRULE($.mTime) },
            { ALT: () => $.SUBRULE($.sTime) },
            { ALT: () => $.SUBRULE($.msTime) }
        ])
        return ms
    })
}
