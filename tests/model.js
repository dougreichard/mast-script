module.exports =   (ee) => {
    this.accept = (a) => {
        if (!a) return;
        return a.accept(ee);
    }
     ee.on('sps:script', (script)=>{
        ee.script = script;
        ee.script.model = {cast: {}, roles:{}, role_cast:{}, cast_role:{}, sees:{}}
        ee.model = ee.script.model

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


    ee.on('sps:cast', (cast) => {
        ee.model.cast[cast.name] = cast;
        // Create cross referening of roles and cast
        if (cast.roles) {
            for(let role of cast.roles) {
                if (!ee.model.role_cast[role]) {
                    ee.model.role_cast[role] = {}
                }
                ee.model.role_cast[role][cast.name] = true;
                if (!ee.model.cast_role[cast.name]) {
                    ee.model.cast_role[cast.name] = {}
                }
                ee.model.cast_role[cast.name][role] = true;
            }
            cast.roles = null
        }
        
    })
    ee.on('sps:role', (role) => {
        ee.model.roles[role.name] = role;
    })
    ee.on('sps:search', (search) => {
        
    })

    ee.on('sps:story', (story) => {
        ee.script.scenes['story'] = story
    })

    ee.on('sps:scene', (scene) => {
        ee.script.scenes[scene.name] = scene
        // Add a default as the first if no story
        if (!ee.script.scenes['story']) {
            ee.script.scenes['story'] = scene;
        }
    })

    ee.on('play:scene', (scene)=>{
       console.log(`playing scene ${scene.name}`); 
       if (scene.startup) {
            console.log(`has startup`);
            scene.startup.execute(()=> console.log('done')) 
       }
    
    })

    ee.on('EOF', ()=>{
        if (ee.script && ee.script.scenes) {
            ee.emit("play:scene", ee.script.scenes['story']);
        } 
    })
    return ee;
}
