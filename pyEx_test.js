"use strict"

const expect = require("chai").expect
const indentationExample = require("./pyEx")
const { tokenMatcher } = require("chevrotain")
const tokenize = indentationExample.tokenize

describe("The Chevrotain Lexer ability to lex python like indentation.", () => {
    it("Can Lex a simple python style if-else ", () => {
        let input =
`if (1)
    print 666

    if (1)
        print 666
       
if (2)
    print 888
`
            

        let lexResult = tokenize(input)
        let actualTokens = lexResult.tokens

        expect(tokenMatcher(actualTokens[0], indentationExample.If)).to.be.true
        expect(tokenMatcher(actualTokens[1], indentationExample.LParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[2], indentationExample.IntegerLiteral))
            .to.be.true
        expect(tokenMatcher(actualTokens[3], indentationExample.RParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[4], indentationExample.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[5], indentationExample.Print)).to.be
            .true
        expect(
            tokenMatcher(actualTokens[6], indentationExample.IntegerLiteral)
        ).to.be.true
        // 
        expect(tokenMatcher(actualTokens[7], indentationExample.If)).to.be.true
        expect(tokenMatcher(actualTokens[8], indentationExample.LParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[9], indentationExample.IntegerLiteral))
            .to.be.true
        expect(tokenMatcher(actualTokens[10], indentationExample.RParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[11], indentationExample.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[12], indentationExample.Print)).to.be
            .true
        expect(
            tokenMatcher(actualTokens[13], indentationExample.IntegerLiteral)
        ).to.be.true
        expect(tokenMatcher(actualTokens[14], indentationExample.Outdent)).to.be
            .true
        expect(tokenMatcher(actualTokens[15], indentationExample.Outdent)).to.be
            .true
        //
        expect(tokenMatcher(actualTokens[16], indentationExample.If)).to.be.true
        expect(tokenMatcher(actualTokens[17], indentationExample.LParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[18], indentationExample.IntegerLiteral))
            .to.be.true
        expect(tokenMatcher(actualTokens[19], indentationExample.RParen)).to.be
            .true
        expect(tokenMatcher(actualTokens[20], indentationExample.Indent)).to.be
            .true
        expect(tokenMatcher(actualTokens[21], indentationExample.Print)).to.be
            .true
        expect(
            tokenMatcher(actualTokens[22], indentationExample.IntegerLiteral)
        ).to.be.true
        expect(tokenMatcher(actualTokens[23], indentationExample.Outdent)).to.be
            .true


    })
})