const {CommandTypes, SymbolTypes} = require('./nut-types')

runCommandList = async (cmds, state)=> {
    for (let cmd of cmds) {
        if (cmd.type === CommandTypes.Tell) {
            await tell(cmd.options, state);
        } else if (cmd.type === CommandTypes.Delay) {
            await delay(cmd.options, state)
        } else if (cmd.type === CommandTypes.Do) {
            await doCmd(cmd.options, state)
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
    if (!scene) {
        return
    }
    let firstShot
    let shotMap = {}
    if (scene.content.shots) {
        for(let s of scene.content.shots) {
            if (!firstShot && !s.sub ) {
                firstShot = s
            }
            shotMap[s.id] = s
        }
    }

    let state = {symTable, shots: shotMap}
    if ( scene.content && scene.content.startup) {
        await runCommandList(scene.content.startup, state)
    } if (scene.content && scene.content.enter) {
        await runCommandList(scene.content.enter, state)
    }  if (scene.content && scene.content.shots) {
        if (firstShot) {
            await runShots(firstShot, symTable, shotMap)
        }
    } 
    
    if (scene.type === SymbolTypes.Scene && scene.content && scene.content.leave) {
        await runCommandList(scene.content.leave, state)
    }
    // If this is a scene play next after leave
    if (scene.next) {
        setImmediate(() => runScene(scene.next, symTable))
    } else {
        let story = symTable["$$story"]
        if (story && story.content && story.content.leave) {
            await runCommandList(story.content.leave, state)   
        }
    }
}

runShots = async (firstShot,  symTable, shots)  => {
    return new Promise((res,rej)=> {
        setImmediate(()=> runShot(firstShot.id, symTable, shots, res))
    })
}

runShot = async (shotId, symTable, shots, done) => {
    let shot = shots[shotId];
    if (!shot) {
        done()
        return
    }
    if (shot.content) {
        await runCommandList(shot.content, {symTable, shots})
    } 
    if (shot.next) {
        setImmediate(()=> runShot(shot.next, symTable, shots, done))
    } else if (!shot.sub) {
        done()
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

doCmd = async (options, state) => {
    let shots = options.shots
    if (options.together) {
        let all = []
        for(let s of shots) {
            all.push(runShot(s, state.symTable, state.shots, ()=>{}))
        }
        await Promise.all(all)
    } else {
        for(let s of shots) {
            await runShot(s, state.symTable, state.shots, ()=>{})
        }
    }
     
}

module.exports = {
    runStory
}