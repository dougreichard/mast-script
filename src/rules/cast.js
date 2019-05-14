const spsLexer = require('../nut-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = //{castRules: 
    ($) => {
    // cast-definition-block
    //  : CAST_STATEMENT COLON INDENT cast-definition* DEDENT
    // ;
    $.RULE('cast', () => {
        $.CONSUME(toks.CastSec);
        $.CONSUME(toks.Colon)
        $.CONSUME(toks.Indent)
        $.MANY(() => {
            $.SUBRULE($.castDef)
        })
        $.CONSUME(toks.Outdent)
    })
    // cast-definition
    // :  CAST_ID (alias-string)? (role-list)? string? 
    // |  ID (alias-string)? (role-list)? string? 
    // ;
    $.RULE("castDef", () => {
        $.SUBRULE($.annotationList)
        $.OR([
            {ALT: ()=> $.CONSUME(toks.CastId).image},
            {ALT: ()=> '@'+$.CONSUME(toks.Identifier).image}
        ]);
        $.OPTION(() =>  $.SUBRULE($.aliasString))
        $.OPTION2(() => $.SUBRULE($.roleIdList))
        $.OPTION3(() =>  $.CONSUME2(toks.StringLiteral).image)
    })

}

/*
,
visits: ($) => {
    // #region Cast
    $.VISIT('cast', (ctx)=> {
        //console.log('cast');
        //super.cast(ctx);
        //ctx.castDef.forEach((i)=> this.visit(i))
        $.visitChildren(ctx.castDef)
        //this.defaultVisit(ctx)
    })

    $.VISIT('castDef',  (ctx)=>{
        let annotations = $.annotationList(ctx);
        let alias = $.aliasString(ctx);
        let desc = ctx.StringLiteral ? this.trimString(ctx.StringLiteral[0].image) : '';
        let id = ctx.CastId[0].image
        annotations.meta = { id, alias, desc }
        annotations.id = id
        console.log(`castDef: ${id} ${alias} ${desc}`);
    })
    // #endregion
}

}
*/
