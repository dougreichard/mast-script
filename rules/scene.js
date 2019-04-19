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
        let scene = { id, alias, desc, value}
        $.pushStory(scene)
        let content = $.SUBRULE($.sceneContent);
        scene.content = content
        $.popStory(scene)
        return scene
    })
    // scene-definition 
    // :  SCENE_ID 
    // ;

    $.RULE('scene', () => {
        let sub = $.OPTION(() => $.SUBRULE($.subOperator)?true:false) 
        let id = $.OPTION1(() => $.CONSUME(toks.SceneId).image) 
        id = id ? id : $.anonymousID('$') 
        let alias = $.OPTION2(() => $.SUBRULE($.aliasString))
        let desc = $.OPTION3(() => $.CONSUME(toks.StringLiteral).image)
        let value = $.OPTION4(() =>  $.SUBRULE($.objectValue))

        let scene = { id, alias, desc, value, sub}
        $.pushScene(scene)
        let content = $.SUBRULE($.sceneContent);
        scene.content = content
        $.popScene(scene)
        return scene
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
        let content = {}

        $.CONSUME(toks.Colon);
        $.CONSUME(toks.Indent);
        $.OPTION2(() => {
            $.SUBRULE($.objectives)
        })
        $.OPTION3(() => {
            $.SUBRULE($.interactions)
        })
        $.OPTION4(() => {
            content.startup = $.SUBRULE($.startup)
        })
        $.OPTION5(() => {
            content.enter = $.SUBRULE($.enter)
        })

        $.OPTION6(() => {
            let shots = []
            $.MANY(() => {
                let shot = $.OR([
                    {ALT: ()=> $.SUBRULE($.interaction)},
                    {ALT: ()=> $.SUBRULE($.shot)}
                ])
                shots.push(shot)
            })
            if (shots.length) {
                content.shots = shots
            }
        })
        $.OPTION7(() => {
            content.leave = $.SUBRULE($.leave)
        })

        $.CONSUME(toks.Outdent);
        return content;
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