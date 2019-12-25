var dfa = function() {

    this.maps = {};

    this.words = function() {
        return this.maps;
    };

    this.addToHashMap = function(words) {

        let key = null;
        let keyChar = null;
        let wordMap = null;
        let newMap = null;
        let nowMap = null;
        for (let i = 0; i < words.length; ++i) {
            nowMap = this.maps;
            key = words[i];
            for (let j = 0; j < key.length; ++j) {
                keyChar = key[j];
                wordMap = nowMap[keyChar];

                if (wordMap) {
                    nowMap = wordMap;
                } else {
                    newMap = {};
                    newMap.isEnd = 0;
                    nowMap[keyChar] = newMap;
                    nowMap = newMap;
                }
                if (j === key.length - 1) {
                    nowMap.isEnd = 1;
                }
            }
        }
    };

}

module.exports = dfa;