const spsLexer = require('../nut-lex');
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens;
module.exports = ($) => {
    // cast-definition-block
    //  : CAST_STATEMENT COLON INDENT cast-definition* DEDENT
    // ;
    $.RULE('cast', () => {
        $.CONSUME(toks.CastSec);
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent);
        $.MANY(() => {
            let annotations = $.SUBRULE($.annotationList);
            let meta = $.SUBRULE($.castDef);
            annotations.meta = meta;
            annotations.id = meta.id;
            $.addCast(annotations);
        });
        $.CONSUME(toks.Outdent);
    });
    // cast-definition
    // :  CAST_ID (alias-string)? (role-list)? string? 
    // |  ID (alias-string)? (role-list)? string? 
    // ;
    $.RULE("castDef", () => {
        let id = $.OR([
            { ALT: () => $.CONSUME(toks.CastId).image },
            { ALT: () => '@' + $.CONSUME(toks.Identifier).image }
        ]);
        let alias = $.OPTION(() => $.SUBRULE($.aliasString));
        let roles = $.OPTION2(() => $.SUBRULE($.roleIdList));
        let desc = $.OPTION3(() => $.CONSUME2(toks.StringLiteral).image);
        return { id, alias, roles, desc };
    });
};
