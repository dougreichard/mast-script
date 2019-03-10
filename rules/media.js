const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    //     media-definition
    //     : MEDIA_ID  alias-string
    //     ;
    $.RULE('mediaDef', () => {
        let id = $.CONSUME(toks.MediaId).image;
        let uri = $.SUBRULE($.aliasString).image;
        $.addMedia({id, uri})
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