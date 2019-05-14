const {SetOperations} = require('./nut-types')

class Scopes {
    constructor() {
        this.scopes = []
    }
    push(kvs) {
        this.scopes.push(kvs)
    }
    pop() {
        this.scopes.pop()
    }
    findKey(key) {
        var i = this.scopes.length;
        while(i--)
        {
            if (key in this.scopes[i]) {
                return (this.scopes[i][key])
            }
        }
        return undefined;
    }
    findScope(key) {
        var i = this.scopes.length;
        while(i--)
        {
            if (key in this.scopes[i]) {
                return (this.scopes[i])
            }
        }
        return undefined;
    }
    findStoryKey(key) {
        if (!this.scopes.length) {
            return undefined;
        }
        if (key in this.scopes[0]) {
            return (this.scopes[0][key])
        }
        return undefined;
    }
    getScopeValue(fqn) {
        let keys = fqn.split(".")
        let value = this.findScope(keys[0])
        let scope = value
        let key = keys[0]

        let pattern = /^[\$@!#\*]/
        let scriptObject = (pattern.test(keys[0])) 
        for(let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            key = keys[keyIndex]
            if (key && key in value) {
                scope = value
                value = value[key]
            } else if (keyIndex == 1 && scriptObject 
                && value.value && key in value.value) {
                    scope = value.value
                    value = value.value[key]
            }
            else {
                value = undefined
                break
            }
        }
        return {value, scope, key}
    }
    getValue(fqn) {
        let {value} = this.getScopeValue(fqn)
        return value
    }
    setValue(fqn, toValue, op) {
        let {scope, key, value} = this.getScopeValue(fqn)
        if (!op) {
            op = SetOperations.Assign
        }
        if (key && key in scope) {
            switch(op) {
                case SetOperations.AssignAdd:
                    scope[key] += toValue
                    break;

                case SetOperations.AssignSub:
                    scope[key] -= toValue
                    break;

                case SetOperations.AssignMul:
                    scope[key] *= toValue
                    break;

                case SetOperations.AssignPercentAdd:
                    scope[key] +=  value * (toValue/100)
                    break;
                
                case SetOperations.AssignPercentSub:
                    scope[key] -=  value * (toValue/100)
                    break;

                default:
                    scope[key] = toValue
                    break;
                
            }
            
        }
    }
}
module.exports = Scopes