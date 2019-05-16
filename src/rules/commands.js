import spsLexer from '../nut-lex.js'
import { IteratorTypes, SetOperations, TellTypes, CommandTypes } from '../nut-types.js'
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

//module.exports = 
export default ($) => {
    $.RULE('annotationId', () => {
        $.CONSUME(toks.LT_Op)
        $.CONSUME(toks.Identifier).image
        $.CONSUME(toks.GT_Op)
    })
    $.RULE('annotation', () => {
        $.CONSUME(toks.LT_Op)
        $.CONSUME(toks.Identifier).image
        $.OPTION(()=> $.SUBRULE($.value))
        $.CONSUME(toks.GT_Op)
    })
    $.RULE('annotationList', ()=> {
        $.MANY(() => {
            $.SUBRULE1($.annotation)
        })
    })

    $.RULE('doCmd', () => {
        $.CONSUME(toks.DoCmd)
        $.OPTION(() => $.CONSUME(toks.TogetherOp))
        $.SUBRULE($.shotList)
    })
    $.RULE("shotList", () => {
        $.OR([
            { ALT: () => $.CONSUME(toks.Identifier) },
            {
                ALT: () => {
                    $.CONSUME(toks.LBracket);
                    $.MANY(() => {
                        $.CONSUME1(toks.Identifier)
                    })
                    $.CONSUME(toks.RBracket);
                }
            }
        ])
    })

    // tell-command
    // :  TELL_STATEMENT role-cast-list string
    // ;
    $.RULE('tellCmd', () => {
        $.OR([{
            ALT: () => {
                $.CONSUME(toks.TellCmd)
                $.OPTION1(() => $.SUBRULE($.identifierTellList))
                $.CONSUME(toks.StringLiteral)
            }
        }, {
            ALT: () => {
                $.CONSUME1(toks.StringLiteral)
            }
        }
        ])
    })

    $.RULE('cueCmd', () => {
        $.OPTION(() => $.CONSUME(toks.CueCmd))
        $.SUBRULE($.aliasString)
    })

    $.RULE('asCmd', () => {
        $.OPTION(() => $.CONSUME(toks.AsCmd))
        $.CONSUME(toks.CastId)
        $.SUBRULE($.aliasCmdList)
    })

    $.RULE("aliasCmdList", () => {
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent)
        
        $.AT_LEAST_ONE(()=> { 
            $.SUBRULE($.aliasCmd)
        })
        $.CONSUME(toks.Outdent)
    })

    $.RULE("aliasCmd", () => {
        $.OPTION(()=> $.SUBRULE($.annotationList))
        return $.OR([
          //  { ALT: () => $.SUBRULE($.asCmd) },
            { ALT: () => $.SUBRULE($.doCmd) },
            { ALT: () => $.SUBRULE($.tellCmd) },
            { ALT: () => $.SUBRULE($.cueCmd) },
            { ALT: () => $.SUBRULE($.sceneCmd) },
            { ALT: () => $.SUBRULE($.setCmd) },
            { ALT: () => $.SUBRULE($.delayCmd) },
            { ALT: () => $.SUBRULE($.completeCmd) },
            { ALT: () => $.SUBRULE($.showCmd) },
            { ALT: () => $.SUBRULE($.hideCmd) },
            { ALT: () => $.SUBRULE($.failCmd) },
            // {ALT: ()=> $.SUBRULE($.askCmd)}
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
            { ALT: () => $.CONSUME(toks.SceneId) },
            { ALT: () => $.CONSUME(toks.StorySec) }
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
    })
    $.RULE('failCmd', () => {
        $.CONSUME(toks.FailCmd)
    })


    $.RULE('setOperator', ()=>{
        $.OR([
            { ALT: () => $.CONSUME(toks.Colon) ? SetOperations.Assign : undefined },
            { ALT: () => $.CONSUME(toks.Assign) ? SetOperations.Assign : undefined },
            { ALT: () => $.CONSUME(toks.AssignPercentAdd) ? SetOperations.AssignPercentAdd : undefined },
            { ALT: () => $.CONSUME(toks.AssignPercentSub) ? SetOperations.AssignPercentSub : undefined },
            { ALT: () => $.CONSUME(toks.AssignAdd) ? SetOperations.AssignAdd : undefined },
            { ALT: () => $.CONSUME(toks.AssignSub) ? SetOperations.AssignSub : undefined },
            { ALT: () => $.CONSUME(toks.AssignMul) ? SetOperations.AssignMul : undefined }
        ])
    })

    $.RULE('setCmd', () => {
        $.CONSUME(toks.SetCmd)
        $.SUBRULE($.setLHS)
        $.SUBRULE($.setOperator)
        $.OR1([
            { ALT: () => $.SUBRULE($.value) },
            { ALT: () => $.SUBRULE1($.identifierExpression) },
        ])
    })
    // delay-command
    // : DELAY_STATEMENT time-unit COLON when-command-block
    // ;
    $.RULE('delayCmd', () => {
        $.OPTION(()=>$.CONSUME(toks.DelayCmd))
        let ms = $.SUBRULE($.timeUnits);
        return { type: CommandTypes.Delay, options: { ms } }
    })
    // 
    $.RULE('forCmd', () => {
        $.CONSUME(toks.ForCmd)
        let options = $.OR([
            {ALT: ()=> $.SUBRULE($.forRange)},
            {ALT: ()=> $.SUBRULE($.forArray)},
            {ALT: ()=> $.SUBRULE($.forCast)},
            {ALT: ()=> $.SUBRULE($.forRoles)},
            {ALT: ()=> $.SUBRULE($.forCastFromRoles)},
            {ALT: ()=> $.SUBRULE($.forScenes)},
            {ALT: ()=> $.SUBRULE($.forShots)},
        ])
        options.content = $.SUBRULE($.IfElseCmdBlock)
        
        return { type: CommandTypes.For, options }      
    })

    $.RULE("forRange", () => {
        $.CONSUME(toks.Identifier)
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.RangeOp)
        $.CONSUME(toks.LParen)
        $.CONSUME(toks.IntegerLiteral)
        $.OPTION(() => {
            $.CONSUME(toks.Comma);
            $.CONSUME1(toks.IntegerLiteral)
        })
        $.OPTION1(() => {
            $.CONSUME1(toks.Comma);
            $.CONSUME2(toks.IntegerLiteral)
        })

        $.CONSUME(toks.RParen)

    });

    // $.RULE("rangeArray", () => {
    //     let array = []
    //     $.CONSUME(toks.LBracket)
    //     $.OR([
    //         {ALT: ()=> $.SUBRULE($.rangeSceneIDArray)},
    //         {ALT: ()=> $.SUBRULE($.rangeCastIDArray)},
    //         {ALT: ()=> $.SUBRULE($.rangeRoleIDArray)},
    //         {ALT: ()=> $.SUBRULE($.rangeShotIDArray)},
    //         {ALT: ()=>  $.SUBRULE($.rangeValueArray)}
    //     ])
    //     $.CONSUME(toks.RBracket)
    //     return { type: IteratorTypes.Set, set: array }
    // })

    $.RULE("forArray", () => {
        $.CONSUME(toks.Identifier).image
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        
        $.AT_LEAST_ONE_SEP({
            SEP: toks.Comma,
            DEF: () => $.SUBRULE2($.value)
        })
        $.CONSUME(toks.RBracket)
    })

    $.RULE("forScenes", () => {
        $.CONSUME(toks.SceneId)
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.SceneId))
        $.CONSUME(toks.RBracket)
    })

    $.RULE("forCast", () => {
        $.CONSUME(toks.CastId)
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.CastId))
        $.CONSUME(toks.RBracket)

    })

    $.RULE("forRoles", () => {
        $.CONSUME(toks.RoleId)
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.RoleId))
        $.CONSUME(toks.RBracket)
    })

    $.RULE("forCastFromRoles", () => {
        $.CONSUME(toks.CastId)
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.RoleId))
        $.CONSUME(toks.RBracket)

    })

    $.RULE("forShots", () => {
        $.CONSUME(toks.Identifier).image
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.Identifier))
        $.CONSUME(toks.RBracket)
    })

}
