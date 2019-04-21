const spsLexer = require('../nut-lex')
const { IteratorTypes, SetOperations, TellTypes, CommandTypes } = require('../nut-types')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE('doCmd', () => {
        $.CONSUME(toks.DoCmd)
        let together = $.OPTION(() => $.CONSUME(toks.TogetherOp).image ? true : false)
        let shots = $.OPTION1(() => $.SUBRULE($.shotList))
        return { type: CommandTypes.Do, options: { together, shots } }

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
            }
        }, {
            ALT: () => {
                desc = $.trimString($.CONSUME1(toks.StringLiteral).image)
            }
        }
        ])
        return { type: CommandTypes.Tell, options: { desc } }

    })

    $.RULE('asWithCmd', () => {
        $.OR([
            {
                ALT: () => {
                    $.SUBRULE($.asCmd)
                    $.OPTION(() => $.SUBRULE($.withCmd))
                }
            },
            {
                ALT: () => {
                    $.SUBRULE1($.withCmd)
                }
            }
        ])

    })

    $.RULE('asCmd', () => {
        $.OPTION(() => $.CONSUME(toks.AsCmd))
        $.CONSUME(toks.CastId)
    })

    $.RULE('withCmd', () => {
        $.OPTION(() => $.CONSUME(toks.WithCmd))
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
        $.SUBRULE1($.ifElseValidCmd)
    })
    $.RULE('failCmd', () => {
        $.CONSUME(toks.FailCmd)
    })



    $.RULE('setCmd', () => {
        $.CONSUME(toks.SetCmd)
        let lhs = $.SUBRULE($.setLHS)
        let op = $.OR([
            { ALT: () => $.CONSUME(toks.Colon) ? SetOperations.Assign : undefined },
            { ALT: () => $.CONSUME(toks.Assign) ? SetOperations.Assign : undefined },
            { ALT: () => $.CONSUME(toks.AssignPercentAdd) ? SetOperations.AssignPercentAdd : undefined },
            { ALT: () => $.CONSUME(toks.AssignPercentSub) ? SetOperations.AssignPercentSub : undefined },
            { ALT: () => $.CONSUME(toks.AssignAdd) ? SetOperations.AssignAdd : undefined },
            { ALT: () => $.CONSUME(toks.AssignSub) ? SetOperations.AssignSub : undefined },
            { ALT: () => $.CONSUME(toks.AssignMul) ? SetOperations.AssignMul : undefined }
        ])
        let exp
        let value
        $.OR1([
            { ALT: () => value = $.SUBRULE($.value) },
            { ALT: () => exp = $.SUBRULE1($.identifierExpression) },
        ])
        return { type: CommandTypes.Set, options: { lhs, op, exp, value } }
    })
    // delay-command
    // : DELAY_STATEMENT time-unit COLON when-command-block
    // ;
    $.RULE('delayCmd', () => {
        $.CONSUME(toks.DelayCmd)
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
            {ALT: ()=> $.SUBRULE($.forScenes)},
            {ALT: ()=> $.SUBRULE($.forShots)},
        ])
        options.content = $.SUBRULE($.IfElseCmdBlock)
        
        return { type: CommandTypes.For, options }      
    })

    $.RULE("forRange", () => {
        let id = $.CONSUME(toks.Identifier).image
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.RangeOp)
        $.CONSUME(toks.LParen)
        let start = $.CONSUME(toks.IntegerLiteral).image
        let end
        let step = 1
        $.OPTION(() => {
            $.CONSUME(toks.Comma);
            end = $.CONSUME1(toks.IntegerLiteral).image
        })
        $.OPTION1(() => {
            $.CONSUME1(toks.Comma);
            step = $.CONSUME2(toks.IntegerLiteral).image
        })

        $.CONSUME(toks.RParen)
        if (!end) { end = parseInt(start); start = 0 }
        else { start = parseInt(start); end = parseInt(end); step = parseInt(step) }
        return { type: IteratorTypes.Range, id, start, end, step }
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
        let id = $.CONSUME(toks.Identifier).image
        let elements = []
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        
        $.AT_LEAST_ONE_SEP({
            SEP: toks.Comma,
            DEF: () => $.SUBRULE2($.value)
        })
        $.CONSUME(toks.RBracket)
        return { type: IteratorTypes.Array, id, elements }
    })

    $.RULE("forScenes", () => {
        let id = $.CONSUME(toks.SceneId).image
        let elements = []
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.SceneId).image)
        $.CONSUME(toks.RBracket)
        return { type: IteratorTypes.Set, id, elements }
    })

    $.RULE("forCast", () => {
        let id = $.CONSUME(toks.CastId).image
        let elements = []
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.CastId).image)
        $.CONSUME(toks.RBracket)
        return { type: IteratorTypes.Set, id, elements }
    })

    $.RULE("forRoles", () => {
        let id = $.CONSUME(toks.RoleId).image
        let elements = []
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.RoleId).image)
        $.CONSUME(toks.RBracket)
        return { type: IteratorTypes.Set, id, elements }
    })

    $.RULE("forShots", () => {
        let id = $.CONSUME(toks.Identifier).image
        let elements = []
        $.CONSUME(toks.InOp);
        $.CONSUME(toks.LBracket)
        $.AT_LEAST_ONE( () => $.CONSUME2(toks.Identifier).image)
        $.CONSUME(toks.RBracket)
        return { type: IteratorTypes.Set, id, elements }
    })

}
