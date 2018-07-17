const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // cast-definition-block
    //  : CAST_STATEMENT COLON INDENT cast-definition* DEDENT
    // ;
    $.RULE('cast', () => {
        $.CONSUME(toks.CastSec);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            $.SUBRULE($.castDef)
        })
        $.CONSUME(toks.Outdent)
    })
    // cast-definition
    // :  CAST_ID (alias-string)? (role-list)? string? 
    // |  ID (alias-string)? (role-list)? string? 
    // ;
    $.RULE("castDef", () => {
        $.OR([
            {ALT: ()=> $.CONSUME(toks.CastId)},
            {ALT: ()=> $.CONSUME(toks.Identifier)}
        ]);
        $.OPTION(() => {
            $.SUBRULE($.aliasString)
        })
        $.OPTION2(() => {
            $.SUBRULE($.roleIdList)
        })
        $.OPTION3(() => {
            $.CONSUME2(toks.StringLiteral)
        })
    })
   
}
