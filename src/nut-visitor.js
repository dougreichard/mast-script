import  NutParser from "./nut-parser.js"
const parser = new NutParser()
//const castVisits  = require('./rules/cast').visits

//#region State Commands [ commands ]
import { InteractionTypes, IteratorTypes, SetOperations, TellTypes, SymbolTypes, CommandTypes } from './nut-types.js'
//const BaseNutVisitor = parser.getBaseCstVisitorConstructor()
const BaseNutVisitorWithDefaults = parser.getBaseCstVisitorConstructorWithDefaults()
//#endregion 
// class myCustomVisitor extends BaseNutVisitor {
//     constructor() {
//         super()
//         // The "validateVisitor" method is a helper utility which performs static analysis
//         // to detect missing or redundant visitor methods
//         this.validateVisitor()
//     }

//     /* Visit methods go here */
// }


export class NutVisitor extends BaseNutVisitorWithDefaults {
    constructor(listener) {
        super()
        this.listener =  listener
        this._anonymousId = 0
        this.validateVisitor()
    }

    VISIT(name, func) {
        this[name] = func
    }

    anonymousID(prefix) {
        return `${prefix}${this._anonymousId++}`
    }
    trimString(str) {
        return str.slice(1, -1)
    }
    fetchString(ctx) {
        return ctx.StringLiteral?this.trimString(ctx.StringLiteral[0].image):undefined
    }
    aliasString(ctx) {
        return ctx.aliasString ? this.fetchString(ctx.aliasString[0].children) : '';

    }
    $v(ctx, key) {
        return ctx[key][0].children
    }
    $i(ctx, key) {
        return ctx[key][0].image
    }
    // gets the children of the only child of a rule
    $grand(ctx, key) {
        return Object.values(ctx[key][0].children)[0][0].children;
    }
    // gets the children of the only child of a rule
    $grandName(ctx, key, k2) {
        return ctx[key][0].children[k2][0].children;
    }
    //----------------------------
    // RULES
    //----------------------------
    script(ctx) {
        console.log('script');
        this.visitKeys(ctx);
    }

    onlyChild(ctx) {
        return Object.values(ctx)[0][0];
    }

    visitKeys(ctx) {
        if (ctx) {
            ctx = Object.values(ctx)
            for (let i = 0, l = ctx.length; i < l; i++) {
                this.visitChildren(ctx[i])
            }
        }
    }

    visitChildren(ctx) {
        if (ctx) {
            for (let i = 0, l = ctx.length; i < l; i++) {
                this[ctx[i].name](ctx[i].children);
            }
        }
    }
    visitChildrenObject(ctx) {
        let ret = {}
        if (ctx) {
            for (let i = 0, l = ctx.length; i < l; i++) {
                let { key, value } = this[ctx[i].name](ctx[i].children);
                ret[key] = value;
            }
        }
        return ret;
    }

    visitChildrenArray(ctx) {
        let arr = []
        if (ctx) {
            for (let i = 0, l = ctx.length; i < l; i++) {
                let value = this[ctx[i].name](ctx[i].children);
                arr.push(value);
            }
        }
        return arr
    }
    visitChildrenArrayTokens(ctx) {
        let arr = []
        if (ctx) {
            for (let i = 0, l = ctx.length; i < l; i++) {
                let value = ctx[i].image
                arr.push(value);
            }
        }
        return arr
    }


    annotationList(ctx) {
        if (ctx.annotationList && ctx.annotationList.length) {
            return this.visitChildrenObject(ctx.annotationList[0].children.annotation);
        }
        return {}
    }

    annotationId(ctx) {
        return ctx.Identifier[0].image
    }

    annotation(ctx) {
        let key = ctx.Identifier[0].image
        // An annotation with no value is true
        let value = true;
        if (ctx.value) {
            value = this.value(ctx.value[0].children);
        }
        return { key, value }
    }
    // #region Cast
    cast(ctx) {
        console.log('cast');
        this.visitChildren(ctx.castDef)
    }
    castDef(ctx) {
        let annotations = this.annotationList(ctx);
        let alias = this.aliasString(ctx);
        let desc = ctx.StringLiteral ? this.trimString(ctx.StringLiteral[0].image) : '';
        let id = ctx.CastId[0].image
        annotations.meta = { id, alias, desc }
        annotations.id = id
        this.addCast(annotations)
    }
    // #endregion
    // #region Roles
    roles(ctx) {
        console.log('roles');
        this.visitChildren(ctx.roleDef)
    }
    roleDef(ctx) {
        let annotations = this.annotationList(ctx);
        let alias = this.aliasString(ctx);
        let desc = ctx.StringLiteral ? this.trimString(ctx.StringLiteral[0].image) : '';
        let id = ctx.RoleId[0].image

        annotations.meta = { id, alias, desc }
        annotations.id = id
        this.addRole( annotations)

        console.log(`roleDef: ${id} ${alias} ${desc}`);
    }
    // #endregion

    // #region JSON
    objectValue(ctx) {
        let x = 1
        x++
        // let value
        // value = $.OR([
        //     // using ES6 Arrow functions to reduce verbosity.
        //     { ALT: () => $.SUBRULE($.object) },
        //     { ALT: () => $.SUBRULE($.array) }
        // ])
        // return value
    }

    // the parsing methods
    object(ctx) {
        //super.object(ctx);
        let a = ctx.objectItem
        let obj = {}
        for (let i = 0, l = a.length; i < l; i++) {
            let { key, value } = this[a[i].name](a[i].children);
            obj[key] = value;
        }
        return obj
    }

    objectItem(ctx) {
        let key = ctx.Identifier[0].image
        let value = this.value(ctx.value[0].children);
        return { key, value }
    }

    array(ctx) {
        let a = ctx.value
        let arr = []
        for (let i = 0, l = a.length; i < l; i++) {
            let value = this[a[i].name](a[i].children);
            arr.push(value);
        }
        return arr
    }

    value(ctx) {
        if (ctx.IntegerLiteral) {
            return parseInt(ctx.IntegerLiteral[0].image)
        } else if (ctx.NumberLiteral) {
            return parseFloat(ctx.NumberLiteral[0].image)
        } else if (ctx.booleanValue) {
            return this.booleanValue(ctx.booleanValue[0].children)
        } else if (ctx.StringLiteral) {
            return this.trimString(ctx.StringLiteral[0].image)
        } else if (ctx.Null) {
            return null
        } else if (ctx.array) {
            return this.array(ctx.array[0].children)
        } else if (ctx.object) {
            return this.object(ctx.object[0].children)
        }
    }

    booleanValue(ctx) {
        if (ctx.True) {
            return true;
        }
        return false;
    }
    // #endregion

    roleCastId(ctx) {
        //this.visitChildren(ctx)
        if (ctx.CastId) {
            return ctx.CastId[0].image
        } else if (ctx.RoleId) {
            return ctx.RoleId[0].image
        }
    }
    // #region Commands
    identifierTellList(ctx) {
        if (ctx.identifierTellList) {
            return this.visitChildrenArray(ctx.identifierTellList[0].children.identifierTell)
        }
        return
    }
    identifierTell(ctx) {
        if (ctx.roleCastId) {
            return this.roleCastId(ctx.roleCastId[0].children)
        }
        return
    }
    aliasCmdList(ctx) {
        if (ctx.aliasCmdList) {
            return this.visitChildrenArray(ctx.aliasCmdList[0].children.aliasCmd)
        }
        return
    }
    aliasCmd(ctx) {
        let cmds = ['tellCmd', 'cueCmd', 'doCmd', "forCmd",
            'sceneCmd', 'setCmd', 'delayCmd', 'completeCmd', 'showCmd',
            'hideCmd', 'failCmd']
        for (let c=0, l = cmds.length;c<l;c++) {
            let item = ctx[cmds[c]]
            if (item) {
                return this[item[0].name](item[0].children)
            }    
        }
    }

    story(ctx) {
        this.storyScene(ctx, true)
    }
    scene(ctx) {
        //$.pushScene(scene)
        this.storyScene(ctx)
    }
    scenes(ctx) {
        return this.visitChildrenArray(ctx.scene)
    }

    shotOrInt(ctx) {
        return this.visit(this.onlyChild(ctx))
    }

    sceneContent(ctx) {
        let leave = this.visit(ctx.leave)
        let enter = this.visit(ctx.enter)
        let startup = this.visit(ctx.startup)
        let shots = this.visitChildrenArray(ctx.shotOrInt)
        let objectives = this.visit(ctx.objectives)
        let interactions = this.visit(ctx.interactions)
        return {startup, enter, leave, shots, objectives, interactions}
    }
        
    storyScene(ctx, isStory) {
        //$.OPTION(()=> $.SUBRULE($.annotationList))
        let alias = this.aliasString(ctx)
        let desc = this.fetchString(ctx)
        let id = 'story'
        id = ctx.SceneId ? ctx.SceneId[0].image: id
        let sub = ctx.subOperator?true:false 
        let scene = { id, alias, desc, sub}
        if (isStory) this.pushStory(scene)
        else this.pushScene(scene)
        scene.content = this.visit(ctx.sceneContent);
        if (isStory) this.popStory(scene)
        else this.popScene(scene)
        
    }

    startup(ctx) {
        return this.visit(ctx.stateCmdBlock)
    }
    enter(ctx) {
        return this.visit(ctx.stateCmdBlock)
    }
    leave(ctx) {
        return this.visit(ctx.stateCmdBlock)
    }
    shot(ctx) {
        let id = ctx.Identifier? ctx.Identifier[0].image:undefined;
        let sub = ctx.subOperator ? true:false;
        let alias = this.aliasString(ctx)
        let content = this.visit(ctx.stateCmdBlock)
        id = id ? id: this.anonymousID('shot') 
        // $.pushShot(shot)
        
        
        // $.popShot(shot)
        let shot = { type: SymbolTypes.Shot, id, alias, sub, content}
        this.pushShot(shot)
        return shot
    }

    //#region State Commands [ commands ]
    stateCmdBlock(ctx) {
        if (ctx.stateCommand) {
            return this.visitChildrenArray(ctx.stateCommand)
        }
        return
    }
    stateCommand(ctx) {
        let cmds = ['asCmd', 'tellCmd', 'cueCmd', 'doCmd', "forCmd",
            'sceneCmd', 'setCmd', 'delayCmd']
            // , 'completeCmd', 'showCmd','hideCmd', 'failCmd']
        for (let c=0, l = cmds.length;c<l;c++) {
            let item = ctx[cmds[c]]
            if (item) {
                return this[item[0].name](item[0].children)
            }    
        }
    }
    //#endregion


    IfElseCmdBlock(ctx) {
        // { ALT: () => $.CONSUME(toks.PassCmd) },
        if (ctx.ifElseValidCmd) {
            return this.visitChildrenArray(ctx.ifElseValidCmd)
        } else if (ctx.passCmd) {
            return []
        }
        return []
    }
    ifElseValidCmd(ctx) {
        let cmds = ['asCmd', 'tellCmd', 'cueCmd', 'doCmd', "forCmd",
            'sceneCmd', 'setCmd', 'delayCmd', 'completeCmd', 'showCmd',
            'hideCmd', 'failCmd']
        for (let c=0, l = cmds.length;c<l;c++) {
            let item = ctx[cmds[c]]
            if (item) {
                return this[item[0].name](item[0].children)
            }    
        }
    }


    tellCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let desc = this.fetchString(ctx)
        let to = this.identifierTellList(ctx)
        return { type: CommandTypes.Tell, options: { to, desc } }
    }

    cueCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let cue = this.aliasString(ctx)
        return { type: CommandTypes.Cue, options: { cue } }
    }

    asCmd(ctx) {
        // let annotations  = this.annotationList(ctx);
        let who = ctx.CastId.image
        let content = this.aliasCmdList(ctx);
        return { type: CommandTypes.As, options: { who, content } }
    }

    doCmd(ctx) {
        // let annotations  = this.annotationList(ctx);
        //let who  = ctx.CastId.image
        //let cmds = this.aliasCmdList(ctx);
        let shots = []
        let together = !!ctx.TogetherOp;
        let walk = ctx.shotList[0].children.Identifier
        for (let i = 0, l = walk.length; i < l; i++) {
            shots.push(walk[i].image)
        }

        return { type: CommandTypes.Do, options: { together, shots } }
    }
    sceneCmd(ctx) {
        // let annotations  = this.annotationList(ctx);
        let id
        if (ctx.StorySec) {
            id = ctx.StorySec[0].image
        } else if (ctx.SceneId) {
            id = ctx.SceneId[0].image
        }
        return { type: CommandTypes.Scene, options: { id } }
    }


    setOperator(ctx) {
        if (ctx.Colon || ctx.Assign) {
            return SetOperations.Assign
        } else if (ctx.AssignAdd) {
            return SetOperations.AssignAdd
        } else if (ctx.AssignSub) {
            return SetOperations.AssignSub
        } else if (ctx.AssignPercentAdd) {
            return SetOperations.AssignPercentAdd
        } else if (ctx.AssignPercentSub) {
            return SetOperations.AssignPercentSub
        } else if (ctx.AssignMul) {
            return SetOperations.AssignMul
        }
    }

    identifierExpression(ctx) {
        let exp = this.visit(ctx.identifierLHS)
        let annotation = this.visit(ctx.annotationId) 
        let elements  = ''
        let da = ctx.DataId
        if (da){
            for(let i =0, l=da.length;i<l;i++) {
                elements += da[i].image
            }
        }
       
        let ret = exp+(annotation?`.${annotation}`:'')+ elements
        return ret
    }

    identifierLHSList(ctx) {
        return this.visitChildrenArray(ctx.identifierLHS)
    }
    
    identifierLHS(ctx)  {
        let id;
        id = this.onlyChild(ctx).image
        return id;
    }

    setLHS(ctx) {
        let elements
        let da = ctx.DataId
        if (da){
            elements=''
            for(let i =0, l=da.length;i<l;i++) {
                elements += da[i].image
            }
        }
        

        let ids = this.visit(ctx.identifierLHSList);
        return {ids, elements}
    }



    setCmd(ctx) {
        // let annotations  = this.annotationList(ctx);
        //let who  = ctx.CastId.image
        //let cmds = this.aliasCmdList(ctx);
        let lhs = this.visit(ctx.setLHS)
        let op = this.setOperator(ctx.setOperator[0].children)
        let exp 
        if (ctx.identifierExpression) {
            exp = this.visit(ctx.identifierExpression)
        }
        let value
        if (ctx.value) {
            value = this.value(ctx.value[0].children)
        }
        return { type: CommandTypes.Set, options: { lhs, op, exp, value } }
    }

    scriptData(ctx) {
        let alias = this.aliasString(ctx)
        let desc = this.fetchString(ctx)
        let main = ctx.SceneId?ctx.SceneId[0].image:undefined;
        //$.addScript({alias, desc, main})
    }


    delayCmd(ctx) {
        let units = this.$grand(ctx, 'timeUnits');
        let ms = 0
        if (units.SecondLiteral) {
            ms += 1000 * parseInt(this.$i(units, 'SecondLiteral'))
        }
        if (units.MinuteLiteral) {
            ms += 60 * 1000 * parseInt(this.$i(units, 'MinuteLiteral'))
        }
        if (units.MillisecondLiteral) {
            ms += parseInt(this.$i(units, 'MillisecondLiteral'))
        }

        return { type: CommandTypes.Delay, options: { ms } }
    }
    showCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let id
        if (ctx.ObjectiveId) {
            id = ctx.ObjectiveId[0].image
            type = SymbolTypes.Objective
        } else if (ctx.InteractionId) {
            id = ctx.InteractionId[0].image
            type = SymbolTypes.Interaction
        }
        return { type: CommandTypes.Show, options: { annotation, type, id } }
    }
    hideCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let id
        if (ctx.ObjectiveId) {
            id = ctx.ObjectiveId[0].image
            type = SymbolTypes.Objective
        } else if (ctx.InteractionId) {
            id = ctx.InteractionId[0].image
            type = SymbolTypes.Interaction
        }
        return { type: CommandTypes.Hide, options: { annotation, type, id } }
    }
    completeCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let id
        if (ctx.ObjectiveId) {
            id = ctx.ObjectiveId[0].image
            type = SymbolTypes.Objective
        }
        return { type: CommandTypes.Complete, options: { annotation, type, id } }
    }
    failCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let id
        if (ctx.ObjectiveId) {
            id = ctx.ObjectiveId[0].image
            type = SymbolTypes.Objective
        }
        return { type: CommandTypes.Fail, options: { annotation, type, id } }
    }

    forCmd(ctx) {
        let annotations = this.annotationList(ctx);
        let options
        if (ctx.forRange) {
            options = this.visit(ctx.forRange)
        } else if (ctx.forArray) {
            options = this.visit(ctx.forArray)
        } else if (ctx.forCast) {
            options = this.visit(ctx.forCast)
        } else if (ctx.forRoles) {
            options = this.visit(ctx.forRoles)
        } else if (ctx.forCastFromRoles) {
            options = this.visit(ctx.forCastFromRoles)
        } else if (ctx.forScenes) {
            options = this.visit(ctx.forScenes)
        } else if (ctx.forShots) {
            options = this.visit(ctx.forShots)
        }
        // ])
        options.content = this.visit(ctx.IfElseCmdBlock)

        return { type: CommandTypes.For, options }      
    }

    forRange(ctx)  {
        let id = ctx.Identifier[0].image
        let start = ctx.IntegerLiteral[0].image
        let end = ctx.IntegerLiteral[1]? ctx.IntegerLiteral[1].image: undefined;
        let step = ctx.IntegerLiteral[2]? ctx.IntegerLiteral[2].image: 1;
        if (!end) { end = parseInt(start); start = 0 }
        else { start = parseInt(start); end = parseInt(end); step = parseInt(step) }
        return { type: IteratorTypes.Range, id, start, end, step }
    }
    forArray(ctx)  {
        let id = ctx.Identifier[0].image
        let elements = this.visitChildrenArray(ctx.value)
        return { type: IteratorTypes.Array, id, elements }
    }
    forScenes(ctx)  {
        let elements = this.visitChildrenArrayTokens(ctx.SceneId)
        let id = elements.shift()
        return { type: IteratorTypes.Scene, id, elements }
    }
    forCast(ctx)  {
        let elements = this.visitChildrenArrayTokens(ctx.CastId)
        let id = elements.shift()
        return { type: IteratorTypes.Array, id, elements }
    }
    forCastFromRoles(ctx)  {
        let elements = this.visitChildrenArrayTokens(ctx.RoleId)
        let id = ctx.CastId[0].image
        return { type: IteratorTypes.Array, id, elements }
    }
    forRoles(ctx)  {
        let elements = this.visitChildrenArrayTokens(ctx.RoleId)
        let id = elements.shift()
        return { type: IteratorTypes.Role, id, elements }
    }
    forShots(ctx)  {
        let elements = this.visitChildrenArrayTokens(ctx.Identifier)
        let id = elements.shift()
        return { type: IteratorTypes.Shot, id, elements }
    }

    // #endregion



    mediaDef(ctx) {
        let id = ctx.MediaId[0].image;
        let uri = this.aliasString(ctx);
        return { id, uri }
        //$.addMedia({id, uri})
    }
    media(ctx) {
        this.visitChildren(ctx.mediaDef)
    }

    imports(ctx) {
        //$.pushImport()
        for (let i = 0, l = ctx.StringLiteral.length; i < l; i++) {
            let s = this.trimString(ctx.StringLiteral[i].image)
            //  $.importScript(script)
        }
        //$.popImport()
    }

    choiceInteraction(ctx) {
            let content = {type: InteractionTypes.Choice , choices: []}
            
            for(let i=0, l=ctx.StringLiteral.length;i<l;i++){
                let choice = {}
                // choice.target = $.OPTION(()=> $.SUBRULE($.roleCastIdList))
                choice.prompt = this.trimString(ctx.StringLiteral[i].image)
                choice.content = this.visit(ctx.IfElseCmdBlock[i])
                content.choices.push(choice);
        }
        return content
    }

    interactionBlockItem(ctx)  {
       // let cmds = ['form', 'choiceInteraction', 'searchCmd', 'completeObjCmd', 
       // "KeysInteraction",'MediaInteraction']
       return this.visit(this.onlyChild(ctx))
    }

    interaction(ctx) {
        let id = ctx.InteractionId[0].image;
        let audience  = this.visit(ctx.roleCastIdList)
        let desc = this.fetchString(ctx)
        // //$.pushInteraction({id, audience, desc})
        
        let shot = { type: SymbolTypes.Interaction, id, audience, desc}
        this.pushShot(shot)
        shot.content = this.visit(ctx.interactionBlockItem)
        //this.popShot(id)
        // // $.popInteraction(id)
        // // probably need a sub
        return shot
        
    }

    // #region Default listener
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
    // #endregion
}

//const myVisitorInstance = new myCustomVisitor()
// module.exports = {
//     NutVisitor: NutVisitor
// } 
