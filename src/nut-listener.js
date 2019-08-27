import {NutParser} from './nut-parser.js'
import {SymbolTypes, TellTypes} from './nut-types.js'
import Scopes from './nut-scopes-local.js'

export  class NutListener {
    constructor() {
       this.reset()
        this.import = new NutParser( this)

    }
    reset() {
        this.scopes = new Scopes()        
        this.symTable = {}
        

        this.firstScene = undefined
        this.story = undefined
        this.previousScene = undefined
        this.previousShot= undefined
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
        this.scopes.push(this.symTable);
     //   console.log('--end--')
    }
    pushStory(story) {
        this.story = story
        this.addSymbol(SymbolTypes.Story, story);
       // this.previousShot = undefined
    }
    popStory(story) {
     
    }
    pushScene(scene) {
        this.previousShot = undefined
        if (!this.firstScene) {
            this.firstScene = scene
            if (this.story) {
                this.story.next = scene.id
            }
        }
        this.addSymbol(SymbolTypes.Scene, scene);
        if (this.previousScene && !scene.sub) {
            this.previousScene.next = scene.id;
        }
        if (!scene.sub) {
            this.previousScene = scene
        }

        
    }
    popScene(id) {
     // console.log(`--end ${id}--`)
    }
    pushShot(shot) {
        // this.addSymbol(SymbolTypes.Shot, scene);
        if (this.previousShot && !shot.sub) {
            this.previousShot.next = shot.id;
        }
        if (!shot.sub)  {
            this.previousShot = shot
        }
        
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


