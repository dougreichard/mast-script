const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // alias-string
    // : LPREN string RPREN
    // ;
    $.RULE('aliasString', () => {
        $.CONSUME(toks.LParen);
        let alias = $.trimString($.CONSUME(toks.StringLiteral).image)
        $.CONSUME(toks.RParen);
        return alias
    })
    //  role-definition-block
    // : ROLES_STATEMENT COLON INDENT role-definition* DEDENT
    // ;
    $.RULE('roles', () => {
        $.CONSUME(toks.RoleSec);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            let role = $.SUBRULE($.roleDef)
            $.addRole(role)
        })
        $.CONSUME(toks.Outdent)
    })
    // role-definition
    // : ROLE_ID (alias-string)? string?
    // | ID (alias-string)? string?
    // ;
    $.RULE("roleDef", () => {
        $.SUBRULE($.annotationList)
        $.OR([
            {ALT: ()=> $.CONSUME(toks.RoleId).image},
            {ALT: ()=> '#'+ $.CONSUME(toks.Identifier).image}
        ]);
        $.OPTION(() =>  $.SUBRULE($.aliasString))
        $.OPTION2(() =>  $.CONSUME(toks.StringLiteral).image)
    })
}