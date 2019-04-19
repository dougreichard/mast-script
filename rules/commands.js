const spsLexer = require('../nut-lex')
const { TellTypes, CommandTypes } = require('../nut-types')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE('doCmd', () => {
        $.CONSUME(toks.DoCmd)
        let together = $.OPTION(() => $.CONSUME(toks.TogetherOp).image?true:false)
        let shots = $.OPTION1(() => $.SUBRULE($.shotList))
        return {type: CommandTypes.Do, options: {together, shots}}

    })
    $.RULE("shotList", () => {
        let shotList = []
        $.OR([
            { ALT: () => shotList.push($.CONSUME(toks.Identifier).image) },
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        shotList.push($.CONSUME1(toks.Identifier).image)
                    })
                    $.CONSUME(toks.RBracket);
                }
            }
        ])
        return shotList
    })

    // tell-command
    // :  TELL_STATEMENT role-cast-list string
    // ;
    $.RULE('tellCmd', () => {
        let desc;
        $.OR([{
            ALT: () => {
                $.CONSUME(toks.TellCmd)
                $.OPTION1(() => $.SUBRULE($.identifierTellList))
                desc = $.trimString($.CONSUME(toks.StringLiteral).image)
            }}, {
                ALT: () => {
                    desc = $.trimString($.CONSUME1(toks.StringLiteral).image)
                }
            }
        ])
        return {type: CommandTypes.Tell, options: {desc}}

    })

    $.RULE('asWithCmd', () => {
        $.OR([
            {ALT: ()=> {
                $.SUBRULE($.asCmd)
                $.OPTION(()=> $.SUBRULE($.withCmd))
            }},
            {ALT: ()=> {
                $.SUBRULE1($.withCmd)
            }}
        ])
        
    })

    $.RULE('asCmd', () => {
        $.OPTION(()=>$.CONSUME(toks.AsCmd))
        $.CONSUME(toks.CastId)
    })

    $.RULE('withCmd', () => {
        $.OPTION(()=>$.CONSUME(toks.WithCmd))
        $.SUBRULE($.objectValue)
    })
    
    $.RULE("aliasCmd", () => {
        $.OR([
            { ALT: () => $.SUBRULE($.tellCmd) },
            { ALT: () => $.SUBRULE($.setCmd) },
            { ALT: () => $.SUBRULE($.askCmd) },
        ])
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

   
    $.RULE('sceneCmd', () => {
        $.CONSUME(toks.SceneCmd)
        $.OR([
            {ALT: ()=> $.CONSUME(toks.SceneId)},
            {ALT: ()=> $.CONSUME(toks.StorySec)}
        ]);
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
        let ms = $.SUBRULE($.timeUnits);
        return {type: CommandTypes.Delay, options: {ms}}
    })
    // 
    $.RULE('forCmd', () => {
        $.CONSUME(toks.ForCmd)
        $.OPTION(()=> {
            $.CONSUME(toks.Identifier)
            $.CONSUME(toks.InOp);
        })
        
        $.SUBRULE($.range)
        $.SUBRULE($.IfElseCmdBlock)
    })
    $.RULE("range", () => {
        $.OR([
            { ALT: () => $.SUBRULE2($.rangeArray) },
            { ALT: () => $.SUBRULE2($.rangeInt) },
        ])
    })
    $.RULE("rangeInt", () => {
        $.CONSUME(toks.RangeOp)
        $.CONSUME(toks.LParen)
        $.CONSUME(toks.IntegerLiteral)

        $.OPTION(() => { $.CONSUME(toks.Comma); $.CONSUME1(toks.IntegerLiteral) })
        $.OPTION1(() => { $.CONSUME1(toks.Comma); $.CONSUME2(toks.IntegerLiteral) })
        $.CONSUME(toks.RParen)
    });
    $.RULE("rangeArray", () => {
        $.CONSUME(toks.LBracket)
        $.MANY_SEP({
            SEP: toks.Comma,
            DEF: () => {
                $.OR([
                    { ALT: () => $.SUBRULE2($.value) },
                    { ALT: () => $.SUBRULE2($.identifierRange) },
                ])

            }
        })
        $.CONSUME(toks.RBracket)
    })
    $.RULE("identifierRange", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.StorySec) },
            { ALT: () => $.CONSUME(toks.SceneId) },
            { ALT: () => $.SUBRULE($.roleCastId) },
        ])
    })

}
