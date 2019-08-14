import nutLex from "../src/nut-lex"
// const { tokenMatcher } = require("chevrotain")
import  { tokenMatcher } from "chevrotain"
import {expect} from 'chai'
const tokenize = nutLex.tokenize

describe("The Chevrotain Lexer ability to lex python like indentation.", () => {
    it("Can Lex a simple python style if-else ", () => {
        let input =
            "if (1)\n" +
            "  if (2)\n" +
            "    if(3)\n" +
            "      tell 666\n" +
            "  else\n" +
            "    tell `9\n99`\n"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], nutLex.tokens.If)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], nutLex.tokens.LParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[2], nutLex.tokens.IntegerLiteral))
            .toBeTruthy()
        expect(tokenMatcher(actualTokens[3], nutLex.tokens.RParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[4], nutLex.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[5], nutLex.tokens.If)).toBeTruthy()
        expect(tokenMatcher(actualTokens[6], nutLex.tokens.LParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[7], nutLex.tokens.IntegerLiteral))
            .toBeTruthy()
        expect(tokenMatcher(actualTokens[8], nutLex.tokens.RParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[9], nutLex.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[10], nutLex.tokens.If)).toBeTruthy()
        expect(tokenMatcher(actualTokens[11], nutLex.tokens.LParen)).toBeTruthy()
        expect(
            tokenMatcher(actualTokens[12], nutLex.tokens.IntegerLiteral)
        ).toBeTruthy()
        expect(tokenMatcher(actualTokens[13], nutLex.tokens.RParen)).toBeTruthy()
        expect(tokenMatcher(actualTokens[14], nutLex.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[15], nutLex.tokens.TellCmd)).toBeTruthy()
        expect(
            tokenMatcher(actualTokens[16], nutLex.tokens.IntegerLiteral)
        ).toBeTruthy()
        expect(tokenMatcher(actualTokens[17], nutLex.tokens.Outdent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[18], nutLex.tokens.Outdent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[19], nutLex.tokens.Else)).toBeTruthy()
        expect(tokenMatcher(actualTokens[20], nutLex.tokens.Indent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[21], nutLex.tokens.TellCmd)).toBeTruthy()
        expect(
            tokenMatcher(actualTokens[22], nutLex.tokens.StringLiteral)
        ).toBeTruthy()
        expect(tokenMatcher(actualTokens[23], nutLex.tokens.Outdent)).toBeTruthy()
        expect(tokenMatcher(actualTokens[24], nutLex.tokens.Outdent)).toBeTruthy()
    })
})

describe("Sps lex.", () => {
    it("Can Lex time minutes", () => {
        let input ="delay 1m"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], nutLex.tokens.DelayCmd)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], nutLex.tokens.MinuteLiteral))
            .toBeTruthy()
        
    })
    it("Can Lex time seconds", () => {
        let input ="delay 1s"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], nutLex.tokens.DelayCmd)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], nutLex.tokens.SecondLiteral))
            .toBeTruthy()
        
    })
    it("Can Lex time ms", () => {
        let input ="delay 1ms"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], nutLex.tokens.DelayCmd)).toBeTruthy()
        expect(tokenMatcher(actualTokens[1], nutLex.tokens.MillisecondLiteral))
            .toBeTruthy()
        
    })
})