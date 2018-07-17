module.exports = function(ee) {
    this.accept = (a) => {
        if (!a) return;
        return a.accept(ee);
    }

    ee.on('sps:script', (script)=>{
        if (script.roles) {
            this.accept(script.roles);

        }
        if (script.cast) {
            this.accept(script.cast);
        }
        if (script.story) {
            this.accept(script.story);
        }
        if (script.scenes) {
            this.accept(script.scenes);
        }
        ee.emit("EOF");
        
    })

    ee.on('sps:startup', (startup) => {
        this.accept(startup.commands)
    });
    
    ee.on('sps:enter', (enter) => {
        this.accept(enter.commands)
    });

    ee.on('sps:leave', (leave) => {
        this.accept(leave.commands)
    });
    

    ee.on('sps:scene', (scene) => {
        this.accept(scene.commands);
    })

    ee.on('sps:objective', (obj) => {
        this.accept(obj.conditions);
    })
    ee.on('sps:interaction', (obj) => {
        this.v.accept(obj.form);

            this.accept(obj.conditions);
    })

    ee.on('sps:whenIfElse', (obj) => {
        if (obj.condition) obj.condition.accept(this);
    })
    ee.on('sps:delay', (delay) => {
        this.accept(delay.commands);
    });
    return ee;
}
