const SymbolTypes = {
    Media: 1,
    Cast: 2,
    Role: 3,
    Story: 4,
    Scene: 5,
    Shot: 6,
    Objective: 7,
    Interaction: 8,
    Annotation: 9
};
let cmdId = 1;
const CommandTypes = {
    Tell: cmdId++,
    Show: cmdId++,
    Hide: cmdId++,
    MulAssign: cmdId++,
    PresentAssign: cmdId++,
    Delay: cmdId++,
    Do: cmdId++,
    For: cmdId++,
    Set: cmdId++,
    Scene: cmdId++,
    As: cmdId++,
    Cue: cmdId++
};
const TellTypes = {
    RoleCast: 1,
    Scene: 2,
    Story: 3 // tell everyone
};
const UnwindTypes = {
    Shot: 1,
    Scene: 2,
};
const IteratorTypes = {
    Set: 1,
    Range: 2
};
const SetOperations = {
    Assign: 1,
    AssignAdd: 2,
    AssignSub: 3,
    AssignMul: 4,
    AssignPercentAdd: 5,
    AssignPercentSub: 6
};
let interId = 1;
const InteractionTypes = {
    Choice: interId++,
    Form: interId++,
};
module.exports = {
    SymbolTypes,
    TellTypes,
    CommandTypes,
    IteratorTypes,
    SetOperations,
    InteractionTypes,
    UnwindTypes
};
