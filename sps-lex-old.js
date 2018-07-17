"use strict"
const { createToken, createTokenInstance, Lexer } = require("chevrotain")
//const _ = require("lodash")

const _ = {
    isEmpty: require('lodash.isempty'),
    last: require('lodash.last'),
    partialRight: require('lodash.partialright')
}

/**
 *
 * Works like a / +/y regExp.
 *  - Note the usage of the 'y' (sticky) flag.
 *    This can be used to match from a specific offset in the text
 *    in our case from startOffset.
 *
 * The reason this has been implemented "manually" is because the sticky flag is not supported
 * on all modern node.js versions (4.0 specifically).
 */
function matchWhiteSpace(text, startOffset) {
    let result = ""
    let offset = startOffset
    // ignoring tabs in this example
    while (text[offset] === " ") {
        offset++
        result += " "
    }

    if (result === "") {
        return null
    }

    return [result]
}

// State required for matching the indentations
let indentStack = [0]
let lastOffsetChecked

/**
 * This custom Token matcher uses Lexer context ("matchedTokens" and "groups" arguments)
 * combined with state via closure ("indentStack" and "lastTextMatched") to match indentation.
 *
 * @param {string} text - remaining text to lex, sent by the Chevrotain lexer.
 * @param {IToken[]} matchedTokens - Tokens lexed so far, sent by the Chevrotain Lexer.
 * @param {object} groups - Token groups already lexed, sent by the Chevrotain Lexer.
 * @param {string} type - determines if this function matches Indent or Outdent tokens.
 * @returns {*}
 */
function matchIndentBase(text, offset, matchedTokens, groups, type) {
    const noTokensMatchedYet = _.isEmpty(matchedTokens)
    const newLines = groups.nl
    const noNewLinesMatchedYet = _.isEmpty(newLines)
    const isFirstLine = noTokensMatchedYet && noNewLinesMatchedYet
    const isStartOfLine =
        // only newlines matched so far
        (noTokensMatchedYet && !noNewLinesMatchedYet) ||
        // Both newlines and other Tokens have been matched AND the last matched Token is a newline
        (!noTokensMatchedYet &&
            !noNewLinesMatchedYet &&
            (!_.isEmpty(newLines) &&
                !_.isEmpty(matchedTokens) &&
                _.last(newLines).startOffset) >
                _.last(matchedTokens).startOffset)

    // indentation can only be matched at the start of a line.
    if (isFirstLine || isStartOfLine) {
        let match
        let currIndentLevel = undefined
        const isZeroIndent = text.length < offset && text[offset] !== " "
        if (isZeroIndent) {
            // Matching zero spaces Outdent would not consume any chars, thus it would cause an infinite loop.
            // This check prevents matching a sequence of zero spaces outdents.
            if (lastOffsetChecked !== offset) {
                currIndentLevel = 0
                match = [""]
                lastOffsetChecked = offset
            }
        } else {
            // possible non-empty indentation
            match = matchWhiteSpace(text, offset)
            if (match !== null) {
                currIndentLevel = match[0].length
            }
        }

        if (currIndentLevel !== undefined) {
            const lastIndentLevel = _.last(indentStack)
            if (currIndentLevel > lastIndentLevel && type === "indent") {
                indentStack.push(currIndentLevel)
                return match
            } else if (
                currIndentLevel < lastIndentLevel &&
                type === "outdent"
            ) {
                //if we need more than one outdent token, add all but the last one
                if (indentStack.length > 2) {
                    const image = ""
                    const offset = _.last(matchedTokens).endOffset + 1
                    const line = _.last(matchedTokens).endLine
                    const column = _.last(matchedTokens).endColumn + 1
                    while (
                        indentStack.length > 2 &&
                        //stop before the last Outdent
                        indentStack[indentStack.length - 2] > currIndentLevel
                    ) {
                        indentStack.pop()
                        matchedTokens.push(
                            createTokenInstance(
                                Outdent,
                                "",
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN
                            )
                        )
                    }
                }
                indentStack.pop()
                return match
            } else {
                // same indent, this should be lexed as simple whitespace and ignored
                return null
            }
        } else {
            // indentation cannot be matched without at least one space character.
            return null
        }
    } else {
        // indentation cannot be matched under other circumstances
        return null
    }
}


/*const allLex = {};
function tok(name, pattern) {
    allLex[name] = createToken({ name: "IntegerLiteral", pattern: /\d+/ })
}*/


// customize matchIndentBase to create separate functions of Indent and Outdent.
const matchIndent = _.partialRight(matchIndentBase, "indent")
const matchOutdent = _.partialRight(matchIndentBase, "outdent")

const IntegerLiteral = createToken({ name: "IntegerLiteral", pattern: /\d+/ })
const NumberLiteral = createToken({name: "NumberLiteral",pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/})
const DoubleStringLiteral = createToken({
    name: "DoubleStringLiteral",
    pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
})
const TickStringLiteral = createToken({
    name: "TickStringLiteral",
    pattern: /`(:?[^\\`]|\\(:?[bfnrtv`\\/]|u[0-9a-fA-F]{4}))*`/
})
const SingleStringLiteral = createToken({
    name: "SingleStringLiteral",
    pattern: /'(:?[^\\']|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*'/
})

const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"|'(:?[^\\']|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*'|`(:?[^`]|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*`/
})

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ })
const True = createToken({ name: "True", pattern: /true/, longer_alt: Identifier })
const False = createToken({ name: "False", pattern: /false/, longer_alt: Identifier })
const Null = createToken({ name: "Null", pattern: /null/, longer_alt: Identifier })
//
const Comma = createToken({ name: "Comma", pattern: /,/ })
const Colon = createToken({ name: "Colon", pattern: /:/ })
const SemiColon = createToken({ name: "SemiColon", pattern: /;/ })
const LParen = createToken({ name: "LParen", pattern: /\(/ })
const RParen = createToken({ name: "RParen", pattern: /\)/ })
const LBracket = createToken({ name: "LBracket", pattern: /\[/ })
const RBracket = createToken({ name: "RBracket", pattern: /\]/ })
const LBrace = createToken({ name: "LBrace", pattern: /\{/ })
const RBrace = createToken({ name: "RBrace", pattern: /\}/ })
//
const CastId = createToken({ name: "CastId", pattern: /@\w+/ })
const MediaId = createToken({ name: "MediaId", pattern: /!\w+/ })
const SceneId = createToken({ name: "SceneId", pattern: /\$\w+/ })
const RoleId = createToken({ name: "RoleId", pattern: /#\w+/ })
const InteractionId = createToken({ name: "InteractionId", pattern: /\?\w+/ })
const ObjectiveId = createToken({ name: "ObjectId", pattern: /\*\w+/ })
const DataId = createToken({ name: "DataId", pattern: /\.\w+/ })
// Sections
const ScriptSec = createToken({ name: "ScriptSec", pattern: /script/, longer_alt: Identifier })
const MediaSec = createToken({ name: "MediaSec", pattern: /media/, longer_alt: Identifier })
const RoleSec = createToken({ name: "RoleSec", pattern: /roles/, longer_alt: Identifier })
const CastSec = createToken({ name: "CastSec", pattern: /cast/, longer_alt: Identifier })
const SceneSec  = createToken({ name: "SceneSec", pattern: /scenes/, longer_alt: Identifier })
const StorySec = createToken({ name: "StorySec", pattern: /story/, longer_alt: Identifier })
// 
const SearchCmd = createToken({ name: "SearchCmd", pattern: /search/, longer_alt: Identifier })
// 
const StartupBlock = createToken({ name: "StartupBlock", pattern: /startup/, longer_alt: Identifier })
const EnterBlock = createToken({ name: "EnterBlock", pattern: /enter/, longer_alt: Identifier })
const LeaveBlock = createToken({ name: "LeaveBlock", pattern: /leave/, longer_alt: Identifier })
//
const ObjectiveSec = createToken({ name: "ObjectiveSec", pattern: /objectives/, longer_alt: Identifier })
const ObjectiveBlock = createToken({ name: "ObjectiveBlock", pattern: /objective/, longer_alt: Identifier })
const WhenSec = createToken({ name: "WhenSec", pattern: /when/, longer_alt: Identifier })
// Objective Commands
const CompleteCmd = createToken({ name: "CompleteCmd", pattern: /complete/, longer_alt: Identifier })
const FailCmd = createToken({ name: "FailCmd", pattern: /fail/, longer_alt: Identifier })
const HideCmd = createToken({ name: "HideCmd", pattern: /hide/, longer_alt: Identifier })
const ShowCmd = createToken({ name: "ShowCmd", pattern: /show/, longer_alt: Identifier })
// Conditions
const NearCond = createToken({ name: "NearCond", pattern: /near/, longer_alt: Identifier })
const HasRoleCond = createToken({ name: "HasRoleCond", pattern: /has-role/, longer_alt: Identifier })
const AndCond = createToken({ name: "AndCond", pattern: /and/, longer_alt: Identifier })
const DurationCond = createToken({ name: "DurationCond", pattern: /duration/, longer_alt: Identifier })
// 
const InteractionSec = createToken({ name: "InteractionSec", pattern: /interactions/, longer_alt: Identifier })
const InteractionBlock = createToken({ name: "InteractionBlock", pattern: /interaction/, longer_alt: Identifier })
const FormBlock = createToken({ name: "FormBlock", pattern: /form/, longer_alt: Identifier })
// form elements
const InputBlock = createToken({ name: "InputBlock", pattern: /input/, longer_alt: Identifier })
const LabelBlock = createToken({ name: "LabelBlock", pattern: /label/, longer_alt: Identifier })
const SelectBlock = createToken({ name: "SelectBlock", pattern: /select/, longer_alt: Identifier })
const SubmitBlock = createToken({ name: "SubmitBlock", pattern: /submit/, longer_alt: Identifier })
//
const If = createToken({ name: "If", pattern: /if/, longer_alt: Identifier })
const Else = createToken({ name: "Else", pattern: /else/, longer_alt: Identifier })

const TellCmd = createToken({ name: "TellCmd", pattern: /tell/, longer_alt: Identifier })
const SceneCmd = createToken({ name: "SceneCmd", pattern: /scene/, longer_alt: Identifier })
const SetCmd = createToken({ name: "SetCmd", pattern: /set/, longer_alt: Identifier })
const DelayCmd = createToken({ name: "DelayCmd", pattern: /delay/, longer_alt: Identifier })
const Minute = createToken({ name: "Minutes", pattern: /m/, longer_alt: Identifier })
const Second = createToken({ name: "Second", pattern: /s/, longer_alt: Identifier })
const MilliSecond = createToken({ name: "MilliSecond", pattern: /ms/, longer_alt: Identifier })
// operators
const IsOp = createToken({ name: "IsOp", pattern: /is/, longer_alt: Identifier })
const HasOp = createToken({ name: "HasOp", pattern: /has/, longer_alt: Identifier })
const Equals = createToken({ name: "Equals", pattern: /==/ })
const NotEquals = createToken({ name: "NotEquals", pattern: /!=/ })
const GE_Op = createToken({ name: "GE_Op", pattern: />=/ })
const LE_Op = createToken({ name: "LE_Op", pattern: /<=/ })
const GT_Op = createToken({ name: "GT_Op", pattern: />/ })
const LT_Op = createToken({ name: "LT_Op", pattern: /</ })
// set operators
const Assign = createToken({ name: "Assign", pattern: /=/ })
const AssignAdd = createToken({ name: "AssignAdd", pattern: /\+=/ })
const AssignSub = createToken({ name: "AssignSub", pattern: /-=/ })
const AssignMul = createToken({ name: "AssignMul", pattern: /\*=/ })
const Spaces = createToken({name: "Spaces",pattern: / +/,group: Lexer.SKIPPED})
// newlines are not skipped, by setting their group to "nl" they are saved in the lexer result
// and thus we can check before creating an indentation token that the last token matched was a newline.
const Newline = createToken({name: "Newline",pattern: /\n|\r\n?/,group: "nl"})
// define the indentation tokens using custom token patterns
// custom token patterns should explicitly specify the line_breaks option
const Indent = createToken({name: "Indent", pattern: matchIndent, line_breaks: false})
// custom token patterns should explicitly specify the line_breaks option
const Outdent = createToken({name: "Outdent",pattern: matchOutdent,line_breaks: false})


const allLex = {
    Newline: Newline,
    // indentation tokens must appear before Spaces, otherwise all indentation will always be consumed as spaces.
    // Outdent must appear before Indent for handling zero spaces outdents.
    Outdent: Outdent,
    Indent:Indent,
    StringLiteral:StringLiteral,
    True:True,
    False:False,
    Null:Null,
    Comma:Comma,
    Colon:Colon,
    SemiColon:SemiColon,
    LParen:LParen,
    RParen:RParen, 
    LBracket:LBracket,
    RBracket:RBracket,
    LBrace:LBrace,
    RBrace:RBrace,
    //
    CastId:CastId,
    MediaId:MediaId,
    SceneId:SceneId,
    RoleId:RoleId,
    InteractionId:InteractionId,
    ObjectiveId:ObjectiveId,
    DataId:DataId,
    ScriptSec:ScriptSec,
    MediaSec:MediaSec,
    RoleSec:RoleSec,
    CastSec:CastSec,
    SceneSec:SceneSec,
    StorySec:StorySec,
    SearchCmd:SearchCmd,
    StartupBlock:StartupBlock,
    EnterBlock:EnterBlock,
    LeaveBlock:LeaveBlock,
    ObjectiveSec:ObjectiveSec,
    ObjectiveBlock:ObjectiveBlock,
    WhenSec:WhenSec,
    CompleteCmd:CompleteCmd,
    FailCmd:FailCmd,
    HideCmd:HideCmd,
    ShowCmd:ShowCmd,
    NearCond:NearCond,
    HasRoleCond:HasRoleCond,
    AndCond:AndCond,
    DurationCond:DurationCond,
    InteractionSec:InteractionSec,
    InteractionBlock:InteractionBlock,
    FormBlock:FormBlock,
    InputBlock:InputBlock,
    LabelBlock:LabelBlock,
    SelectBlock:SelectBlock,
    SubmitBlock:SubmitBlock,

    If:If,
    Else:Else,

    TellCmd:TellCmd,
    SceneCmd:SceneCmd,
    SetCmd:SetCmd,
    DelayCmd:DelayCmd,
    
    Second:Second,
    MilliSecond:MilliSecond,
    // must be after ms
    Minute:Minute,
    IsOp:IsOp,
    HasOp:HasOp,
    Equals:Equals,
    NotEquals:NotEquals,
    GE_Op:GE_Op,
    LE_Op:LE_Op,
    GT_Op:GT_Op,
    LT_Op:LT_Op,
    Assign:Assign,
    AssignAdd:AssignAdd,
    AssignSub:AssignSub,
    AssignMul:AssignMul,
    NumberLiteral:NumberLiteral,
    //IntegerLiteral:IntegerLiteral,
    Spaces:Spaces,
    Identifier:Identifier
};

const spsLexer = new Lexer(Object.values(allLex))

module.exports = {
   tokens: allLex,

    tokenize: function(text) {
        // have to reset the indent stack between processing of different text inputs
        indentStack = [0]
        lastOffsetChecked = undefined

        const lexResult = spsLexer.tokenize(text)

        //add remaining Outdents
        while (indentStack.length > 1) {
            lexResult.tokens.push(
                createTokenInstance(Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN)
            )
            indentStack.pop()
        }

        if (lexResult.errors.length > 0) {
            throw new Error("sad sad panda lexing errors detected")
        }
        return lexResult
    }
}