const spsLexer = require('../sps-lex')
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
        $.OR([{
            ALT: () => {
                $.CONSUME(toks.Identifier)
                $.OPTION(()=> $.SUBRULE($.aliasString))

            }
        }, {
            ALT: () => {
                $.SUBRULE1($.aliasString)
            }
        }])
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
            { ALT: () => $.SUBRULE($.asCmd) },
            { ALT: () => $.SUBRULE($.doCmd) },
            { ALT: () => $.SUBRULE($.tellCmd) },
            { ALT: () => $.SUBRULE($.setCmd) },
            { ALT: () => $.SUBRULE($.delayCmd) },
            { ALT: () => $.SUBRULE($.sceneCmd) },
            { ALT: () => $.SUBRULE($.forCmd) },
        ])
    })


}