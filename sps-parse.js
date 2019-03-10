const spsLexer = require('./sps-lex')
const { Parser } = require("chevrotain")
const toks = spsLexer.tokens
const expressionsRules = require('./rules/expressions');
const mediaRules = require('./rules/media');
const roleRules = require('./rules/role');
const castRules = require('./rules/cast');
const scriptRules = require('./rules/script');
const sceneRules = require('./rules/scene');
const valueRules = require('./rules/value');
const cmdRules = require('./rules/commands');
const conRules = require('./rules/conditions');
const stateRules = require('./rules/states');
const objectiveRules = require('./rules/objectives');
const interactionRules = require('./rules/interactions');
const {SymbolTypes, TellTypes} = require('./sps-type')



class SpsParser extends Parser {
    constructor(input) {
        super(input, Object.values(spsLexer.tokens), { outputCst: false })
        expressionsRules(this);
        mediaRules(this);
        roleRules(this);
        castRules(this);
        cmdRules(this);
        conRules(this);
        stateRules(this);
        objectiveRules(this);
        
        interactionRules(this);
        sceneRules(this);
        // maybe this should be yaml
        valueRules(this);
        scriptRules(this);

        this.symTable = {}

        this.performSelfAnalysis()
    }

    addMedia(media) {
        this.addSymbol(SymbolTypes.Media, media);
    }
    addCast(cast) {
        this.addSymbol(SymbolTypes.Cast, cast);
    }
    addRole(role) {
        this.addSymbol(SymbolTypes.Role, role);
    }
    addObjective(obj) {
        this.addSymbol(SymbolTypes.Objective, obj);
    }
    pushInteraction(interaction) {
        this.addSymbol(SymbolTypes.Interaction, interaction);
    }
    popInteraction(id) {
        
    }
    addScript(script) {
        console.log(script.id)
    }
    pushScript() {
        this.symTable = {}
    }
    popScript() {
        console.log('--end--')
    }
    pushScene(scene) {
        this.addSymbol(SymbolTypes.Scene, scene);
    }
    popScene(id) {
        console.log(`--end ${id}--`)
    }
    addSymbol(type, data) {
        if (this.symTable[data.id] === undefined) {
            data.type = type;
            this.symTable[data.id] = data;
        } else {
            console.log(`warning: duplicate symbol ${data.id}`)
        }
    }
}



// reuse the same parser instance.
const parser = new SpsParser([])

module.exports = {
    parser: parser,
}