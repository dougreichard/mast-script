const SlimDown = require("./slimdown")
class MastDown extends SlimDown {
    constructor(scopes) {
        super();
        this.scopes= scopes
        this.addRule( /(\$\{)(.*)(\})/g, value)
    
    function value(text, _, fqn) {
        let value = scopes.getValue(fqn)
        return `${value}`;
    }
}

}

////////////
module.exports = MastDown;
