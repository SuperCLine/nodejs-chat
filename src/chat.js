var HashMap = require('hashmap');
var uuid = require("uuid")
var channel = require("./channel")
var util = require("./util")
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8090 });

var chat = {

    sessions: new HashMap(),
    channels: new HashMap(),
    handlers: new HashMap(),

    run: function() {

        chat.addChannel('world', 'hello world');

        chat.handlers.set('/sayHello', chat.OnSayHello);
        chat.handlers.set('/joinChannel', chat.OnJoinChannel);
        chat.handlers.set('/leaveChannel', chat.OnLeaveChannel);
        chat.handlers.set('/chat', chat.OnChat);
        chat.handlers.set('/popular', chat.OnPopular);
        chat.handlers.set('/stats', chat.OnStats);

        wss.on('connection', function(ws) {

            ws.on('message', function(msg) {

                chat.dispatch(ws, msg)
            });

            ws.on('close', function() {
                console.log("close");
                chat.removeSession(ws)
            });

            ws.on('pong', function() {
                console.log("pong");
            });

            ws.on('error', function(err) {
                console.log(`message: ${err}`);
            });
        });

        console.log("chat server is running ... ");
    },

    addSession: function(ws, name) {

        var session = { socket: ws, id: chat.autoId(), nickname: name, time: Date.now() };
        chat.sessions.set(session.socket, session);

        // console.log(session);

        return session;
    },

    removeSession: function(ws) {

        chat.sessions.remove(ws);
    },

    addChannel: function(name, pwd) {

        var ch = new channel();
        ch.init(name, pwd);

        chat.channels.set(ch.name, ch);

        return ch;
    },

    removeChannel: function(name) {

        chat.channels.remove(ch.name);
    },

    joinChannel: function(session, name, pwd) {

        var ch = chat.channels.get(name);
        if (ch != undefined && ch != null) {

            ch.join(session, pwd);
        }

        return ch;
    },

    leaveChannel: function(name) {

        var ch = chat.channels.get(name);
        if (ch != undefined && ch != null) {

            ch.leave(session);
        }
    },

    autoId: function() {
        return uuid.v1()
    },

    OnSayHello: function(ws, msg) {

        var session = chat.addSession(ws, msg.nickname);
        var ch = chat.joinChannel(session, msg.defaultChannel, msg.channelPwd);

        ch.sendHello(session);
    },

    OnJoinChannel: function(ws, msg) {

    },

    OnLeaveChannel: function(ws, msg) {

    },

    OnChat: function(ws, msg) {

        var ch = chat.channels.get(msg.channel);
        if (ch == undefined || ch == null) {
            return
        }

        var session = chat.sessions.get(ws);
        if (session == undefined || session == null) {
            return
        }

        var c = { nickname: session.nickname, data: msg.data };
        ch.broadcast(session, c);
    },

    OnPopular: function(ws, msg) {

        var ch = chat.channels.get(msg.channel);
        if (ch == undefined || ch == null) {
            return
        }

        var session = chat.sessions.get(ws);
        if (session == undefined || session == null) {
            return
        }

        ch.sendPopular(session);
    },

    OnStats: function(ws, msg) {

        chat.sessions.forEach((session) => {
            if (msg.id === session.id || msg.nickname === session.nickname) {

                var jsonTime = { cmd: '/stats', time: util.formatTime(Date.now() - session.time) };
                ws.send(JSON.stringify(jsonTime));
            }
        })
    },

    dispatch: function(ws, msg) {

        var jsonMsg = null
        try {
            jsonMsg = JSON.parse(msg)

            if (jsonMsg == null || jsonMsg == undefined || jsonMsg == '') {
                return
            }

            if (jsonMsg.cmd.indexOf('/') != 0) {
                return
            }
        } catch (e) {
            console.log(e)
        }

        // console.log(jsonMsg);
        var cmdHandler = chat.handlers.get(jsonMsg.cmd);
        if (cmdHandler != undefined && cmdHandler != null) {
            cmdHandler(ws, jsonMsg);
        } else {
            console.log("handler not implement.");
        }
    }
}

module.exports = chat;