import Scopes from '../src/nut-scopes-local'
import {expect} from 'chai'

describe("Test inmemory data model", () => {
    it("Can get keys", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C"})
        scopes.push({a: "::A", b: "::B", d: "::D"})

        expect(scopes.findKey("a")).to.equal("::A")
        expect(scopes.findKey("c")).to.equal(":C")
        expect(scopes.findKey("d")).to.equal("::D")
    })
    it("Can pop", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C"})
        scopes.push({a: "::A", b: "::B", d: "::D"})

        expect(scopes.findKey("a")).to.equal("::A")
        expect(scopes.findKey("c")).to.equal(":C")
        expect(scopes.findKey("d")).to.equal("::D")

        scopes.pop()
        expect(scopes.findKey("a")).to.equal(":A")
    })
    it("Can get fqn", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C", 
            "@fred": { name: 'fred', value: {a: 2}}
        })
        scopes.push({a: "::A", b: "::B", d: "::D"})
        scopes.push({ obj: {a: "obj::A", b: ":B", c: {d: "obj::D"}}})

        expect(scopes.getValue("a")).to.equal("::A")
        expect(scopes.getValue("obj.a")).to.equal("obj::A")
        expect(scopes.getValue("obj.c.d")).to.equal("obj::D")
        expect(scopes.getValue("@fred.name")).to.equal("fred")
        expect(scopes.getValue("@fred.a")).to.equal(2)
    })
    it("Can set fqn", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C", 
            "@fred": { name: 'fred', value: {a: 2}}
        })
        scopes.push({a: "::A", b: "::B", d: "::D"})
        scopes.push({ obj: {a: "obj::A", b: ":B", c: {d: "obj::D"}}})

        expect(scopes.getValue("a")).to.equal("::A")
        expect(scopes.getValue("obj.a")).to.equal("obj::A")
        expect(scopes.getValue("obj.c.d")).to.equal("obj::D")
        expect(scopes.getValue("@fred.name")).to.equal("fred")
        expect(scopes.getValue("@fred.a")).to.equal(2)

        scopes.setValue("a","::A-set")
        scopes.setValue("obj.a","obj::A-set")
        scopes.setValue("obj.c.d","obj::D-set")
        scopes.setValue("@fred.name","fred-set")
        scopes.setValue("@fred.a",45)


        expect(scopes.getValue("a")).to.equal("::A-set")
        expect(scopes.getValue("obj.a")).to.equal("obj::A-set")
        expect(scopes.getValue("obj.c.d")).to.equal("obj::D-set")
        expect(scopes.getValue("@fred.name")).to.equal("fred-set")
        expect(scopes.getValue("@fred.a")).to.equal(45)
    })
    
})