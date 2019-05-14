'use strict';
/**
 * Javascript version of https://gist.github.com/jbroadway/2836900
 *
 * Slimdown - A very basic regex-based Markdown parser. Supports the
 * following elements (and can be extended via Slimdown::add_rule()):
 *
 * - Headers
 * - Links
 * - Bold
 * - Emphasis
 * - Deletions
 * - Quotes
 * - Inline code
 * - Blockquotes
 * - Ordered/unordered lists
 * - Horizontal rules
 *
 * Author: Johnny Broadway <johnny@johnnybroadway.com>
 * Website: https://gist.github.com/jbroadway/2836900
 * License: MIT
 */
class Slimdown {
    constructor() {
        // Rules
        this.rules = [
            { regex: /(#+)(.*)/g, replacement: header },
            { regex: /!\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<img src=\'$2\' alt=\'$1\'>' },
            { regex: /\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<a href=\'$2\'>$1</a>' },
            { regex: /(\*\*|__)(.*?)\1/g, replacement: '<strong>$2</strong>' },
            { regex: /(\*|_)(.*?)\1/g, replacement: '<em>$2</em>' },
            { regex: /\~\~(.*?)\~\~/g, replacement: '<del>$1</del>' },
            { regex: /\:\"(.*?)\"\:/g, replacement: '<q>$1</q>' },
            { regex: /`(.*?)`/g, replacement: '<code>$1</code>' },
            { regex: /\n\*(.*)/g, replacement: ulList },
            { regex: /\n[0-9]+\.(.*)/g, replacement: olList },
            { regex: /\n(&gt;|\>)(.*)/g, replacement: blockquote },
            { regex: /\n-{5,}/g, replacement: '\n<hr />' },
            { regex: /\n([^\n]+)\n/g, replacement: para },
            { regex: /<\/ul>\s?<ul>/g, replacement: '' },
            { regex: /<\/ol>\s?<ol>/g, replacement: '' },
            { regex: /<\/blockquote><blockquote>/g, replacement: '\n' } // fix extra blockquote
        ];
        ////////////
        function para(text, line) {
            const trimmed = line.trim();
            if (/^<\/?(ul|ol|li|h|p|bl)/i.test(trimmed)) {
                return `\n${line}\n`;
            }
            return `\n<p>${trimmed}</p>\n`;
        }
        function ulList(text, item) {
            return `\n<ul>\n\t<li>${item.trim()}</li>\n</ul>`;
        }
        function olList(text, item) {
            return `\n<ol>\n\t<li>${item.trim()}</li>\n</ol>`;
        }
        function blockquote(text, tmp, item) {
            return `\n<blockquote>${item.trim()}</blockquote>`;
        }
        function header(text, chars, content) {
            const level = chars.length;
            return `<h${level}>${content.trim()}</h${level}>`;
        }
    }
    // Add a rule.
    addRule(regex, replacement) {
        //regex.global = true;
        //regex.multiline = false;
        this.rules.push({
            regex,
            replacement,
        });
    }
    // Render some Markdown into HTML.
    render(text) {
        text = `\n${text}\n`;
        this.rules.forEach((rule) => {
            text = text.replace(rule.regex, rule.replacement);
        });
        return text.trim();
    }
}
////////////
module.exports = Slimdown;
