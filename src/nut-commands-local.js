const {UnwindTypes, InteractionTypes, IteratorTypes, CommandTypes, SymbolTypes } = require('./nut-types')
const MastDown = require("./nut-format-simple")

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Runner {
    constructor() {
        
    }

    async prompt(n) {
        return getRandomInt(n)            
    }

    async runStory(listener) {
        let story = listener.story
        let scene = listener.firstScene
        this.scopes = listener.scopes
        this.formatter = new MastDown(this.scopes)

        if (story) {
            await this.runScene(story.id)
        } else if (scene) {
            await this.runScene(scene.id)
        } else {
            this.log('No entry point')
        }
    }

    async log(...args) {
        console.log(...args)
    }

    async runCommandList(cmds) {
        for await (let cmd of cmds) {
            if (cmd.type === CommandTypes.Tell) {
                await this.tell(cmd.options);
            } else if (cmd.type === CommandTypes.Delay) {
                await this.delay(cmd.options)
            } else if (cmd.type === CommandTypes.Do) {
                await this.doCmd(cmd.options)
            } else if (cmd.type === CommandTypes.For) {
                await this.forCmd(cmd.options)
            } else if (cmd.type === CommandTypes.Set) {
                await this.setCmd(cmd.options)
            } else if (cmd.type === CommandTypes.As) {
                await this.asCmd(cmd.options)
            } else if (cmd.type === CommandTypes.Scene) {
                // return Unwind Stack and play scene
                return {type: UnwindTypes.Scene, next: cmd.options.id}
            }
        }
    }
    async runScene(sceneId) {
        let scene = this.scopes.findStoryKey(sceneId);
        if (!scene) {
            return
        }
        let firstShot
        let shotMap = {}
        if (scene.content.shots) {
            for (let s of scene.content.shots) {
                if (!firstShot && !s.sub) {
                    firstShot = s
                }
                shotMap[s.id] = s
            }
        }


        this.scopes.push(shotMap)
        let unwind 
        if (scene.content && scene.content.startup) {
            unwind = await this.runCommandList(scene.content.startup)
        } 
        if (!unwind && scene.content && scene.content.enter) {
            unwind = await this.runCommandList(scene.content.enter)
        } 
        if (!unwind && scene.content && scene.content.shots) {
            if (firstShot) {
                unwind = await this.runShots(firstShot)
            }
        }
        this.scopes.pop();

        if (scene.type === SymbolTypes.Scene && scene.content && scene.content.leave) {
            unwind = await this.runCommandList(scene.content.leave)
        }
        let next = unwind? unwind.next : scene.next
        // If this is a scene play next after leave
        if (next) {
            setImmediate(() => this.runScene(next))
        } else {
            let story = this.scopes.findStoryKey("story")
            if (story && story.content && story.content.leave) {
                await this.runCommandList(story.content.leave)
            }
        }
    }

    async runShots(firstShot) {
        return new Promise((res, rej) => {
            setImmediate(() => this.runShot(firstShot.id, res))
        })
    }

    async runShot(shotId, done) {
        let shot = this.scopes.findKey(shotId);
        if (!shot) {
            done()
            return
        }
        let unwind
        if (shot.type === SymbolTypes.Shot) {
            if (shot.content) {
                unwind = await this.runCommandList(shot.content)
            }
        } else if (shot.type === SymbolTypes.Interaction) {
            unwind = await this.runInteraction(shot)            
        }
        if (!unwind && shot.next) {
            setImmediate(() => this.runShot(shot.next, done))
        } else if (!shot.sub) {
            done(unwind)
        }
    }

    

    async runInteraction(inter) {
        if (inter.content.type === InteractionTypes.Choice) {
            this.log(inter.desc)
            for(let i=0, l =inter.content.choices.length; i<l ;i++) {
                let item = inter.content.choices[i];
                this.log(`${i+1}. ${item.prompt}`)
            }
            // Selecting choice 0
            let c = await this.prompt(inter.content.choices.length)
            return await this.runCommandList(inter.content.choices[c].content)
        }
    }
    ///////////////////////////////////////////////////////////////////////////
    ////
    ////  COMMANDS
    ////
    async tell(options) {
        // early days
        this.log(this.formatter.render(options.desc))
    }

    async asCmd(options) {
        // As command lets the story put words into people mouths
        await this.runCommandList(options.content)
    }

    // I am not a fan of timers, but --- early days
    async timeout(t, val) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(val);
            }, t);
        });
    }
    async delay(options) {
        // early days 
        //console.log(options.ms)
        await this.timeout(options.ms)
    }

    async setCmd(options) {
        let value = options.value
        if (options.exp) {
            value = this.scopes.getValue(options.exp)
        }
        for (let id of options.lhs.ids) {
            let fqn = id + options.lhs.elements
            this.scopes.setValue(fqn, value, options.op)
        }

    }

    async doCmd(options, scopes) {
        let shots = options.shots
        if (options.together) {
            let all = []
            for (let s of shots) {
                all.push(this.runShot(s, () => { }))
            }
            await Promise.all(all)
        } else {
            for (let s of shots) {
                await this.runShot(s, () => { })
            }
        }

    }
    * range(start, end, step) {
        if (start < end && step > 0) {
            for (var i = start; i < end; i += step) yield i;
        } else if (start > end && step < 0) {
            for (var i = start; i > end; i += step) yield i;
        } else {
            yield 0
        }

    }

    async forCmd(options) {
        let iter
        let scope = {}
        let ret
        scope[options.id] = 0
        this.scopes.push(scope)
        if (options.type === IteratorTypes.Range) {
            iter = this.range(options.start, options.end, options.step)
        }
        for await (let i of iter) {
            scope[options.id] = i
            // console.log(scopes.getValue(options.id))
            ret = await this.runCommandList(options.content)
        }
        this.scopes.pop()
        return ret
    }

}



let runner = new Runner()
runStory = async (listener) => {
    runner.runStory(listener)
}


module.exports = {
   // runStory,
    Runner
}