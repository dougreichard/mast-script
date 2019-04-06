const spsLexer = require('../sps-lex')
const submitRules = require('./submit');
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens


module.exports = ($) => {
    submitRules($)
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
    //     | INTERACTION_STATEMENT INTERACTION_ID? role-cast-list? string?  SEARCH
    //     ;
    $.RULE('interaction', () => {
        let id = $.CONSUME(toks.InteractionId).image;
        let audience  = $.SUBRULE($.roleCastIdList)
        let desc = $.CONSUME(toks.StringLiteral).image;
        $.pushInteraction({id, audience, desc})
        $.SUBRULE($.interactionBlockItem)
        $.popInteraction(id)
    })

    $.RULE('interactionBlockItem', () => {
        $.OR([
            { ALT: () => $.SUBRULE($.form) },
            { ALT: () => $.SUBRULE($.choiceInteraction) },
            { ALT: () => $.SUBRULE($.searchCmd) },
            { ALT: () => $.SUBRULE($.completeObjCmd) },
            { ALT: () => $.SUBRULE($.KeysInteraction) },
            { ALT: () => $.SUBRULE($.MediaInteraction) },
        ])
    })

    $.RULE('choiceInteraction', () => {
        $.CONSUME(toks.ChoiceBlock);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        
        $.MANY(()=> {
            $.OPTION(()=> $.SUBRULE($.roleCastIdList))
            $.CONSUME(toks.StringLiteral)
            $.SUBRULE($.IfElseCmdBlock)
         })
         $.CONSUME(toks.Outdent) 
    })

    $.RULE('KeysInteraction', () => {
        $.CONSUME(toks.KeysBlock);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)                  
        $.MANY(()=> {
            $.CONSUME(toks.StringLiteral)
            $.SUBRULE($.IfElseCmdBlock)
         })
         $.CONSUME(toks.Outdent)       
    })

    $.RULE('MediaInteraction', () => {
        $.CONSUME(toks.MediaSec);
        $.CONSUME(toks.MediaId);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)                  
        $.MANY(()=> {
            $.SUBRULE($.ClickData)
            $.SUBRULE($.IfElseCmdBlock)
         })
         $.CONSUME(toks.Outdent)       
    })
    $.RULE('ClickData', () => {
        $.CONSUME(toks.ClickCmd);
        $.CONSUME1(toks.IntegerLiteral);
        $.CONSUME2(toks.Comma);
        $.CONSUME3(toks.IntegerLiteral);
        $.CONSUME4(toks.Comma);
        $.CONSUME5(toks.IntegerLiteral);
        $.CONSUME6(toks.Comma);
        $.CONSUME7(toks.IntegerLiteral);
        
    })

    $.RULE('completeObjCmd', () => {
        $.CONSUME(toks.CompleteCmd);
        $.SUBRULE($.ObjectiveIdList)
        $.SUBRULE($.IfElseCmdBlock)
    })


    $.RULE('form', () => {
        $.CONSUME(toks.FormBlock);
        $.SUBRULE($.formElementBlock)
        //$.SUBRULE($.submitFormElement)
    })
    $.RULE('formElementBlock', () => {
        $.OR([
            { ALT: () => $.SUBRULE($.formElement) },
            {
                ALT: () => {
                    $.CONSUME(toks.Colon)
                    $.CONSUME(toks.Indent)
                    $.MANY(()=>$.SUBRULE1($.formElement))
                    $.CONSUME(toks.Outdent)
                }
            }
        ])
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
        $.CONSUME(toks.Identifier)
    })
    $.RULE('labelFormElement', () => {
        $.CONSUME(toks.LabelElement)
        $.CONSUME(toks.StringLiteral);
    }) 
    $.RULE('selectFormElement', () => {
        $.CONSUME(toks.SelectElement)
        $.CONSUME(toks.Identifier)
        $.SUBRULE($.selectChoiceList)
    })

    $.RULE('selectChoiceList', () => {
            $.CONSUME(toks.Colon);
            $.CONSUME(toks.Indent)
            $.MANY(()=> $.SUBRULE1($.selectChoice))
            $.CONSUME(toks.Outdent)
    })

    $.RULE("selectChoice", ()=> {
        $.OR([
            {ALT: ()=> $.CONSUME(toks.RoleId)},
            {ALT: ()=> $.CONSUME(toks.CastId)},
            {ALT: ()=> $.CONSUME(toks.StringLiteral)}
        ])
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
    
}