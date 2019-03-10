const SymbolTypes = {
    Media: 1,
    Cast: 2,
    Role: 3,
    Scene: 4,
    Objective: 5,
    Interaction: 6
}

const Commands = {
    Tell: 1,  
    Show: 2,
    Hide: 3,
    MulAssign: 4,
    PresentAssign: 4,

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
    TellTypes
}