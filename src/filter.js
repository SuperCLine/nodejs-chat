var dfa = require('./dfa');

var filter = {

    dfaMap: new dfa(),

    addWords: function(words) {
        filter.dfaMap.addToHashMap(words);
    },

    addWord: function(word) {
        filter.addWords([word]);
    },

    containsDfa: function(content) {
        let result = false;
        for (let i = 0; i < content.length; ++i) {
            if (filter.checkByDfa(content, i) > 0) {
                result = true;
                break;
            }
        }
        return result;
    },

    wordsDfa: function(content) {
        const l = [];
        for (let i = 0; i < content.length; ++i) {
            const index = filter.checkByDfa(content, i);
            if (index > 0) {
                l.push(content.substring(i, i + index));
                i = i + index - 1;
            }
        }
        return l;
    },

    replaceDfa: function(content, separator = '*', once = false) {
        let newContent = content;
        const l = filter.wordsDfa(content);
        for (let i = 0; i < l.length; ++i) {
            const words = l[i];
            const replaceWords = filter.replaceWords(
                separator,
                words.length,
                once,
            );
            newContent = newContent.replace(
                new RegExp(words, 'g'),
                replaceWords,
            );
        }
        return newContent;
    },

    checkByDfa: function(content, begin) {
        let matchFlag = 0;
        let isEnd = false;
        let nowMap = filter.dfaMap.words();
        let word = null;
        for (let i = begin; i < content.length; ++i) {
            word = content[i];
            nowMap = nowMap[word];
            if (nowMap !== undefined) {
                matchFlag++;
                if (nowMap.isEnd === 1) {
                    isEnd = true;
                    break;
                }
            } else {
                break;
            }
        }

        if (!isEnd) {
            matchFlag = 0;
        }

        return matchFlag;
    },

    replaceWords: function(separator, length, once) {
        if (once) {
            return separator;
        }
        return new Array(length + 1).join(separator);
    }
}

module.exports = filter;