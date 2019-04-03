const spsLexer = require('./sps-lex')
const { Parser } = require("chevrotain")
const fs = require('fs')
const path = require('path')
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
const importRules = require('./rules/import');
const {SymbolTypes, TellTypes} = require('./sps-type')



class SpsParser extends Parser {
    constructor(input, listener) {
        super(input, Object.values(spsLexer.tokens), { outputCst: false })
        this.listener = listener
        expressionsRules(this);
        mediaRules(this);
        roleRules(this);
        castRules(this);
        cmdRules(this);
        conRules(this);
        importRules(this);
        stateRules(this);
        objectiveRules(this);
        interactionRules(this);
        sceneRules(this);
        // maybe this should be yaml
        valueRules(this);
        scriptRules(this);

        this._anonymousId = 0;

        this.performSelfAnalysis()
    }

    anonymousID(prefix) {

        return `${prefix}${this._anonymousId++}`
    }

    trimString(str) {
        return str.slice(1,-1)
    }

    parseFile(fileName) {
        let baseDir = SpsParser.defaultPaths[SpsParser.defaultPaths.length-1]
        SpsParser.defaultPaths.push(path.dirname(fileName))
        try {
            fileName = path.resolve(baseDir, fileName)
            let input = fs.readFileSync(fileName, 'utf8');
            let out = this.parseFragment(input, 'script');
            //out.parseErrors.length
            return out;
        }
        catch(e) {
            console.log(e.message)
            throw e
        }
        finally {
            SpsParser.defaultPaths.pop();
        }
        return {
            value:0, // this is a pure grammar, the value will always be <undefined>
            lexErrors: [],
            parseErrors: []
        }
    }
    parseFragment(input, fragment) {
        const lexResult = spsLexer.tokenize(input)
        if (lexResult.errors.length > 0) {
            return {
                value: undefined, // this is a pure grammar, the value will always be <undefined>
                lexErrors: lexResult.errors,
                parseErrors: undefined
            }    
        }
        // setting a new input will RESET the parser instance's state.
        this.input = lexResult.tokens
        // any top level rule may be used as an entry point
        const value = this[fragment]()
        return {
            value: value, // this is a pure grammar, the value will always be <undefined>
            lexErrors: lexResult.errors,
            parseErrors: this.errors
        }
    }
    

    addMedia(media) {if (this.listener) this.listener.addMedia(media);}
    addCast(cast) {if (this.listener) this.listener.addCast(cast);}
    addRole(role) {if (this.listener) this.listener.addRole(role);}
    addObjective(obj) {if (this.listener) this.listener.addObjective(obj);}
    pushInteraction(interaction) {if (this.listener) this.listener.pushInteraction(interaction);}
    popInteraction(id) {if (this.listener) this.listener.popInteraction();}
    addScript(script) {if (this.listener) this.listener.addScript(script);}
    pushScript() {if (this.listener) this.listener.pushScript();}
    popScript() {if (this.listener) this.listener.popScript();}
    pushScene(scene) {if (this.listener) this.listener.pushScene(scene);}
    popScene(id) {if (this.listener) this.listener.popScene(id);}
    pushImport() {if (this.listener) this.listener.pushImport();}
    popImport() {if (this.listener) this.listener.popImport();}
    importScript(id) {if (this.listener) this.listener.importScript(id);}
}
SpsParser.defaultPaths = [__dirname]

class MyListener {
    constructor() {
        this.symTable = {}
        this.import = new SpsParser([], this)
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
    pushImport() {
        // create token array
    }
    importScript(id) {
        // add to token array
        this.import.parseFile(id);
    }
    popImport() {
        // parse token
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
const parser = new SpsParser([], new MyListener())

module.exports = {
    parser: parser,
}