var assert = require('assert'),
    rail = require("../lib/index.js"),
    echogen = require('./echogen.js')
fs = require('fs'),
    errorCount = 0;

rail.parser.yy.parseError = function (message, details) {
    //text: lexer.match,
    //    token: this.terminals_[symbol] || symbol,
    //    line: lexer.yylineno,
    //    loc: yyloc,
    //    expected: expected
    errorCount++;
    if (!details.recoverable) {
        throw new Error(message)
    }
};


beforeEach(() => {
    errorCount = 0;
})

describe('Parse', function () {
    describe('Counting', function () {
        it('Parse cast.sps', function () {
            let script = rail.parse(fs.readFileSync('./tests/parse/cast.sps', 'utf8'), {})
            let counts = new Counter();
            script.accept(counts);
            assert.equal(counts.counts['sps:cast'], 8);
            assert.equal(counts.counts['sps:role'], 4);
            assert.equal(errorCount, 0);

            let cast1 = script.cast[0];
            assert.equal(cast1.name, "cast1");
            let roles = script.cast[0].roles[0];
            assert.equal(roles, "#role1")
        });
        it('Parse, Echo, Parse', function () {
            let script = rail.parse(fs.readFileSync('./tests/parse/delay.sps', 'utf8'), {})
            let counts = new Counter();
            script.accept(counts);

            let echo = echogen(script);
            let echoScript = rail.parse(echo, {})

            let echoCounts = new Counter();
            echoScript.accept(echoCounts);

            assert.equal(counts.counts['sps:delay'], echoCounts.counts['sps:delay']);
            assert.equal(script.scenes[0].name, echoScript.scenes[0].name);
            assert.equal(errorCount, 0);

        });
        it('Parse errors', function () {
            let script = rail.parse(fs.readFileSync('./tests/sample/simple.sps', 'utf8'), {})
            let counts = new Counter();
            script.accept(counts);

            assert.equal(errorCount, 10);

        });
        it('Resolve RoleCast', function () {
            let script = rail.parse(fs.readFileSync('./tests/parse/cast.sps', 'utf8'), {})
            let counts = new Counter();
            script.accept(counts);
            assert.equal(errorCount, 0);

            assertRolesRoleCast(script, '#story',
                {
                    cast1: true, cast2: true, cast3: true, cast4: true,
                    cast5: true, cast6: true, longtext: true, trigger: true
                });

            assertRolesRoleCast(script, '#role1',
                {
                    cast1: true, cast4: true, cast5: true,
                    longtext: true, trigger: true
                });

            assertRolesRoleCast(script, '#role2',
                { cast2: true, cast4: true, cast5: true });

            assertRolesRoleCast(script, '#role3',
                {});

            assertRolesRoleCast(script, '#role999',
                {});

            assertRolesRoleCast(script, ['#role1', '#role2', '#role3'],
                {
                    cast1: true, cast2: true, cast4: true, cast5: true,
                    longtext: true, trigger: true
                });

            // include cast
            assertRolesCast(script, ['@cast1', '#role2', '#role3'],
                {
                    cast1: true, cast2: true, cast4: true, cast5: true
                });
        });
    });
});

let EventEmitter = require('events');


describe('Engine', function () {
    describe('Initilization', function () {
        it('Parse cast.sps', function (done) {
            let script = rail.parse(fs.readFileSync('./tests/sample/simple.sps', 'utf8'), {})
            //let v = model(new EventEmitter())
            // Chain the engine on top of the walker
            //script.accept(v);
            let engine = new TestEngine()
            script.run(engine).then(() => {
                done();
            })
            console.log(JSON.stringify(script.executionContext.symbolTable.ids, null, 4))
        });
    });
});

class TestEngine { //implements ExecutionEngine {
    tell(to, from, message) {
        console.log(message);
        return Promise.resolve();
    }
    delay(time) {
        console.log('delay');
        return Promise.resolve();
    }
    set(ref, value) {
        console.log('set');
        return Promise.resolve();
    }
    complete(ref, successOrFail) {
        console.log('complete');
        return Promise.resolve();
    }
    fail(ref) {
        console.log('fail');
        return Promise.resolve();
    }
    ask(ref) {
        console.log('ask');
        return Promise.resolve();
    }
    show(ref, enable) {
        console.log('show');
        return Promise.resolve();
    }
}



class Counter extends EventEmitter {
    constructor() {
        super();

        this.counts = {}


        this.on('sps:script', (script) => {
            this.accept(script.roles);
            this.accept(script.cast);
            this.accept(script.story);
            this.accept(script.scenes);
            this.count(script);
        })

        this.on('sps:startup', (startup) => {
            this.accept(startup.commands)
            this.count(startup);
        });

        this.on('sps:enter', (enter) => {
            this.accept(enter.commands)
            this.count(enter);
        });

        this.on('sps:leave', (leave) => {
            this.accept(leave.commands)
            this.count(leave);
        });

        this.on('sps:tell', (tell) => {
            this.count(tell);
        });

        this.on('sps:delay', (delay) => {
            this.accept(delay.commands);
            this.count(delay);
        });

        this.on('sps:search', (search) => {
            this.count(search);
        });


        this.on('sps:role', (role) => {
            this.count(role);
        })

        this.on('sps:scene', (scene) => {
            this.count(scene);
            this.accept(scene.commands);
        })

        this.on('sps:cast', (cast) => {
            this.count(cast);
        });

        this.on('sps:objective', (obj) => {
            this.count(obj);
            this.accept(obj.conditions);
        })


        this.on('sps:interaction', (obj) => {
            this.count(obj);
            this.accept(obj.form);
            this.accept(obj.conditions);
        })

        this.on('sps:when-if-else', (obj) => {
            this.count(obj);
            this.accept(obj.condition);
            this.accept(obj.commands);
        })

        this.on('sps:near', (near) => {
            this.count(near);
        })

        this.on('sps:has-role', (has) => {
            this.count(has);
        })

        this.on('sps:play-scene', (scene) => {
            this.count(scene);
        })

    }

    count(ele) {
        let type = ele['@type'];
        if (!this.counts[type]) {
            this.counts[type] = 1;
        } else {
            this.counts[type]++;
        }
    }


    accept(a) {
        if (!a) return;
        return a.accept(this);
    }

}

function assertRolesCast(script, roles, expected) {
    let castCheck2 = script.executionContext.symbolTable.resolveRoleCast(roles);
    assert.equal(castCheck2.length, Object.keys(expected).length);
    for (let item of castCheck2) {
        assert(expected[item], `${item} not found when it should have been`);
    }
}

function assertRoles(script, roles, expected) {
    let castCheck2 = script.executionContext.symbolTable.resolveRoles(roles);
    assert.equal(castCheck2.length, Object.keys(expected).length);
    for (let item of castCheck2) {
        assert(expected[item], `${item} not found when it should have been`);
    }
}

// Assert both Roles and RoleCast to cast array
function assertRolesRoleCast(script, roles, expected) {
    assertRoles(script, roles, expected)
    assertRolesCast(script, roles, expected)
}