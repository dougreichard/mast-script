"use strict"
const {NutLexer} = require('../src/nut-lex')
//const expect = require("chai").expect
const {NutParser} = require("../src/nut-parser")
const {NutListener} = require("../src/nut-listener")
const {NutVisitor} = require("../src/nut-visitor")
// reuse the same parser instance.
const parser = new NutParser(new NutListener())
const visitor = new NutVisitor(new NutListener())
const path = require('path')
import {expect} from 'chai'


function log (...args) {
    console.log(...args)
}

function parseFragment(input, fragment) {
    let out = parser.parseFragment(input, fragment)
    for (let le of out.lexErrors) {
        log(`${le.line}:${le.offset} - ${le.message}`)
    }
    for (let pe of out.parseErrors) {
        log(`${pe.token.startLine}:${pe.token.startOffset} - ${pe.message}`)
    }
    return out;
}

describe("Parse json", () => {
    it("Test Parse JSON", () => {
        let input = `{ "k" : 1,   "k2":"Hello, World" }`
        let out = parseFragment(input, 'objectValue');
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
    })
    it("Test JSON values", ()=> {
        let v = {
            i: 3, 
            d: 1.2,
            b: true,
            bf: false,
            a: [2,4,5],
            s: "Hello, World",
            n: null,
            o: {a: 45, b: false, s:"Yo"}
        }
        let input = JSON.stringify(v);
        let out = parseFragment(input, 'objectValue');
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
      //  expect(out.value).to.not.be.undefined("Test")
        let obj = visitor.objectValue(out.value);
        expect(obj).to.deep.equal(v, "Value does not equal")
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

    role2 'This is a role'
    
    <value {a: 1,b: 2 }>  
    #roleV1 ('this') ' Desc'

    <value {
        a: 1,
        b: 2
    }>
    #roleV 
    <value  {a: 1,b: 2}>
    #roleV2
    `

    
        let out = parseFragment(input, 'roles');
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
    })
})

describe("Parse cast", () => {
    it("Test Parser", () => {
        let input =
            `cast:
    <value {
        d: 1, 
        s: "hello", 
        o: { 
            a: 1,
            b: 3
        },
        i: 3
    }>
    @cast1 ('test') 'This is a cast'
    @castr1 ('test') #role 'This is a cast'
    @castr2 ('test') [#role #role2] 'This is a cast'
    @castr3 #role1 'This is a cast'
    @cast2 'This is a cast'
    @cast3 'and another
this is  a lon g line
going further'`
        let out = parseFragment(input, 'cast');
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
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
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
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
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
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
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
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
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
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
        expect(out.parseErrors.length).to.equal(0, 'Expected no errors')
    })
})
function parseFile (folder, fn) {
    it(`Simple Parse  ${fn}`, ()=> {
        let out = parser.parseFile(path.resolve(`./tests/${folder}/${fn}.nut`));
        for (let le of out.lexErrors) {
            log(`${fn} TOKEN ERROR ${le.line}:${le.offset} - ${le.message}`)
        }
        for (let pe of out.parseErrors) {
            log(`${fn} PARSE ERROR ${pe.token.startLine}:${pe.token.startOffset} - ${pe.message}`)
        }
        expect(out.lexErrors.length).to.equal(0, 
            'Error '+fn + dumpTokenErrors(out.lexErrors))
        expect(out.parseErrors.length).to.equal(0, 
            'Error '+fn + dumpErrors(out.parseErrors))
    })
}
describe("Sample files", () => {
    for(let fn of [
        "hello",
        "flow",
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