var atest = require("ava")
const filter = require("../src/filter");
const util = require("../src/util");

var testCase = {

    start: function() {

        util.readFile(__dirname + "/../data/list.txt", (words) => {
            filter.addWords(words);
        });

        atest('filter test', t => {

            t.is(filter.replaceDfa("xxx good", "*", false), "*** good");
            t.is(filter.replaceDfa("hello world!", "*", false), "***o world!");
            t.is(filter.replaceDfa("finish game work!", "*", false), "finish game work!");
        });
    },
}

testCase.start();