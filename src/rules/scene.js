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
        $.OPTION(()=> $.SUBRULE($.annotationList))

        $.CONSUME(toks.StorySec);
        $.OPTION1(() => $.SUBRULE($.aliasString))
        $.OPTION2(() => $.CONSUME(toks.StringLiteral))
        $.SUBRULE($.sceneContent);
    })
    // scene-definition 
    // :  SCENE_ID 
    // ;

    $.RULE('scene', () => {
        $.OPTION(()=> $.SUBRULE($.annotationList))
        $.OPTION1(() => $.SUBRULE($.subOperator)) 
        $.OPTION2(() => $.CONSUME(toks.SceneId))
        $.OPTION3(() => $.SUBRULE($.aliasString))
        $.OPTION4(() => $.CONSUME(toks.StringLiteral))
        $.SUBRULE($.sceneContent);
    })

    $.RULE('shotOrInt', () => {
        $.OR([
            {ALT: ()=> $.SUBRULE($.interaction)},
            {ALT: ()=> $.SUBRULE($.shot)}
        ])
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
       
        $.OPTION(() => {$.SUBRULE($.objectives)})
        $.OPTION1(() => {$.SUBRULE($.interactions)})
        $.OPTION2(() => $.SUBRULE($.startup))
        $.OPTION3(() => $.SUBRULE($.enter))

        
        $.OPTION4(() => {
            $.MANY(() => {
                $.SUBRULE($.shotOrInt)
            })
        })
        $.OPTION5(() => {
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
            $.OPTION(()=> $.SUBRULE($.annotationList))
            $.SUBRULE($.scene);
        })
        $.CONSUME(toks.Outdent);
    })
}