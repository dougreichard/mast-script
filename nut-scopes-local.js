
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
            if (key in value) {
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
    setValue(fqn, value) {
        let {scope, key} = this.getScopeValue(fqn)
        if (key && key in scope) {
            scope[key] = value
        }
    }
}
module.exports = Scopes