const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // startup-section-block
    //     : STARTUP_STATEMENT COLON INDENT startup-section-item* DEDENT
    //     ;
    $.RULE('startup', () => {
        $.CONSUME(toks.StartupBlock)
        return $.SUBRULE($.stateCmdBlock)
    })
    // enter-section-block
    //     :  ENTER_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('enter', () => {
        $.CONSUME(toks.EnterBlock)
        return $.SUBRULE($.stateCmdBlock)
    })
    // leave-section-block
    //     :  LEAVE_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('leave', () => {
        $.CONSUME(toks.LeaveBlock)
        return $.SUBRULE($.stateCmdBlock)
    })

    $.RULE('shot', () => {
        let sub = $.OPTION(() => $.SUBRULE($.subOperator)) 
        let id = $.OPTION1(()=> $.CONSUME(toks.Identifier).image)
        let alias = $.OPTION2(()=> $.SUBRULE($.aliasString).image)
/* I may want thi stricter version
        let id
        let alias
        $.OR([{
            ALT: () => {
                id = $.CONSUME(toks.Identifier)
                alias = $.OPTION(()=> $.SUBRULE($.aliasString))
            }
        }, {
            ALT: () => {
                alias = $.SUBRULE1($.aliasString)
            }
        }])
        */
        id = id ? id: $.anonymousID('shot') 

        let value = $.OPTION3(() =>  $.SUBRULE($.objectValue))
        let shot = { id, alias,   value, sub}
        $.pushShot(shot)
        let content = $.SUBRULE($.stateCmdBlock);
        shot.content = content
        $.popShot(shot)
        return shot

    })

    $.RULE('stateCmdBlock', () => {
        let cmds = []
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            let cmd = $.SUBRULE($.stateCommand)
            if (cmd) {
                cmds.push(cmd)
            }
        })
        $.CONSUME(toks.Outdent)
        return cmds;
    })

    // startup-section-item
    //     : tell-command
    //     | scene-command
    //     | set-command
    //     | delay-command
    //     ;
    $.RULE('stateCommand', () => {
       return  $.OR([
            { ALT: () => $.SUBRULE($.asWithCmd) },
            { ALT: () => $.SUBRULE($.doCmd) },
            { ALT: () => $.SUBRULE($.tellCmd) },
            { ALT: () => $.SUBRULE($.setCmd) },
            { ALT: () => $.SUBRULE($.delayCmd) },
            { ALT: () => $.SUBRULE($.sceneCmd) },
            { ALT: () => $.SUBRULE($.forCmd) },
        ])
    })


}