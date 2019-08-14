import Scopes from '../src/nut-scopes-local'

describe("Test inmemory data model", () => {
    test("Can get keys", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C"})
        scopes.push({a: "::A", b: "::B", d: "::D"})

        expect(scopes.findKey("a")).toBe("::A")
        expect(scopes.findKey("c")).toBe(":C")
        expect(scopes.findKey("d")).toBe("::D")
    })
    test("Can pop", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C"})
        scopes.push({a: "::A", b: "::B", d: "::D"})

        expect(scopes.findKey("a")).toBe("::A")
        expect(scopes.findKey("c")).toBe(":C")
        expect(scopes.findKey("d")).toBe("::D")

        scopes.pop()
        expect(scopes.findKey("a")).toBe(":A")
    })
    test("Can get fqn", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C", 
            "@fred": { name: 'fred', value: {a: 2}}
        })
        scopes.push({a: "::A", b: "::B", d: "::D"})
        scopes.push({ obj: {a: "obj::A", b: ":B", c: {d: "obj::D"}}})

        expect(scopes.getValue("a")).toBe("::A")
        expect(scopes.getValue("obj.a")).toBe("obj::A")
        expect(scopes.getValue("obj.c.d")).toBe("obj::D")
        expect(scopes.getValue("@fred.name")).toBe("fred")
        expect(scopes.getValue("@fred.a")).toBe(2)
    })
    test("Can set fqn", () => {
        let scopes = new Scopes()
        scopes.push({a: ":A", b: ":B", c: ":C", 
            "@fred": { name: 'fred', value: {a: 2}}
        })
        scopes.push({a: "::A", b: "::B", d: "::D"})
        scopes.push({ obj: {a: "obj::A", b: ":B", c: {d: "obj::D"}}})

        expect(scopes.getValue("a")).toBe("::A")
        expect(scopes.getValue("obj.a")).toBe("obj::A")
        expect(scopes.getValue("obj.c.d")).toBe("obj::D")
        expect(scopes.getValue("@fred.name")).toBe("fred")
        expect(scopes.getValue("@fred.a")).toBe(2)

        scopes.setValue("a","::A-set")
        scopes.setValue("obj.a","obj::A-set")
        scopes.setValue("obj.c.d","obj::D-set")
        scopes.setValue("@fred.name","fred-set")
        scopes.setValue("@fred.a",45)


        expect(scopes.getValue("a")).toBe("::A-set")
        expect(scopes.getValue("obj.a")).toBe("obj::A-set")
        expect(scopes.getValue("obj.c.d")).toBe("obj::D-set")
        expect(scopes.getValue("@fred.name")).toBe("fred-set")
        expect(scopes.getValue("@fred.a")).toBe(45)
    })
    
})