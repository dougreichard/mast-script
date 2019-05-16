import {Slimdown} from "./slimdown.js"
export class MastDown extends Slimdown {
    constructor(scopes) {
        super();
        this.scopes= scopes
        ///\~\~(.*?)\~\~/g
        this.addRule( /\$\{(.*?)\}/g, value)
    
    function value(text, fqn) {
        fqn = fqn.replace('<>','.meta.')
        fqn = fqn.replace('<','.')
        fqn = fqn.replace('>','')
        let value = scopes.getValue(fqn)
        if ( typeof value === "object") {
            value = JSON.stringify(value)
        }
        return `${value}`;
    }
}

}
