function gen(script, parser, options) {
        let v = new Echo();
        script.accept(v);
        return v.str;
}

let EventEmitter = require('events');

class Echo extends EventEmitter {
    constructor() {
        super();

        this.str = ''
        this.indentCount = 0;
    

        this.on('sps:script', (script)=>{
            this.writeLine('// '+Math.random());
            if (script.roles) {

                this.writeLine('roles:');
                this.indent();
                this.accept(script.roles);
                this.dedent();
            }
            if (script.cast) {
                this.writeLine('cast:');
                this.indent();
                this.accept(script.cast);
                this.dedent();
            }
            if (script.story) {
                this.accept(script.story);
            }
            if (script.scenes) {
                this.writeLine('scenes:');
                this.indent();
                this.accept(script.scenes);
                this.dedent();
            }
        })

        this.on('sps:startup', (startup) => {
            this.printIndent();
            this.writeLine('startup:');
            this.indent();
            this.accept(startup.commands)
            this.dedent();
        });
        
        this.on('sps:enter', (enter) => {
            this.printIndent();
            this.writeLine('enter:');
            this.indent();
            this.accept(enter.commands)
            this.dedent();
        });

        this.on('sps:leave', (leave) => {
            this.printIndent();
            this.writeLine('leave:');
            this.indent();
            this.accept(leave.commands)
            this.dedent();
        });

        this.on('sps:tell', (tell) => {
            this.printIndent();
            this.write('tell');
            this.visitRoleCastList(tell.to);
            this.writeLine('`'+tell.message+'`');
        });

        this.on('sps:delay', (delay) => {
            this.printIndent();
            this.write('delay');
            if (delay.time.m) {
                this.write(delay.time.m+'m');
            }
            if (delay.time.s) {
                this.write(delay.time.s+'s');
            }
            if (delay.time.ms) {
                this.write(delay.time.ms+'ms');
            }
            this.writeLine(':');
            this.indent();
            this.accept(delay.commands);
            this.dedent();
            this.writeLine('');
        });

        this.on('sps:search', (search) => {
            this.printIndent();
            this.write('search');
            this.visitRoleCastList(search.who);
            this.visitRoleCastList(search.sees);
            this.writeLine('');
        });


        this.on('sps:role', (role) => {
            this.printIndent();
            this.write(role.name);
            if (role.alias) {
                this.write( "('"+role.alias+"')");
            }
            if (role.description) {
                this.write('`'+ role.description + '`');
            }
            this.writeLine('');
        })

        this.on('sps:scene', (scene) => {
            this.printIndent();
            this.write(scene.name);
            if (scene.alias) {
                this.write( "('"+scene.alias+"')");
            }
            if (scene.description) {
                this.write('`'+ scene.description + '`');
            }
            
            this.writeLine(':');

            this.indent(); 
            for(let section of ['objectives','interactions','startup','enter','leave']) {
                
                if (scene[section]) {
                    this.printIndent()
                    this.writeLine(section+':');

                    this.indent();
                    this.accept(scene[section].commands);
                    this.dedent();


                }
                
            }
            this.dedent();
            

            this.writeLine('');
        })

        this.on('sps:cast', ( cast ) => {
            this.printIndent();
            this.write(cast.name);
            if (cast.alias) {
                this.write( "('"+cast.alias+"')");
            }
            

            if (cast.roles) {
                this.visitRoleCastList(cast.roles);
            }

            if (cast.description) {
                this.write( '`'+ cast.description + '`');
            }        
            this.writeLine('');
     
       });

       this.on('sps:objective', (obj) => {
            this.printIndent();
            this.write('objective');
            
            if (obj.id) this.write(obj.id);
            this.visitRoleCastList(obj.who);
            if (obj.description) this.write('`'+ obj.description+'`');
            if (obj.showState==false) this.write('hide');

            this.writeLine(':');
            this.indent();
            this.accept(obj.conditions);
            this.dedent();
        
       })


       this.on('sps:interaction', (obj) => {
            this.printIndent();
            this.write('interaction');
            
            if (obj.id) this.write(obj.id);
            if (obj.who) this.visitRoleCastList(obj.who);
            if (obj.description) this.write('`'+ obj.description+'`');

            this.writeLine(':');
            this.indent();
            
            obj.form.accept(this);
            if (obj.conditions) {
                this.accept(obj.conditions);
            }
            
            this.dedent();
            this.writeLine('');
       })

       this.on('sps:when-if-else', (obj) => {
            this.printIndent();
            this.write('when');
            if (obj.condition) {
                obj.condition.accept(this);
            }
            this.writeLine(':');
            this.indent();
            this.accept(obj.commands);
            this.dedent();
            this.writeLine('');
       })

       this.on('sps:near', (near) => {
            this.write('near');
            this.visitRoleCastList(near.who);
            this.visitRoleCastList(near.beacon);
       })

       this.on('sps:has-role', (has) => {
            this.write('has-role');
            this.visitRoleCastList(has.who);
            this.visitRoleCastList(has.roles);
       })

       this.on('sps:play-scene', (scene) => {
           this.printIndent();
            this.write('scene');
            this.writeLine(scene.scene)
       })

       
       
       
    }

    indent() {
        this.indentCount++;
    }
    dedent() {
        this.indentCount--;
    }

    printIndent() {
         this.write('   '.repeat(this.indentCount));
    }

    write(s) {
        this.str += s + ' ';
    }

    writeLine(s) {
        this.str += s + '\n';
    }
    
           

    visitRoleCastList(arr) {
        if (Array.isArray(arr)&& arr.length > 1) {
            this.write('[');
            for (let one of arr) {
                this.write(one);
            }
            
            this.write(']');
        } else {
            this.write(arr);
        }
    }

    accept(a) {
        return a.accept(this);
    }

}

module.exports = gen;







