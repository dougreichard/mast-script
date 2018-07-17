const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    //     media-definition
    //     : MEDIA_ID  alias-string
    //     ;
    $.RULE('mediaDef', () => {
        $.CONSUME(toks.MediaId);
        $.SUBRULE($.aliasString);
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