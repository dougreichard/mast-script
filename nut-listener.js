const NutParser = require('./nut-parser')
const {SymbolTypes, TellTypes} = require('./sps-type')

class NutListener {
    constructor() {
        this.symTable = {}
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
    pushScene(scene) {
        this.addSymbol(SymbolTypes.Scene, scene);
    }
    popScene(id) {
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