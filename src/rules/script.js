import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

//module.exports = 
export default  ($) => {
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
        $.OPTION1(() => $.SUBRULE($.imports))
        $.OPTION2(() => $.SUBRULE($.media))
        $.OPTION3(() => $.SUBRULE($.roles))
        $.OPTION4(() => $.SUBRULE($.cast))
        $.OPTION5(() => $.SUBRULE($.story))
        $.OPTION6(() => $.SUBRULE($.scenes))
        $.popScript()
    })
    // script-data
    // : SCRIPT_STATEMENT alias-string string
    // ;
    $.RULE('scriptData', () => {
        let id = $.CONSUME(toks.ScriptSec).image
        let alias = $.OPTION(() => $.SUBRULE($.aliasString))
        let desc = $.OPTION1(() => $.CONSUME(toks.StringLiteral).image)
        let main = $.OPTION2(() => $.CONSUME(toks.SceneId).image)
        $.addScript({id, alias, desc, main})
    })
}