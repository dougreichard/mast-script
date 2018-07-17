const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // tell-command
    // :  TELL_STATEMENT role-cast-list string
    // ;
    $.RULE('tellCmd', ()=> {
        $.CONSUME(toks.TellCmd)
        $.OPTION(()=>$.SUBRULE($.roleCastIdList))
        $.CONSUME(toks.StringLiteral)
    })
    // scene-command
    // : SCENE_STATEMENT SCENE_ID role-cast-list?
    // ;
    $.RULE('sceneCmd', ()=> {
        $.CONSUME(toks.SceneCmd)
        $.CONSUME(toks.SceneId)
        $.OPTION(()=> {
            $.SUBRULE($.roleCastIdList);
        })
    })
    // show-command
    // : SHOW_STATEMENT OBJECTIVE_ID boolean-value
    // | SHOW_STATEMENT INTERACTION_ID boolean-value
    // ;
    $.RULE('showCmd', ()=> {
        $.CONSUME(toks.ShowCmd)
        $.OR([
            {ALT: ()=> $.CONSUME(toks.ObjectiveId)},
            {ALT: ()=> $.CONSUME(toks.InteractionId)}
        ])
        $.OPTION(()=> $.SUBRULE($.booleanValue))
    })
    // ask-command
    // : ASK_STATEMENT INTERACTION_ID role-cast-list
    // ;
    $.RULE('askCmd', ()=> {
        $.CONSUME(toks.AskCmd)
        $.CONSUME(toks.InteractionId)
        $.OPTION(()=> {
            $.SUBRULE($.roleCastIdList);
        })
    })
    $.RULE('completeCmd', ()=> {
        $.CONSUME(toks.CompleteCmd)
    })
    $.RULE('failCmd', ()=> {
        $.CONSUME(toks.FailCmd)
    })
    $.RULE('setCmd', ()=> {
        $.CONSUME(toks.SetCmd)
        $.SUBRULE($.roleCastIdList)
        $.SUBRULE1($.roleCastIdList)
    })
    // delay-command
    // : DELAY_STATEMENT time-unit COLON when-command-block
    // ;
    $.RULE('delayCmd', ()=> {
        $.CONSUME(toks.DelayCmd)
        $.SUBRULE($.timeUnits);
        $.SUBRULE($.ifElseCmdBlock)
    })
}