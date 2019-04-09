const spsLexer = require('../nut-lex')
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
        let alias = $.OPTION(() => $.SUBRULE($.aliasString))
        let desc = $.OPTION1(() => $.CONSUME(toks.StringLiteral).image)
        let value = $.OPTION2(() =>  $.SUBRULE($.objectValue))
        let id = '$$story'
        $.pushScene({ id, alias, desc, value })
        $.SUBRULE($.sceneContent);
        $.popScene(id)
    })
    // scene-definition 
    // :  SCENE_ID 
    // ;

    $.RULE('scene', () => {

        let id = $.OPTION(() => $.CONSUME(toks.SceneId).image) 
        id = id ? id : $.anonymousID('$') 
        let alias = $.OPTION1(() => $.SUBRULE($.aliasString))
        let desc = $.OPTION2(() => $.CONSUME(toks.StringLiteral).image)
        let value = $.OPTION3(() =>  $.SUBRULE($.objectValue))

        $.pushScene({ id, alias, desc, value })
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
            $.MANY(() => {
                $.OR([
                    {ALT: ()=> $.SUBRULE($.interaction)},
                    {ALT: ()=> $.SUBRULE($.shot)}
                ])
            })
        })
        $.OPTION7(() => {
            $.SUBRULE($.leave)
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