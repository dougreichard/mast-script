const spsLexer = require('../nut-lex');
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens;
module.exports = ($) => {
    $.RULE('imports', () => {
        $.CONSUME(toks.ImportSec).image;
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent);
        $.pushImport();
        $.MANY(() => {
            let script = $.trimString($.CONSUME(toks.StringLiteral).image);
            $.importScript(script);
        });
        $.popImport();
        $.CONSUME(toks.Outdent);
    });
};
