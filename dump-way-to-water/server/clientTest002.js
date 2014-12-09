var WebSocket = require('ws')
  , websocket = new WebSocket('ws://192.168.33.5:8005');
websocket.on('open', function() {
    var play = {
            state: "login",//"restart","playing","fail","succeed"
            player:{
                playing:0,
                id:"002",
                takeTool:"tool02",
                toolPosX:10,
                toolPosY:10
            },
            level:1
        }
    websocket.send(JSON.stringify(play));
});
websocket.on('message', function(message) {
    console.log('received: %s', message);
});
websocket.on('close', function(message) {
    console.log('close : received: %s', message);
});
websocket.on('error', function(message) {
    console.log('error : received: %s', message);
});