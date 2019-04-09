const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // startup-section-block
    //     : STARTUP_STATEMENT COLON INDENT startup-section-item* DEDENT
    //     ;
    $.RULE('startup', () => {
        $.CONSUME(toks.StartupBlock)
        $.SUBRULE($.stateCmdBlock)
    })
    // enter-section-block
    //     :  ENTER_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('enter', () => {
        $.CONSUME(toks.EnterBlock)
        $.SUBRULE($.stateCmdBlock)
    })
    // leave-section-block
    //     :  LEAVE_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('leave', () => {
        $.CONSUME(toks.LeaveBlock)
        $.SUBRULE($.stateCmdBlock)
    })

    $.RULE('shot', () => {
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
        let value = $.OPTION3(() =>  $.SUBRULE($.objectValue))
        $.SUBRULE($.stateCmdBlock)

    })

    $.RULE('stateCmdBlock', () => {
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            $.SUBRULE($.stateCommand)
        })
        $.CONSUME(toks.Outdent)
    })

    // startup-section-item
    //     : tell-command
    //     | scene-command
    //     | set-command
    //     | delay-command
    //     ;
    $.RULE('stateCommand', () => {
        $.OR([
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