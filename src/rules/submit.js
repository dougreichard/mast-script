import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

//module.exports = 
export default ($) => {
    $.RULE('submitFormElement', () => {
        $.CONSUME(toks.SubmitElement)
        $.OPTION(() => $.CONSUME(toks.StringLiteral))
        $.OPTION1(() => $.SUBRULE($.submitIfElseBlock))
    })
    $.RULE("submitIfElseBlock", () => {
        // $.SUBRULE($.submitConditions)
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent)
        $.OPTION(() => {
            $.SUBRULE($.IfCmd)
            $.OPTION1(() => $.MANY(() => $.SUBRULE1($.ElseCmd)))
        })
        $.OPTION2(() => $.SUBRULE2($.AlwaysCmd))
        $.CONSUME(toks.Outdent)
    })
    $.RULE("IfCmd", () => {
        $.CONSUME(toks.If)
        $.SUBRULE($.Condition)
        $.SUBRULE1($.IfElseCmdBlock)
    })
    $.RULE("ElseCmd", () => {
        $.CONSUME(toks.Else)
        $.OR([
            { ALT: () => $.SUBRULE($.IfCmd) },
            { ALT: () => $.SUBRULE($.IfElseCmdBlock) }
        ])

    })
    $.RULE("AlwaysCmd", () => {
        $.CONSUME(toks.Always)
        $.SUBRULE($.IfElseCmdBlock)
    })
    $.RULE("IfElseCmdBlock", () => {
        let cmds = []
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent)
        $.OR([
            { ALT: () => $.CONSUME(toks.PassCmd) },
            {
                ALT: () => $.MANY(() => {
                    let annotations= $.SUBRULE($.annotationList)
                    let cmd = $.SUBRULE($.ifElseValidCmd)          
                    if (cmd) {
                        cmd.annotations = annotations
                        cmds.push(cmd)
                    }
                })
            }
        ])
        $.CONSUME(toks.Outdent)
        return cmds
    })

    $.RULE("ifElseValidCmd", () => {
        return $.OR([
            { ALT: () => $.SUBRULE($.asCmd) },
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
}
