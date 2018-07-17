const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE('interactions', () => {
        $.CONSUME(toks.InteractionSec);
        $.OR([
            { ALT: () => $.SUBRULE($.interaction) },
            {
                ALT: () => {
                    $.CONSUME(toks.Colon);
                    $.CONSUME(toks.Indent);
                    $.MANY(() => {
                        $.SUBRULE1($.interaction)
                    })
                    $.CONSUME(toks.Outdent);
                }
            }
        ])
    })

    // interaction-command 
    //     : INTERACTION_STATEMENT INTERACTION_ID? role-cast-list? string?  FORM
    //     | INTERACTION_STATEMENT INTERACTION_ID? role-cast-list? string?  SEACH
    //     ;
    $.RULE('interaction', () => {
        $.CONSUME(toks.InteractionId);
        $.SUBRULE($.roleCastIdList)
        $.CONSUME(toks.StringLiteral);
        $.SUBRULE($.interactionBlockItem)
    })


    $.RULE('interactionBlockItem', () => {
        $.OR([
            { ALT: () => $.SUBRULE($.form) },
            { ALT: () => $.SUBRULE($.searchCmd) },
        ])
    })


    $.RULE('form', () => {
        $.CONSUME(toks.FormBlock);
        $.SUBRULE($.formElementBlock)
        $.SUBRULE($.ifElseBlock)
    })
    $.RULE('formElementBlock', () => {
        $.OR([
            { ALT: () => $.SUBRULE($.formElement) },
            {
                ALT: () => {
                    $.CONSUME(toks.Colon)
                    $.CONSUME(toks.Indent)
                    $.SUBRULE1($.formElement)
                    $.CONSUME(toks.Outdent)
                }
            }
        ])
    })

    $.RULE('ifElseBlock', () => {
        $.OPTION(() => {
            $.SUBRULE($.ifStatement)
            $.MANY(() => $.SUBRULE($.elseStatement))
        })
    })

    $.RULE('ifStatement', () => {
        $.CONSUME($.If)
    })

    $.RULE('elseStatement', () => {
        $.CONSUME($.Else)
    })


    $.RULE('formElement', () => {
        $.OR([
            { ALT: () => $.SUBRULE($.inputFormElement) },
            { ALT: () => $.SUBRULE($.labelFormElement) },
            { ALT: () => $.SUBRULE($.selectFormElement) },
            { ALT: () => $.SUBRULE($.submitFormElement) }
        ])
    })
    $.RULE('inputFormElement', () => {
        $.CONSUME(toks.InputElement)
    })
    $.RULE('labelFormElement', () => {
        $.CONSUME(toks.LabelElement)
    }) 
    $.RULE('selectFormElement', () => {
        $.CONSUME(toks.SelectElement)
    })
    $.RULE('submitFormElement', () => {
        $.CONSUME(toks.SubmitElement)
    })

    // NOTE: Change this from original the interaction has the who is search
    /// the search block has the FOR who
    // search-command
    // : SEARCH_STATEMENT role-cast-list
    // ;
    $.RULE('searchCmd', () => {
        $.CONSUME(toks.SearchCmd)
        $.SUBRULE($.roleCastIdList)
       // $.SUBRULE($.seachConditionals)
    })

    // $.RULE("whenBlock", ()=> {
    //     $.CONSUME(toks.WhenSec)
    //     // $.SUBRULE($.whenCond)
    //     $.SUBRULE($.whenCmdBlock)
    // })
    $.RULE("ifElseCmdBlock", ()=> {
        $.OR([
            {ALT: ()=> $.SUBRULE($.ifElseCmd)},
            {ALT: ()=> {
                    $.CONSUME(toks.Colon);
                    $.CONSUME(toks.Indent)
                    $.MANY(()=> $.SUBRULE1($.ifElseCmd))
                    $.CONSUME(toks.Outdent)
                }
            },
        ])
    })
    $.RULE("ifElseCmd", ()=> {
        $.OR([
            {ALT: ()=> $.SUBRULE($.tellCmd)},
            // {ALT: ()=> $.SUBRULE($.sceneCmd)},
            // {ALT: ()=> $.SUBRULE($.setCmd)},
            {ALT: ()=> $.SUBRULE($.delayCmd)},
            // {ALT: ()=> $.SUBRULE($.completeCmd)},
            // {ALT: ()=> $.SUBRULE($.failCmd)},
            // {ALT: ()=> $.SUBRULE($.showCmd)},
            // {ALT: ()=> $.SUBRULE($.askCmd)}
        ])
    })


}