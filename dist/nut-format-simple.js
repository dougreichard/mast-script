const SlimDown = require("./slimdown");
class MastDown extends SlimDown {
    constructor(scopes) {
        super();
        this.scopes = scopes;
        ///\~\~(.*?)\~\~/g
        this.addRule(/\$\{(.*?)\}/g, value);
        function value(text, fqn) {
            fqn = fqn.replace('<>', '.meta.');
            fqn = fqn.replace('<', '.');
            fqn = fqn.replace('>', '');
            let value = scopes.getValue(fqn);
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            return `${value}`;
        }
    }
}
////////////
module.exports = MastDown;
