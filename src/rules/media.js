import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

//module.exports = 
export default ($) => {
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