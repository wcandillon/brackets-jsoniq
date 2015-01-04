/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets */

define(function () {
    'use strict';

    var CodeMirror      = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        LanguageManager = brackets.getModule("language/LanguageManager");

    var JSONiqLexer = require("xqlint").JSONiqLexer;

    CodeMirror.defineMode("jsoniq", function () {

        var lexer = new JSONiqLexer();
        var styles = {
            keyword: 'keyword',
            text: '',
            variable: 'variable',
            string: 'string',
            'meta.tag': 'tag',
            comment: 'comment',
            'keyword.operator': 'operator',
            'entity.other.attribute-name': 'attribute',
            lparen: 'operator',
            rparen: 'operator',
            constant: 'atom',
            number: 'number',
            'support.function': 'builtin',
            'support.type': 'atom',
            'constant.language.escape': 'error',
            'comment.doc': 'comment',
            'comment.doc.tag': ''
        };

        return {
            startState: function() {
                return {
                    stack: undefined,
                    tokens: [],
                    line: ''
                };
            },

            token: function(stream, state) {
                if(state.line.length === 0) {
                    state.line = '';
                    while(!stream.eol()) {
                        state.line += stream.next();
                    }
                    stream.backUp(state.line.length);
                    var tokens = lexer.getLineTokens(state.line, state.stack);
                    state.stack = tokens.state;
                    state.tokens = tokens.tokens;
                }
                var token = state.tokens.splice(0, 1)[0];
                state.line = state.line.substring(token.value.length);
                stream.match(token.value, true);
                return styles[token.type];
            },

            blockCommentStart: "(:",
            blockCommentEnd: ":)"
        };
    });


    LanguageManager.defineLanguage("jsoniq", {
        name: "JSONiq",
        mode: "jsoniq",
        fileExtensions: ["jq"]
    });

});