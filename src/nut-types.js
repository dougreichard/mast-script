export const SymbolTypes = {
    Media: 1,
    Cast: 2,
    Role: 3,
    Story: 4,
    Scene: 5,
    Shot: 6,
    Objective: 7,
    Interaction: 8,
    Annotation: 9

}

let cmdId = 1
export const CommandTypes = {
    Tell: cmdId++,  
    Show: cmdId++,
    Hide: cmdId++,
    Delay: cmdId++,
    Do: cmdId++,
    For: cmdId++,
    Set: cmdId++,
    Scene: cmdId++,
    As: cmdId++,
    Cue: cmdId++,
    Complete: cmdId++,
    Fail: cmdId++
}

export const TellTypes = {
    RoleCast: 1,  // Tell specific cast or role
    Scene: 2,   // tell everyone currently in a scene
    Story: 3  // tell everyone
}


export const UnwindTypes = {
    Shot: 1,  // Tell specific cast or role
    Scene: 2,   // tell everyone currently in a scene
}

export const IteratorTypes = {
    Set: 1,
    Range: 2,
    Scene: 3,
    Array: 4,
    Cast: 5,
    Role: 6,
    CastInRole: 7,
    Shots: 8
}


export const SetOperations = {
    Assign: 1,  
    AssignAdd: 2,
    AssignSub: 3,
    AssignMul: 4,
    AssignPercentAdd: 5,
    AssignPercentSub: 6

}

let interId = 1
export const InteractionTypes = {
    Choice: interId++,  
    Form: interId++,
}

// module.exports = {
//     SymbolTypes,
//     TellTypes,
//     CommandTypes,
//     IteratorTypes,
//     SetOperations,
//     InteractionTypes,
//     UnwindTypes
// }