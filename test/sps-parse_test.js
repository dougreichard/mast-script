"use strict"
const spsLexer = require('../sps-lex')
const expect = require("chai").expect
const spsParse = require("../sps-parse")

function parseFragment(input, fragment) {
    return spsParse.parser.parseFragment(input, fragment)
}

describe("Parse json", () => {
    it("Test Parser", () => {
        let input = `{ "k" : 1,   "k2":"Hello, World" }`
        let out = parseFragment(input, 'objectValue');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
})

describe("Parse roles", () => {
    it("Test Parser", () => {
        let input =
`roles:
    #role1 ('test') 'This is a role'
    #role2 'This is a role'

    #role3 'and another
this is  a lon g line
going further'

    role2 'This is a role'`
        let out = parseFragment(input, 'roles');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
})

describe("Parse cast", () => {
    it("Test Parser", () => {
        let input =
            `cast:
    @cast1 ('test') 'This is a cast'
    @castr1 ('test') #role 'This is a cast'
    @castr2 ('test') [#role #role2] 'This is a cast'
    @castr3 #role1 'This is a cast'
    @cast2 'This is a cast'
    @cast3 'and another
this is  a lon g line
going further'`
        let out = parseFragment(input, 'cast');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
})

describe("Parse role and cast", () => {
    it("Both sections", () => {
        let input = `
roles:
    #role1 ('test') 'This is a role'

cast:
    @cast1 ('test') #role1 "This is a cast"

`
        let out = parseFragment(input, 'script');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
})


describe("Parse media", () => {
    it("Test Parser", () => {
        let input =
            `media:
    !image1 ('test')
    !image2 ('test')
    !image3 ('test')
`
        let out = parseFragment(input, 'media');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
})

describe("Parse states", () => {
    it("Test startup", () => {
        let input =
`
startup:
    tell #role1 "Hello"
    delay 5s
    tell "World"

`
        let out = parseFragment(input, 'startup');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
    it("Test enter", () => {
        let input =
`
enter:
    tell #role1 "Hello"
    delay 5s
    tell "World"
`
        let out = parseFragment(input, 'enter');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
    it("Test leave", () => {
        let input =
`
leave:
    tell #role1 "Hello"
    delay 5s
    tell "world"
`
        let out = parseFragment(input, 'leave');
        expect(out.parseErrors.length).to.be.equal(0, 'Expected no errors')
    })
})
function parseFile (folder, fn) {
    it(`Simple Parse  ${fn}`, ()=> {
        let out = spsParse.parser.parseFile(`./tests/${folder}/${fn}.nut`);
        expect(out.lexErrors.length).to.be.equal(0, 
            'Error '+fn + dumpTokenErrors(out.lexErrors))
        expect(out.parseErrors.length).to.be.equal(0, 
            'Error '+fn + dumpErrors(out.parseErrors))
    })
}
describe("Sample files", () => {
    for(let fn of [
        "groundcontrol"
    ])  {
        parseFile('sample', fn)        
    }
})

describe("Parse files", () => {
    for(let fn of [
        "cast", 
        "comments",
        "delay",
        "interaction",
        "linecontinue",
        "media",
        "objective",
        "roles",
        "scene-play",
        "scenes",
        "scriptid",
        "search",
        "set",
        "startup-enter-leave",
        "tell",
        "story",
        "import",
        "for"
    ])  {
        parseFile('parse', fn)        
    }
 
})


function dumpErrors(errs) {
    let s='\n';
    for (let err of errs) {
        s+= `Line (${err.token.startLine}-${err.token.startColumn}: ${err.message}\n`
    }
    return s;
}

function dumpTokenErrors(errs) {
    let s='\n';
    for (let err of errs) {
        s+= `Line (${err.line}-${err.column}: ${err.message}\n`
    }
    return s;
}