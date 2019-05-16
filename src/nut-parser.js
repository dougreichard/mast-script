import NutLexer from './nut-lex.js'
import  ch from "chevrotain"
import fs from 'fs'
import path from 'path'
import expressionsRules from './rules/expressions.js'
import mediaRules from './rules/media.js'
import roleRules from './rules/role.js'
import castRules from './rules/cast.js'
import scriptRules from './rules/script.js'
import sceneRules from './rules/scene.js'
import valueRules from './rules/value.js'
import cmdRules from './rules/commands.js'
import conRules from './rules/conditions.js'
import stateRules from './rules/states.js'
import objectiveRules from './rules/objectives.js'
import interactionRules from './rules/interactions.js'
import importRules from './rules/import.js'
import module from 'module'


export default class NutParser extends ch.Parser {
    constructor(listener) {
        super(Object.values(NutLexer.tokens), 
            { outputCst: true, recoveryEnabled : true }
        )
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
        let baseDir = NutParser.defaultPaths[NutParser.defaultPaths.length-1]
        NutParser.defaultPaths.push(path.dirname(fileName))
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
            NutParser.defaultPaths.pop();
        }
        return {
            value:0, // this is a pure grammar, the value will always be <undefined>
            lexErrors: [],
            parseErrors: []
        }
    }
    parseFragment(input, fragment) {
        const lexResult = NutLexer.tokenize(input)
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
    pushStory(story) {if (this.listener) this.listener.pushStory(story);}
    popStory(story) {if (this.listener) this.listener.popStory(story);}
    pushScene(scene) {if (this.listener) this.listener.pushScene(scene);}
    popScene(scene) {if (this.listener) this.listener.popScene(scene);}
    pushShot(shot) {if (this.listener) this.listener.pushShot(shot);}
    popShot(shot) {if (this.listener) this.listener.popScene(shot);}
    pushImport() {if (this.listener) this.listener.pushImport();}
    popImport() {if (this.listener) this.listener.popImport();}
    importScript(id) {if (this.listener) this.listener.importScript(id);}
}
NutParser.defaultPaths = [module.__dirname]
//module.exports = NutParser
