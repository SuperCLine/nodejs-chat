const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:8090');

ws.on('open', function open() {
    console.log('connected');
    // ws.send(Date.now());
    // heartbeat();

    var data = { cmd: '/sayHello', nickname: 'cline', defaultChannel: 'world', channelPwd: 'hello world' };
    var jsonData = JSON.stringify(data);
    ws.send(jsonData);


    // var data1 = { cmd: '/chat', channel: 'world', data: 'xxxhello world test!' };
    var data1 = { cmd: '/chat', channel: 'world', data: 'finish game work!' };
    var jsonData1 = JSON.stringify(data1);
    ws.send(jsonData1);

});

ws.on('close', function close() {
    console.log('disconnected');
    clearTimeout(this.pingTimeout);
});

ws.on('ping', function ping() {
    console.log('ping');
    heartbeat();
});

ws.on('message', function incoming(data) {
    // console.log(`Roundtrip time: ${Date.now() - data} ms`);

    // setTimeout(function timeout() {
    //     // ws.send(Date.now());
    //     var data = { cmd: '/sayHello', defaultChannel: 'world', channelPwd: 'hello world' };
    //     var jsonData = JSON.stringify(data);
    //     ws.send(jsonData);
    // }, 500);

    console.log(data);

    // var msg = JSON.parse(data);

    // var data2 = { cmd: '/stats', id: msg.id };
    // var jsonData2 = JSON.stringify(data2);
    // ws.send(jsonData2);


});

function heartbeat() {
    clearTimeout(this.pingTimeout);
    console.log("heartbeat")

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
        console.log("terminate");
        ws.terminate();
    }, 1000);
}