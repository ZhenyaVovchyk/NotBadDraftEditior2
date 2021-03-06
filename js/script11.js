





(function () {

    const states = {
        NONE: 0,
        SINGLE_QUOTE: 1, // 'string'
        DOUBLE_QUOTE: 2, // "string"
        ML_QUOTE: 3, // `string`
        REGEX_LITERAL: 4, // /regex/
        SL_COMMENT: 5, // // single line comment
        ML_COMMENT: 6, // /* multiline comment */
        NUMBER_LITERAL: 7, // 123
        KEYWORD: 8, // function, var etc.
        SPECIAL: 9 // null, true etc.
    };

    const colors = {
        NONE: '#000',
        SINGLE_QUOTE: '#aaa', // 'string'
        DOUBLE_QUOTE: '#aaa', // "string"
        ML_QUOTE: '#aaa', // `string`
        REGEX_LITERAL: '#707', // /regex/
        SL_COMMENT: '#0a0', // // single line comment
        ML_COMMENT: '#0a0', // /* multiline comment */
        NUMBER_LITERAL: '#a00', // 123
        KEYWORD: '#00a', // function, var etc.
        SPECIAL: '#055' // null, true etc.
    };

    const keywords = ('async|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|' +
        'get|if|implements|import|in|instanceof|interface|let|new|of|package|private|protected|public|return|set|static|super|' +
        'switch|throw|try|typeof|var|void|while|with|yield|catch|finally').split('|');
    const specials = 'this|null|true|false|undefined|NaN|Infinity'.split('|');

    function isAlphaNumericChar(char) {
        return char && /[0-9a-z_\$]/i.test(char);
    }

    function highlight(code) {
        let output = '';
        let state = states.NONE;
        for (let i = 0; i < code.length; i++) {
            let char = code[i], prev = code[i - 1], next = code[i + 1];

            if (state == states.NONE && char == '/' && next == '/') {
                state = states.SL_COMMENT;
                output += '<span style="color: ' + colors.SL_COMMENT + '">' + char;
                continue;
            }
            if (state == states.SL_COMMENT && char == '\n') {
                state = states.NONE;
                output += char + '</span>';
                continue;
            }

            if (state == states.NONE && char == '/' && next == '*') {
                state = states.ML_COMMENT;
                output += '<span style="color: ' + colors.ML_COMMENT + '">' + char;
                continue;
            }
            if (state == states.ML_COMMENT && char == '/' && prev == '*') {
                state = states.NONE;
                output += char + '</span>';
                continue;
            }

            const closingCharNotEscaped = prev != '\\' || prev == '\\' && code[i - 2] == '\\';
            if (state == states.NONE && char == '\'') {
                state = states.SINGLE_QUOTE;
                output += '<span style="color: ' + colors.SINGLE_QUOTE + '">' + char;
                continue;
            }
            if (state == states.SINGLE_QUOTE && char == '\'' && closingCharNotEscaped) {
                state = states.NONE;
                output += char + '</span>';
                continue;
            }

            if (state == states.NONE && char == '"') {
                state = states.DOUBLE_QUOTE;
                output += '<span style="color: ' + colors.DOUBLE_QUOTE + '">' + char;
                continue;
            }
            if (state == states.DOUBLE_QUOTE && char == '"' && closingCharNotEscaped) {
                state = states.NONE;
                output += char + '</span>';
                continue;
            }

            if (state == states.NONE && char == '`') {
                state = states.ML_QUOTE;
                output += '<span style="color: ' + colors.ML_QUOTE + '">' + char;
                continue;
            }
            if (state == states.ML_QUOTE && char == '`' && closingCharNotEscaped) {
                state = states.NONE;
                output += char + '</span>';
                continue;
            }

            if (state == states.NONE && char == '/') {
                let word = '', j = 0, isRegex = true;
                while (i + j >= 0) {
                    j--;
                    if ('+/-*=|&<>%,({[?:;'.indexOf(code[i + j]) != -1) break;
                    if (!isAlphaNumericChar(code[i + j]) && word.length > 0) break;
                    if (isAlphaNumericChar(code[i + j])) word = code[i + j] + word;
                    if (')]}'.indexOf(code[i + j]) != -1) {
                        isRegex = false;
                        break;
                    }
                }
                if (word.length > 0 && !keywords.includes(word)) isRegex = false;
                if (isRegex) {
                    state = states.REGEX_LITERAL;
                    output += '<span style="color: ' + colors.REGEX_LITERAL + '">' + char;
                    continue;
                }
            }
            if (state == states.REGEX_LITERAL && char == '/' && closingCharNotEscaped) {
                state = states.NONE;
                output += char + '</span>';
                continue;
            }

            if (state == states.NONE && /[0-9]/.test(char) && !isAlphaNumericChar(prev)) {
                state = states.NUMBER_LITERAL;
                output += '<span style="color: ' + colors.NUMBER_LITERAL + '">' + char;
                continue;
            }
            if (state == states.NUMBER_LITERAL && !isAlphaNumericChar(char)) {
                state = states.NONE;
                output += '</span>'
            }

            if (state == states.NONE && !isAlphaNumericChar(prev)) {
                let word = '', j = 0;
                while (code[i + j] && isAlphaNumericChar(code[i + j])) {
                    word += code[i + j];
                    j++;
                }
                if (keywords.includes(word)) {
                    state = states.KEYWORD;
                    output += '<span style="color: ' + colors.KEYWORD + '">';
                }
                if (specials.includes(word)) {
                    state = states.SPECIAL;
                    output += '<span style="color: ' + colors.SPECIAL + '">';
                }
            }
            if ((state == states.KEYWORD || state == states.SPECIAL) && !isAlphaNumericChar(char)) {
                state = states.NONE;
                output += '</span>';
            }

            if (state == states.NONE && '+-/*=&|%!<>?:'.indexOf(char) != -1) {
                output += '<span style="color: #07f">' + char + '</span>';
                continue;
            }

            output += char.replace('<', '&lt;');
        }
        return output.replace(/\n/gm, '<br>').replace(/\t/g, new Array(8).join('&nbsp;'))
            .replace(/^\s+|\s{2,}/g, (a) => new Array(a.length + 1).join('&nbsp;'));
    }

    window.highlight = highlight;

})();

const formattedhtml = document.getElementById('html-editor');
document.querySelector('#html').addEventListener('input', function () {

    formattedhtml.innerHTML = highlight(this.value) //.replace(/<(?!\/?span)/gi, '&lt;');
});

