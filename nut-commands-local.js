const {CommandTypes, SymbolTypes} = require('./nut-types')

runCommandList = async (cmds)=> {
    for (let cmd of cmds) {
        if (cmd.type === CommandTypes.Tell) {
            await tell(cmd.options);
        } else if (cmd.type === CommandTypes.Delay) {
            await delay(cmd.options)
        }
    }
}

runStory = async (listener) => {
    let story = listener.story
    let scene = listener.firstScene
    if (story) {
        await runScene(story.id, listener.symTable)
    } else {
        await runScene(scene.id, listener.symTable)
    }
}

runScene = async (sceneId, symTable) => {
    let scene = symTable[sceneId];

    if (scene && scene.content && scene.content.startup) {
        await runCommandList(scene.content.startup)
    } if (scene && scene.content && scene.content.enter) {
        await runCommandList(scene.content.enter)
    }  if (scene && scene.content && scene.content.shots) {
        for (let i of scene.content.shots) {
            await runCommandList(i.content)
        }
    } 
    // If this is a story Play all the scenes beofre leave
    if (scene.type === SymbolTypes.Story) {
        await runScene(scene.next)
    }
    if (scene && scene.content && scene.content.leave) {
        await runCommandList(scene.content.leave)
    }
    // If this is a scene play next after leave
    if (scene.type === SymbolTypes.Scene) {
        await runScene(scene.next)
    }
}


tell = async (options) => {
    // early days
    console.log(options.desc)
}
// I am not a fan of timers, but --- early days
function timeout(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
 }
delay = async (options) => {
    // early days 
    //console.log(options.ms)
    await timeout(options.ms)
}

module.exports = {
    runStory
}