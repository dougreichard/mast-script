"use strict"
const { createToken, createTokenInstance, Lexer } = require("chevrotain")
//const _ = require("lodash")
const _ = {
    isEmpty: require('lodash.isempty'),
    last: require('lodash.last'),
    partialRight: require('lodash.partialright')
}

let allLex = {};
let tokStack = [];
// Help function to eliminate repetative stuff
// make it easier to read
// tokens are stacked LIFO
// 
function tok(name, pattern, opt) {
    if (!opt) { opt = {} };
    opt.name = name;
    opt.pattern = pattern;
    let tok = createToken(opt);
    allLex[name] = tok;
    tokStack.unshift(tok);
    return tok
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
        // Both newlines and other Tokens have been matched 
        // AND the last matched Token is a newline
        (!noTokensMatchedYet &&
            !noNewLinesMatchedYet &&
            (_.last(newLines).endOffset === (offset-1)))

    // indentation can only be matched at the start of a line.
    if (isFirstLine || isStartOfLine) {
        let match
        let currIndentLevel = undefined
        const isZeroIndent = text.length > offset && text[offset] !== " "
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
                lastOffsetChecked = offset
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
                                allLex.Outdent,
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



// customize matchIndentBase to create separate functions of Indent and Outdent.
const matchIndent = _.partialRight(matchIndentBase, "indent")
const matchOutdent = _.partialRight(matchIndentBase, "outdent")

// newlines are not skipped, by setting their group to "nl" they are saved in the lexer result
// and thus we can check before creating an indentation token that the last token matched was a newline.

//tok("BlankLines", /\s*$/, { group: Lexer.SKIPPED })


tok("Sub", /-/);
tok("IntegerLiteral", /-?\d+/);
tok("NumberLiteral", /-?(0|[1-9]\d*)(\.\d+)+([eE][+-]?\d+)?/);
tok("MinuteLiteral", /(\d+)(m)/);
tok("SecondLiteral", /(\d+)(s)/);
tok("MillisecondLiteral", /(\d+)(ms)/);

tok("SingleLineComment", /[/]+.*/, { group: Lexer.SKIPPED })
tok("BlockComment", /\/[*]([^*]|([*][^/]))*[*]\//, { group: Lexer.SKIPPED })

//tok("DoubleStringLiteral", /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/);
//tok("TickStringLiteral", /`(:?[^\\`]|\\(:?[bfnrtv`\\/]|u[0-9a-fA-F]{4}))*`/);
//tok("SingleStringLiteral", /'(:?[^\\']|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*'/)

tok("StringLiteral", /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"|'(:?[^\\']|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*'|`(:?[^`]|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*`/);
const Identifier = tok("Identifier", /[a-zA-Z_]+\w*/);
tok("LineContinue", /_\s+/, {line_breaks: false, group: Lexer.SKIPPED, longer_alt: Identifier  })
//

//tok("Minutes", /minutes/, { longer_alt: Identifier });
//tok("Seconds", /s/, { longer_alt: Identifier });
//tok("MilliSeconds", /ms/, { longer_alt: Identifier });
tok("InOp", /in/, { longer_alt: Identifier });
tok("RangeOp", /range/, { longer_alt: Identifier });
tok("HasOp", /has/, { longer_alt: Identifier });
tok("SubOp", /sub/, { longer_alt: Identifier });
tok("TogetherOp", /together/, { longer_alt: Identifier });

tok("DoCmd", /do/, { longer_alt: Identifier });
tok("PassCmd", /pass/, { longer_alt: Identifier });
tok("AsCmd", /as/, { longer_alt: Identifier });
tok("WithCmd", /with/, { longer_alt: Identifier });
tok("TellCmd", /tell/, { longer_alt: Identifier });
tok("CueCmd", /cue/, { longer_alt: Identifier });
tok("SceneCmd", /scene/, { longer_alt: Identifier });
tok("SetCmd", /set/, { longer_alt: Identifier });
tok("DelayCmd", /delay/, { longer_alt: Identifier });
tok("ForCmd", /for/, { longer_alt: Identifier });



tok("True", /true/, { longer_alt: Identifier });
tok("False", /false/, { longer_alt: Identifier });
tok("Null", /null/, { longer_alt: Identifier });
//
tok("Comma", /,/);
tok("Colon", /:/);
tok("SemiColon", /;/);
tok("LParen", /\(/);
tok("RParen", /\)/);
tok("LBracket", /\[/);
tok("RBracket", /\]/);
tok("LBrace", /\{/);
tok("RBrace", /\}/);
//
tok("CastId", /@\w+/);
tok("MediaId", /!\w+/);
tok("SceneId", /\$\w+/);
tok("RoleId", /#\w+/);
tok("InteractionId", /\?\w+/);
tok("ObjectiveId", /\*\w+/);
tok("DataId", /\.\w*/);
// Sections
tok("ScriptSec", /script/, { longer_alt: Identifier });
tok("MediaSec", /media/, { longer_alt: Identifier });
tok("RoleSec", /roles/, { longer_alt: Identifier });
tok("CastSec", /cast/, { longer_alt: Identifier });
tok("SceneSec", /scenes/, { longer_alt: Identifier });
tok("StorySec", /story/, { longer_alt: Identifier });
tok("ImportSec", /imports/, { longer_alt: Identifier });
// 
tok("SearchCmd", /search/, { longer_alt: Identifier });
// 
tok("StartupBlock", /startup/, { longer_alt: Identifier });
tok("EnterBlock", /enter/, { longer_alt: Identifier });
tok("LeaveBlock", /leave/, { longer_alt: Identifier });
//
tok("ObjectiveBlock", /objective/, { longer_alt: Identifier });
tok("ObjectiveSec", /objectives/, { longer_alt: Identifier });

// tok("WhenSec", /when/, { longer_alt: Identifier });
// Objective Commands
tok("CompleteCmd", /complete/, { longer_alt: Identifier });
tok("FailCmd", /fail/, { longer_alt: Identifier });
tok("HideCmd", /hide/, { longer_alt: Identifier });
tok("ShowCmd", /show/, { longer_alt: Identifier });
tok("AskCmd", /ask/, { longer_alt: Identifier });
tok("ClickCmd", /click/, { longer_alt: Identifier });
// Conditions
tok("NearCond", /near/, { longer_alt: Identifier });
tok("HasRoleCond", /has-role/, { longer_alt: Identifier });
tok("AndCond", /and/, { longer_alt: Identifier });
tok("OrCond", /or/, { longer_alt: Identifier });
tok("DurationCond", /duration/, { longer_alt: Identifier });
// 
tok("InteractionBlock", /interaction/, { longer_alt: Identifier });
tok("InteractionSec", /interactions/, { longer_alt: Identifier });

tok("FormBlock", /form/, { longer_alt: Identifier });
tok("ChoiceBlock", /choice/, { longer_alt: Identifier });
tok("KeysBlock", /keys/, { longer_alt: Identifier });
// form elements
tok("InputElement", /input/, { longer_alt: Identifier });
tok("LabelElement", /label/, { longer_alt: Identifier });
tok("SelectElement", /select/, { longer_alt: Identifier });
tok("SubmitElement", /submit/, { longer_alt: Identifier });
//
tok("If", /if/, { longer_alt: Identifier });
tok("Else", /else/, { longer_alt: Identifier });
tok("Always", /always/, { longer_alt: Identifier });

// operators
tok("IsOp", /is/, { longer_alt: Identifier });
tok("GT_Op", />/);
tok("LT_Op", /</);
// set operators
tok("Assign", /=/);
tok("Equals", /==/);
tok("NotEquals", /!=/);
tok("GE_Op", />=/);
tok("LE_Op", /<=/);

tok("AssignAdd", /\+=/);
tok("AssignSub", /-=/);
tok("AssignMul", /\*=/);
tok("AssignPercentAdd", /\%\+/);
tok("AssignPercentSub", /\%-/);



/////////////////////////////////////
// These rule must be first
tok("WhiteSpace", /[ \t]+/, { group: Lexer.SKIPPED })

tok("Indent", matchIndent, { line_breaks: false })
tok("Outdent", matchOutdent, { line_breaks: false })
// custom token patterns should explicitly specify the line_breaks option

tok("Newline", /\n|\r\n|\r/, { group: "nl" });


const spsLexer = new Lexer(tokStack);

module.exports = {
    tokens: allLex,

    tokenize: function (text) {
        // have to reset the indent stack between processing of different text inputs
        indentStack = [0]
        lastOffsetChecked = undefined

        const lexResult = spsLexer.tokenize(text)

        //add remaining Outdents
        while (indentStack.length > 1) {
            lexResult.tokens.push(
                createTokenInstance(allLex.Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN)
            )
            indentStack.pop()
        }
         return lexResult
    }
}