const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    $.RULE('objectives', ()=>{
        $.CONSUME(toks.ObjectiveSec);
        $.OR([
            {ALT: () => $.SUBRULE($.objective)},
            {ALT: ()=> {
                $.CONSUME(toks.Colon);
                $.CONSUME(toks.Indent);
                $.MANY(()=>{
                    $.SUBRULE1($.objective)
                })
                $.CONSUME(toks.Outdent);
                }
            }
        ])
    })
    // objective-command 
    // : OBJECTIVE_ID role-cast-list string show-state? COLON (objective-when-block)?
    // ;
    $.RULE('objective', ()=>{
        $.OR([
            {ALT: ()=> $.CONSUME(toks.ObjectiveId)},
            {ALT: ()=> $.CONSUME(toks.Identity)}
        ])
        
        $.SUBRULE($.roleCastIdList);
        $.CONSUME(toks.StringLiteral);
    })


}