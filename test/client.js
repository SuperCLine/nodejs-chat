const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:8090');
const inquirer = require('inquirer');

var clientID = 0

ws.on('open', function open() {
    console.log('connected');
});

ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('ping', function ping() {
    console.log('ping');
});

ws.on('message', function incoming(msg) {

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

    // console.log(jsonMsg)

    switch (jsonMsg.cmd) {
        case '/sayHello':
            {
                clientID = jsonMsg.id
                console.log("client id: " + clientID)
                console.log(jsonMsg.data)
                for (let i = 0; i < jsonMsg.data.length; ++i) {
                    console.log(jsonMsg.data[i])
                }
                // console.log("Enter chat message:")
            }
            break;
        case '/chat':
            {
                console.log(jsonMsg.data)
            }
            break;
        case '/stats':
            {
                console.log(jsonMsg.time)
            }
            break;
        default:
            console.log("default" + jsonMsg)
            break;
    }
});

const run = async() => {
    const { name } = await askName();

    var data = { cmd: '/sayHello', nickname: name, defaultChannel: 'world', channelPwd: 'hello world' };
    var jsonData = JSON.stringify(data);
    ws.send(jsonData);

    while (true) {
        const answers = await askChat();
        const { message } = answers;

        console.log(message)
        var arr = message.split(" ");
        try {
            if (arr[0].indexOf('/') === 0) {
                switch (arr[0]) {
                    case '/chat':
                        {
                            var ms = message.substr(arr[0].length + 1, message.length)
                                // console.log("-----" + ms)
                            var data1 = { cmd: '/chat', channel: 'world', data: ms };
                            var jsonData1 = JSON.stringify(data1);
                            ws.send(jsonData1);
                        }
                        break;
                    case '/popular':
                        break
                    case '/stats':
                        {
                            var ms = message.substr(arr[0].length + 1, message.length)
                            var data2 = { cmd: '/stats', id: 0, nickname: ms };
                            var jsonData2 = JSON.stringify(data2);
                            ws.send(jsonData2);
                        }
                        break
                    default:
                        break;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
};

const askChat = () => {
    const questions = [{
        name: "message",
        type: "input",
        message: "Enter chat message:"
    }];
    return inquirer.prompt(questions);
};

const askName = () => {
    const questions = [{
        name: "name",
        type: "input",
        message: "Enter your name:"
    }];
    return inquirer.prompt(questions);
};

run()