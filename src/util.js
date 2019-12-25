var fs = require('fs');
var readline = require('readline');

module.exports.readFile = function(file, callback) {

    var ss = fs.createReadStream(file);
    var line = readline.createInterface({
        input: ss
    });

    var arr = new Array();
    line.on('line', function(line) {
        arr.push(line);
    });
    line.on('close', function() {
        callback(arr);
    });
};

module.exports.formatTime = function(t) {

    var d = Math.floor(t / 86400)
    t = t - d * 86400
    var h = Math.floor(t / 3600)
    t = t - h * 3600
    var m = Math.floor(t / 60)
    t = t - m * 60

    var st = d.toString() + "d "
    if (h < 10) {
        st = st + "0"
    }
    st = st + h.toString() + "h "

    if (m < 10) {
        st = st + "0"
    }
    st = st + m.toString() + "m "

    if (t < 10) {
        st = st + "0"
    }
    st = st + t.toString() + "s"

    return st
};