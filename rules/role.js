const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // alias-string
    // : LPREN string RPREN
    // ;
    $.RULE('aliasString', () => {
        $.CONSUME(toks.LParen);
        $.CONSUME(toks.StringLiteral)
        $.CONSUME(toks.RParen);
    })
    //  role-definition-block
    // : ROLES_STATEMENT COLON INDENT role-definition* DEDENT
    // ;
    $.RULE('roles', () => {
        $.CONSUME(toks.RoleSec);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            $.SUBRULE($.roleDef)
        })
        $.CONSUME(toks.Outdent)
    })
    // role-definition
    // : ROLE_ID (alias-string)? string?
    // | ID (alias-string)? string?
    // ;
    $.RULE("roleDef", () => {
        $.OR([
            {ALT: ()=> $.CONSUME(toks.RoleId)},
            {ALT: ()=> $.CONSUME(toks.Identifier)}
        ]);
        $.OPTION(() => {
            $.SUBRULE($.aliasString)
        })
        $.OPTION2(() => {
            $.CONSUME(toks.StringLiteral)
        })
    })
}