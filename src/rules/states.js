import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

export default  ($) => {
    // startup-section-block
    //     : STARTUP_STATEMENT COLON INDENT startup-section-item* DEDENT
    //     ;
    $.RULE('startup', () => {
        $.OPTION(()=> $.SUBRULE($.annotationList))
        $.CONSUME(toks.StartupBlock)
        $.SUBRULE($.stateCmdBlock)
    })
    // enter-section-block
    //     :  ENTER_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('enter', () => {
        $.OPTION(()=> $.SUBRULE($.annotationList))
        $.CONSUME(toks.EnterBlock)
        $.SUBRULE($.stateCmdBlock)
    })
    // leave-section-block
    //     :  LEAVE_STATEMENT COLON INDENT state-section-item* DEDENT
    //     ;
    $.RULE('leave', () => {
        $.OPTION(()=> $.SUBRULE($.annotationList))
        $.CONSUME(toks.LeaveBlock)
        $.SUBRULE($.stateCmdBlock)
    })

    $.RULE('shot', () => {
        $.OPTION(()=> $.SUBRULE($.annotationList))
        $.OPTION1(() => $.SUBRULE($.subOperator)) 
        $.OPTION2(()=> $.CONSUME(toks.Identifier))
        $.OPTION3(()=> $.SUBRULE($.aliasString))
        $.SUBRULE($.stateCmdBlock);
    })

    $.RULE('stateCmdBlock', () => {
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            $.SUBRULE($.annotationList)
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
       return  $.OR([
            { ALT: () => $.SUBRULE($.asCmd) },
            { ALT: () => $.SUBRULE($.doCmd) },
            { ALT: () => $.SUBRULE($.cueCmd) },
            { ALT: () => $.SUBRULE($.tellCmd) },
            { ALT: () => $.SUBRULE($.setCmd) },
            { ALT: () => $.SUBRULE($.delayCmd) },
            { ALT: () => $.SUBRULE($.sceneCmd) },
            { ALT: () => $.SUBRULE($.forCmd) },
        ])
    })


}