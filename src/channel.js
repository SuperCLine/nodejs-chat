var HashMap = require('hashmap');
var LinkedList = require('singly-linked-list');

const filter = require("./filter");
const util = require("./util");

var channel = function() {

    this.max = 50;
    this.mask = "*";
    this.messages = new LinkedList();
    this.sessions = new HashMap();

    this.init = function(name, pwd) {

        this.name = name;
        this.pwd = pwd;

        util.readFile(__dirname + "/../data/list.txt", (words) => {
            // console.log(words);
            filter.addWords(words);
            // filter.addWord("xxx");
            // console.log(filter)
        });
    };

    this.join = function(session, pwd) {

        if (this.pwd === pwd) {
            this.sessions.set(session.socket, session);
            return true;
        }

        return false;
    };

    this.leave = function(session) {

        this.sessions.remove(session.socket);
    };

    this.broadcast = function(session, msg) {

        if (filter.containsDfa(msg.data)) {
            console.log(msg.data);
            msg.data = filter.replaceDfa(msg.data, "*", false);
        }

        var jsonMsg = JSON.stringify(msg);
        var timeMsg = { time: Date.now(), message: jsonMsg };
        this.messages.insertFirst(timeMsg);

        if (this.messages.getSize() > this.max) {
            this.messages.remove();
        }

        this.sessions.forEach((session) => {
            session.socket.send(jsonMsg);
        });
    };

    this.sendHello = function(session) {

        var msgs = new Array;
        this.messages.forEach((m) => {
            msgs.push(m.message);
        });

        var jsonHello = { id: session.id, data: msgs.toString() };
        session.socket.send(JSON.stringify(jsonHello));
    };

    this.sendPopular = function(session) {

        var msgs = new Array;
        this.messages.forEach((m) => {

            var t = Date.now() - m.time
            if (t >= 5) {

                msgs.push(JSON.parse(m.message));
            }
        });

        var countMap = {}
        msgs.forEach((m) => {
            m.data.split(" ").map(function(val) {
                if (val === undefined || val === null) {
                    countMap[val] = 0
                } else {
                    countMap[val] += 1
                }
            });
        });

        // TODO: 
    };
}

module.exports = channel;