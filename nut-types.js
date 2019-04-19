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
    Do: cmdId++
}

const TellTypes = {
    RoleCast: 1,  // Tell specific cast or role
    Scene: 2,   // tell everyone currently in a scene
    Story: 3  // tell everyone
}

const SetOperations = {
    Assign: 1,  
    AddAssign: 2,
    SubAssign: 3,
    MulAssign: 4,
    PresentAssign: 4,

}

module.exports = {
    SymbolTypes,
    TellTypes,
    CommandTypes
}