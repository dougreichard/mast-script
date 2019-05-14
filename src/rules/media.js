const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    //     media-definition
    //     : MEDIA_ID  alias-string
    //     ;
    $.RULE('mediaDef', () => {
        $.CONSUME(toks.MediaId).image;
        $.SUBRULE($.aliasString).image;
    })
    // media-definition-block
    //     : MEDIA_STATEMENT COLON INDENT media-definition* DEDENT
    //     ;
    $.RULE('media', () => {
        $.CONSUME(toks.MediaSec);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            $.SUBRULE($.mediaDef)
        })
        $.CONSUME(toks.Outdent)
    })
}