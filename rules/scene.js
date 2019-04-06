const spsLexer = require('../sps-lex')
// const { Parser } = require("chevrotain")
const toks = spsLexer.tokens

module.exports = ($) => {
    // story-definition
    // : STORY_STATEMENT (alias-string)? string? COLON INDENT 
    //  scene-content
    // DEDENT
    // ;
    $.RULE('story', () => {
        $.CONSUME(toks.StorySec);

        let alias = $.OPTION(() => {
            $.SUBRULE($.aliasString);
        })
        let desc = $.OPTION1(() => {
            $.CONSUME(toks.StringLiteral).image;
        })
        let id = '$$story'
        $.pushScene({ id, alias, desc })
        $.SUBRULE($.sceneContent);
        $.popScene(id)
    })
    // scene-definition 
    // :  SCENE_ID 
    // ;

    $.RULE('scene', () => {
        let id = $.anonymousID('$') 
        let alias
        let desc

        $.OPTION(() => {
            id = $.CONSUME(toks.SceneId).image;
        })
        $.OPTION1(() => {
            alias = $.SUBRULE($.aliasString);
        })
        $.OPTION2(() => {
            desc = $.CONSUME(toks.StringLiteral).image;
        })
        $.pushScene({ id, alias, desc })
        $.SUBRULE($.sceneContent);
        $.popScene(id)
    })
    // Common for story and Scene 
    // Story is the main scene
    //  ... (alias-string)? string? COLON INDENT 
    //   scene-content
    // DEDENT
    //   objective-section?\[objs]
    //   interaction-section?\[ints] 
    //   startup-section?\[start] 
    //   enter-section?\[enter] 
    //   leave-section?\[leave] 
    $.RULE('sceneContent', () => {

        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent);
        $.OPTION2(() => {
            $.SUBRULE($.objectives)
        })
        $.OPTION3(() => {
            $.SUBRULE($.interactions)
        })
        $.OPTION4(() => {
            $.SUBRULE($.startup)
        })
        $.OPTION5(() => {
            $.SUBRULE($.enter)
        })
        $.OPTION6(() => {
            $.SUBRULE($.leave)
        })
        $.OPTION7(() => {
            $.MANY(() => {
                $.OR([
                    {ALT: ()=> $.SUBRULE($.interaction)},
                    {ALT: ()=> $.SUBRULE($.shot)}
                ])
            })
        })
        $.CONSUME(toks.Outdent);

    })



    // scene-definition-block
    // : SCENES_STATEMENT COLON INDENT 
    //      scene-definition* 
    //  DEDENT
    // ;
    $.RULE('scenes', () => {
        $.CONSUME(toks.SceneSec);
        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent);
        $.MANY(() => {
            $.SUBRULE($.scene);
        })
        $.CONSUME(toks.Outdent);
    })
}