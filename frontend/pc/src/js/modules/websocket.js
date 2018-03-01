var stompClient = null;
var timer = null;
var config = {};

var stompFailureCallback = function (error) {
    console.log('STOMP: ' + error);
    timer = setTimeout(connect, 5000);
    console.log('STOMP: Reconecting in 5 seconds');
};


function connect(options) {
    $.extend(config, options);
    if(config.privateChat){
        config.prefix = 'chat';
    }else{
        config.prefix = 'merchant';
    }
    if(!'WebSocket' in window){
        App.showInfo('WebSocket 不支持',false);
        return;
    }
    var socket = new SockJS(Global.WS_BASE + '/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/wsSend/${config.prefix}_${config.chatId}`, function (res) {
            // console.log('res', res)
            res.body && config.callback && config.callback(JSON.parse(res.body));
        });
        //发送一条空信息表示可以开始接受请求
        stompClient.send(`/ws/${config.prefix}_${config.chatId}`, {}, "");
    },stompFailureCallback);
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    clearTimeout(timer);
    console.log("Disconnected");
}

export default {
    connect: connect,
    disconnect: disconnect
}