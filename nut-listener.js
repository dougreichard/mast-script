const NutParser = require('./nut-parser')
const {SymbolTypes, TellTypes} = require('./nut-types')

class NutListener {
    constructor() {
        this.symTable = {}
        this.firstScene = undefined
        this.story = undefined
        this.previousScene = undefined
        this.previousShot= undefined
        this.import = new NutParser( this)
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
     //   console.log(script.id)
    }
    
    pushScript() {
        this.symTable = {}
    }
    popScript() {
     //   console.log('--end--')
    }
    pushStory(story) {
        this.story = story
        this.addSymbol(SymbolTypes.Story, story);
    }
    popStory(story) {
     
    }
    pushScene(scene) {
        this.previousShot = undefined
        if (!this.firstScene) {
            this.firstScene = scene
        }
        this.addSymbol(SymbolTypes.Scene, scene);
        if (this.previousScene) {
            this.previousScene.next = scene.id;
        }
        this.previousScene = scene

        
    }
    popScene(id) {
     // console.log(`--end ${id}--`)
    }
    pushShot(shot) {
        this.previousShot = undefined
        // this.addSymbol(SymbolTypes.Shot, scene);
        if (this.previousShot) {
            this.previousShot.next = shot.id;
        }
        this.previousShot = shot
    }
    popShot(id) {
     // console.log(`--end ${id}--`)
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


module.exports = NutListener