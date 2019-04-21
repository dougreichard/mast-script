const {IteratorTypes, CommandTypes, SymbolTypes} = require('./nut-types')
const MastDown = require("./nut-format-simple")


runCommandList = async (cmds, scopes)=> {
    for await (let cmd of cmds) {
        if (cmd.type === CommandTypes.Tell) {
            await tell(cmd.options, scopes);
        } else if (cmd.type === CommandTypes.Delay) {
            await delay(cmd.options, scopes)
        } else if (cmd.type === CommandTypes.Do) {
            await doCmd(cmd.options, scopes)
        } else if (cmd.type === CommandTypes.For) {
            await forCmd(cmd.options, scopes)
        }
    }
}

runStory = async (listener) => {
    let story = listener.story
    let scene = listener.firstScene
    if (story) {
        await runScene(story.id, listener.scopes)
    } else {
        await runScene(scene.id, listener.scopes)
    }

}

runScene = async (sceneId, scopes) => {
    let scene = scopes.findStoryKey(sceneId);
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


    scopes.push(shotMap)
    if ( scene.content && scene.content.startup) {
        await runCommandList(scene.content.startup, scopes)
    } if (scene.content && scene.content.enter) {
        await runCommandList(scene.content.enter, scopes)
    }  if (scene.content && scene.content.shots) {
        if (firstShot) {
            await runShots(firstShot, scopes)
        }
    } 
    scopes.pop();

    if (scene.type === SymbolTypes.Scene && scene.content && scene.content.leave) {
        await runCommandList(scene.content.leave, scopes)
    }
    // If this is a scene play next after leave
    if (scene.next) {
        setImmediate(() => runScene(scene.next, scopes))
    } else {
        let story = scopes.findStoryKey("$$story")
        if (story && story.content && story.content.leave) {
            await runCommandList(story.content.leave, scopes)   
        }
    }
}

runShots = async (firstShot,  scopes)  => {
    return new Promise((res,rej)=> {
        setImmediate(()=> runShot(firstShot.id, scopes, res))
    })
}

runShot = async (shotId, scopes, done) => {
    let shot = scopes.findKey(shotId);
    if (!shot) {
        done()
        return
    }
    if (shot.type === SymbolTypes.Shot) { 
        if (shot.content) {
            await runCommandList(shot.content, scopes)
        } 
    } else if (shot.type === SymbolTypes.Interaction) {
        console.log(`Interaction ${shot.id}`)

    }
    if (shot.next) {
        setImmediate(()=> runShot(shot.next, scopes, done))
    } else if (!shot.sub) {
        done()
    }
}


tell = async (options, scopes) => {
    // early days
    let formatter = new MastDown(scopes)
    console.log(formatter.render(options.desc))
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

doCmd = async (options, scopes) => {
    let shots = options.shots
    if (options.together) {
        let all = []
        for(let s of shots) {
            all.push(runShot(s, scopes, ()=>{}))
        }
        await Promise.all(all)
    } else {
        for(let s of shots) {
            await runShot(s, scopes, ()=>{})
        }
    }
     
}
function* range(start, end, step) {
    if (start < end && step > 0 ) {
        for (var i = start; i < end; i+= step ) yield i;
    } else if (start > end && step < 0 ) {
        for (var i = start; i > end; i+= step ) yield i;
    } else {
        yield 0
    }
    
}

forCmd = async (options, scopes) => {
    let iter 
    let scope = {}
    scope[options.id] =0
    scopes.push(scope)
    if (options.type === IteratorTypes.Range) {
        iter = range(options.start, options.end, options.step)
    }
    for await (let i of iter ) {
        scope[options.id] = i
        // console.log(scopes.getValue(options.id))
        await runCommandList(options.content, scopes)
    }
    scopes.pop()
}

module.exports = {
    runStory
}