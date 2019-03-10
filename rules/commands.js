const spsLexer = require('../sps-lex')
const { TellTypes} = require('../sps-type')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // tell-command
    // :  TELL_STATEMENT role-cast-list string
    // ;
    $.RULE('tellCmd', () => {
        $.CONSUME(toks.TellCmd)
        $.OPTION(() =>  $.SUBRULE($.identifierTellList))
        $.CONSUME(toks.StringLiteral)
    })

    $.RULE("identifierTellList", () => {
        $.OR([
            { ALT: () => $.SUBRULE($.identifierTell) },
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        $.SUBRULE1($.identifierTell)
                    })
                    $.CONSUME(toks.RBracket);
                }
            }
        ])
    })
    $.RULE("identifierTell", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.StorySec) },
            { ALT: () => $.CONSUME(toks.SceneId) },
            { ALT: () => $.SUBRULE($.roleCastId) },
        ])
    })

    // scene-command
    // : SCENE_STATEMENT SCENE_ID role-cast-list?
    // ;
    $.RULE('sceneCmd', () => {
        $.CONSUME(toks.SceneCmd)
        $.CONSUME(toks.SceneId)
        $.OPTION(() => {
            $.SUBRULE($.roleCastIdList);
        })
    })
    // show-command
    // : SHOW_STATEMENT OBJECTIVE_ID boolean-value
    // | SHOW_STATEMENT INTERACTION_ID boolean-value
    // ;
    $.RULE('showCmd', () => {
        $.CONSUME(toks.ShowCmd)
        $.OR([
            { ALT: () => $.CONSUME(toks.ObjectiveId) },
            { ALT: () => $.CONSUME(toks.InteractionId) }
        ])
    })
    $.RULE('hideCmd', () => {
        $.CONSUME(toks.HideCmd)
        $.OR([
            { ALT: () => $.CONSUME(toks.ObjectiveId) },
            { ALT: () => $.CONSUME(toks.InteractionId) }
        ])
    })
    // ask-command
    // : ASK_STATEMENT INTERACTION_ID role-cast-list
    // ;
    $.RULE('askCmd', () => {
        $.CONSUME(toks.AskCmd)
        $.CONSUME(toks.InteractionId)
        $.OPTION(() => {
            $.SUBRULE($.roleCastIdList);
        })
    })
    $.RULE('completeCmd', () => {
        $.CONSUME(toks.CompleteCmd)
        $.SUBRULE($.ObjectiveIdList)
        $.SUBRULE1($.ifElseValidCmd)
    })
    $.RULE('failCmd', () => {
        $.CONSUME(toks.FailCmd)
    })
    $.RULE('setCmd', () => {
        $.CONSUME(toks.SetCmd)
        $.SUBRULE($.setLHS)
        $.OR([
            { ALT: () => $.CONSUME(toks.Colon) },
            { ALT: () => $.CONSUME(toks.Assign) },
            { ALT: () => $.CONSUME(toks.AssignPercent) },
            { ALT: () => $.CONSUME(toks.AssignAdd) },
            { ALT: () => $.CONSUME(toks.AssignSub) },
            { ALT: () => $.CONSUME(toks.AssignMul) }
        ])

        $.OR1([
            { ALT: () => $.SUBRULE($.value) },
            { ALT: () => $.SUBRULE1($.identifierExpression) },
        ])
    })
    // delay-command
    // : DELAY_STATEMENT time-unit COLON when-command-block
    // ;
    $.RULE('delayCmd', () => {
        $.CONSUME(toks.DelayCmd)
        $.SUBRULE($.timeUnits);
    })

}
