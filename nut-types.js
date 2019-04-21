const SymbolTypes = {
    Media: 1,
    Cast: 2,
    Role: 3,
    Story: 4,
    Scene: 5,
    Shot: 6,
    Objective: 7,
    Interaction: 8,

}

let cmdId = 1
const CommandTypes = {
    Tell: cmdId++,  
    Show: cmdId++,
    Hide: cmdId++,
    MulAssign: cmdId++,
    PresentAssign: cmdId++,
    Delay: cmdId++,
    Do: cmdId++,
    For: cmdId++,
    Set: cmdId++
}

const TellTypes = {
    RoleCast: 1,  // Tell specific cast or role
    Scene: 2,   // tell everyone currently in a scene
    Story: 3  // tell everyone
}

const IteratorTypes = {
    Set: 1,
    Range: 2
}


const SetOperations = {
    Assign: 1,  
    AssignAdd: 2,
    AssignSub: 3,
    AssignMul: 4,
    AssignPercentAdd: 5,
    AssignPercentSub: 6

}

module.exports = {
    SymbolTypes,
    TellTypes,
    CommandTypes,
    IteratorTypes,
    SetOperations
}