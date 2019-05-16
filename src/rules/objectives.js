import spsLexer from '../nut-lex.js'
const toks = spsLexer.tokens

//module.exports = 
export default ($) => {
    $.RULE('objectives', () => {
        $.CONSUME(toks.ObjectiveSec);
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent);
        $.MANY(() => {
            $.SUBRULE1($.objective)
        })
        $.CONSUME(toks.Outdent);
    })
    // objective-command 
    // : OBJECTIVE_ID role-cast-list string show-state? COLON (objective-when-block)?
    // ;
    $.RULE('objective', () => {
        let id
        let target
        let desc
        $.OR([
            { ALT: () => id = $.CONSUME(toks.ObjectiveId).image },
            { ALT: () => id = '*' + $.CONSUME(toks.Identifier).image }
        ])
        target = $.SUBRULE($.roleCastIdList);
        desc = $.CONSUME(toks.StringLiteral).image;
        $.addObjective({ id, target, desc })
    })

}