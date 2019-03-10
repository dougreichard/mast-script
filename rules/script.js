const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // script
    // : (script-data)? 
    //   (media-definition-block)? 
    //   (role-definition-block)? 
    //   (cast-definition-block)?  
    //   (story-definition)? 
    //   (scene-definition-block)? EOF_STATEMENT
    $.RULE('script', () => {
        let script = $.OPTION(() => $.SUBRULE($.scriptData))
        $.pushScript(script)
        $.OPTION1(() => $.SUBRULE($.media))
        $.OPTION2(() => $.SUBRULE($.roles))
        $.OPTION3(() => $.SUBRULE($.cast))
        $.OPTION4(() => $.SUBRULE($.story))
        $.OPTION5(() => $.SUBRULE($.scenes))
        $.popScript()
    })
    // script-data
    // : SCRIPT_STATEMENT alias-string string
    // ;
    $.RULE('scriptData', () => {
        let id = $.CONSUME(toks.ScriptSec).image
        let alias = $.OPTION(() => $.SUBRULE($.aliasString))
        let desc = $.OPTION2(() => $.CONSUME(toks.StringLiteral).image)
        $.addScript({id, alias, desc})
    })
}