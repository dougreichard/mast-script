"use strict"
const indentationExample = require("../src/nut-lex")
const { tokenMatcher } = require("chevrotain")
const tokenize = indentationExample.tokenize

describe("The Chevrotain Lexer ability to lex python like indentation.", () => {
    test("Can Lex a simple python style if-else ", () => {
        let input =
            "if (1)\n" +
            "  if (2)\n" +
            "    if(3)\n" +
            "      tell 666\n" +
            "  else\n" +
            "    tell `9\n99`\n"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.If)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.LParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[2], indentationExample.tokens.IntegerLiteral))
            .toBeTruthy()
        expect(tokenMatcher(actualTokens[3], indentationExample.tokens.RParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[4], indentationExample.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[5], indentationExample.tokens.If)).toBeTruthy()
        expect(tokenMatcher(actualTokens[6], indentationExample.tokens.LParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[7], indentationExample.tokens.IntegerLiteral))
            .toBeTruthy()
        expect(tokenMatcher(actualTokens[8], indentationExample.tokens.RParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[9], indentationExample.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[10], indentationExample.tokens.If)).toBeTruthy()
        expect(tokenMatcher(actualTokens[11], indentationExample.tokens.LParen)).toBeTruthy()
        expect(
            tokenMatcher(actualTokens[12], indentationExample.tokens.IntegerLiteral)
        ).toBeTruthy()
        expect(tokenMatcher(actualTokens[13], indentationExample.tokens.RParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[14], indentationExample.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[15], indentationExample.tokens.TellCmd)).toBeTruthy()
        expect(
            tokenMatcher(actualTokens[16], indentationExample.tokens.IntegerLiteral)
        ).toBeTruthy()
        expect(tokenMatcher(actualTokens[17], indentationExample.tokens.Outdent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[18], indentationExample.tokens.Outdent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[19], indentationExample.tokens.Else)).toBeTruthy()
        expect(tokenMatcher(actualTokens[20], indentationExample.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[21], indentationExample.tokens.TellCmd)).toBeTruthy()
        expect(
            tokenMatcher(actualTokens[22], indentationExample.tokens.StringLiteral)
        ).toBeTruthy()
        expect(tokenMatcher(actualTokens[23], indentationExample.tokens.Outdent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[24], indentationExample.tokens.Outdent)).toBeTruthy()
    })
})

describe("Sps lex.", () => {
    it("Can Lex time minutes", () => {
        let input ="delay 1m"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.DelayCmd)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.MinuteLiteral))
            .toBeTruthy()
        
    })
    it("Can Lex time seconds", () => {
        let input ="delay 1s"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.DelayCmd)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.SecondLiteral))
            .toBeTruthy()
        
    })
    it("Can Lex time ms", () => {
        let input ="delay 1ms"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.DelayCmd)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.MillisecondLiteral))
            .toBeTruthy()
        
    })
})