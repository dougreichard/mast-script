"use strict"

const expect = require("chai").expect
const indentationExample = require("../sps-lex")
const { tokenMatcher } = require("chevrotain")
const tokenize = indentationExample.tokenize

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
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.If)).to.be.true
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.LParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[2], indentationExample.tokens.IntegerLiteral))
            .to.be.true
        expect(tokenMatcher(actualTokens[3], indentationExample.tokens.RParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[4], indentationExample.tokens.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[5], indentationExample.tokens.If)).to.be.true
        expect(tokenMatcher(actualTokens[6], indentationExample.tokens.LParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[7], indentationExample.tokens.IntegerLiteral))
            .to.be.true
        expect(tokenMatcher(actualTokens[8], indentationExample.tokens.RParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[9], indentationExample.tokens.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[10], indentationExample.tokens.If)).to.be.true
        expect(tokenMatcher(actualTokens[11], indentationExample.tokens.LParen)).to.be
            .true
        expect(
            tokenMatcher(actualTokens[12], indentationExample.tokens.IntegerLiteral)
        ).to.be.true
        expect(tokenMatcher(actualTokens[13], indentationExample.tokens.RParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[14], indentationExample.tokens.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[15], indentationExample.tokens.TellCmd)).to.be
            .true
        expect(
            tokenMatcher(actualTokens[16], indentationExample.tokens.IntegerLiteral)
        ).to.be.true
        expect(tokenMatcher(actualTokens[17], indentationExample.tokens.Outdent)).to.be
            .true
        expect(tokenMatcher(actualTokens[18], indentationExample.tokens.Outdent)).to.be
            .true
        expect(tokenMatcher(actualTokens[19], indentationExample.tokens.Else)).to.be
            .true
        expect(tokenMatcher(actualTokens[20], indentationExample.tokens.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[21], indentationExample.tokens.TellCmd)).to.be
            .true
        expect(
            tokenMatcher(actualTokens[22], indentationExample.tokens.StringLiteral)
        ).to.be.true
        expect(tokenMatcher(actualTokens[23], indentationExample.tokens.Outdent)).to.be
            .true
        expect(tokenMatcher(actualTokens[24], indentationExample.tokens.Outdent)).to.be
            .true
    })
})

describe("Sps lex.", () => {
    it("Can Lex time minutes", () => {
        let input ="delay 1m"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.DelayCmd)).to.be.true
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.MinuteLiteral))
            .to.be.true
        
    })
    it("Can Lex time seconds", () => {
        let input ="delay 1s"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.DelayCmd)).to.be.true
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.SecondLiteral))
            .to.be.true
        
    })
    it("Can Lex time ms", () => {
        let input ="delay 1ms"

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens
        expect(tokenMatcher(actualTokens[0], indentationExample.tokens.DelayCmd)).to.be.true
        expect(tokenMatcher(actualTokens[1], indentationExample.tokens.MillisecondLiteral))
            .to.be.true
        
    })
})