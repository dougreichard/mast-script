const spsLexer = require('./sps-lex')
const { Parser } = require("chevrotain")
const toks = spsLexer.tokens
const expressionsRules = require('./rules/expressions');
const mediaRules = require('./rules/media');
const roleRules = require('./rules/role');
const castRules = require('./rules/cast');
const scriptRules = require('./rules/script');
const sceneRules = require('./rules/scene');
const valueRules = require('./rules/value');
const cmdRules = require('./rules/commands');
const stateRules = require('./rules/states');
const objectiveRules = require('./rules/objectives');
const interactionRules = require('./rules/interactions');

class SpsParser extends Parser {
    constructor(input) {
        super(input, Object.values(spsLexer.tokens))
        expressionsRules(this);
        mediaRules(this);
        roleRules(this);
        castRules(this);
        cmdRules(this);
        stateRules(this);
        objectiveRules(this);
        interactionRules(this);
        sceneRules(this);
        // maybe this should be yaml
        valueRules(this);
        scriptRules(this);

        this.performSelfAnalysis()
    }
     
}

// reuse the same parser instance.
const parser = new SpsParser([])

module.exports = {
    parser: parser,
}