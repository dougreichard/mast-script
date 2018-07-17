const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // startup-section-block
    //     : STARTUP_STATEMENT startup-section-item
    //     | STARTUP_STATEMENT COLON INDENT startup-section-item* DEDENT
    //     ;
    $.RULE('startup', ()=> {
        $.CONSUME(toks.StartupBlock)
        $.OR([
            {ALT: () => $.SUBRULE($.stateCommand)},
            {ALT: () => {
                $.CONSUME(toks.Colon)
                $.CONSUME(toks.Indent)
                $.MANY( () => {
                    $.SUBRULE2($.stateCommand)
                })
                $.CONSUME(toks.Outdent)
            }}
        ])
    })
        // enter-section-block
    //     : ENTER_STATEMENT state-section-item
    //     | ENTER_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('enter', ()=> {
        $.CONSUME(toks.EnterBlock)
        $.OR([
            {ALT: () => $.SUBRULE($.stateCommand)},
            {ALT: () => {
                $.CONSUME(toks.Colon)
                $.CONSUME(toks.Indent)
                $.MANY( () => {
                    $.SUBRULE2($.stateCommand)
                })
                $.CONSUME(toks.Outdent)
            }}
        ])
    })
        // leave-section-block
    //     : LEAVE_STATEMENT state-section-item
    //     | LEAVE_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('leave', ()=> {
        $.CONSUME(toks.LeaveBlock)
        $.OR([
            {ALT: () => $.SUBRULE($.stateCommand)},
            {ALT: () => {
                $.CONSUME(toks.Colon)
                $.CONSUME(toks.Indent)
                $.MANY( () => {
                    $.SUBRULE2($.stateCommand)
                })
                $.CONSUME(toks.Outdent)
            }}
        ])
    })


    // startup-section-item
    //     : tell-command
    //     | scene-command
    //     | set-command
    //     | delay-command
    //     ;
    $.RULE('stateCommand', ()=> {
         $.OR([
            { ALT: () => $.SUBRULE($.tellCmd)},
            { ALT: () => $.SUBRULE($.setCmd)},
            { ALT: () => $.SUBRULE($.delayCmd)},
            { ALT: () => $.SUBRULE($.sceneCmd)},
        ])
    }) 


}