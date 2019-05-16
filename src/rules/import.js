import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

//module.exports = 
export default ($) => {
    $.RULE('imports', () => {
        $.CONSUME(toks.ImportSec).image
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)  
        $.MANY(() => {
            $.CONSUME(toks.StringLiteral)
        })
        $.CONSUME(toks.Outdent)  
    })
}