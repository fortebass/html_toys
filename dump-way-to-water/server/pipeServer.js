var WebSocketServer = require('ws').Server, 
    ws = new WebSocketServer({port: 8005}),
    cache = {
        gameState:"wating",//"wating","restart","playing","fail","succeed"
        playCount:0,
        players:[
        ],
        level:1
    };

ws.broadcast = function(data) {
    for (var i in this.clients) {
        this.clients[i].send(data);
    }
};

ws.on('connection', function(_ws) {
    _ws.on('message', function(message) {
        var object = JSON.parse(message);
        /*
        {
            state: "login",//"leave","restart","playing","fail","succeed"
            player:{
                playing:0,
                id:"003",
                takeTool:"tool03",
                releaseTool:"none",
                toolAngle:1,
                toolPosX:10,
                toolPosY:10
            },
            level:1
        }
        */
        updateCache(object);
        var updateMsg = JSON.stringify(cache);
        // ws.send(cache);
        ws.broadcast(updateMsg);
        // console.log(updateMsg);
    });

    // _ws.on('close', function() {
    //     cache.playCount = cache.players.length;
    // });

    cache.playCount ++;
    ws.broadcast(JSON.stringify(cache));
});

function isPlayerRegister (registPlayer) {
    for (var i = cache.players.length - 1; i >= 0; i--) {
        if(cache.players[i].id == registPlayer.id)
            return true;
    };
    return false;
}

var addPlayer = false;
function updateCache(obj){
    if(obj.state == "login"){
        cache.gameState = "wating";
        if (!isPlayerRegister(obj.player)) {
            cache.players.push(obj.player);
        }
    }
    else if(obj.state == "restart"){
        cache.gameState = "restart";
    }
    else if(obj.state == "succeed"){
        cache.gameState = "succeed";
    }
    else if(obj.state == "fail"){
        cache.gameState = "fail";
    }
    else if(obj.state == "playing"){
        cache.gameState = "playing";
        cache.level = obj.level;
    }
    else if(obj.state == "leave"){
        for (var i = cache.players.length - 1; i >= 0; i--)
            if(cache.players[i].id == obj.player.id){
                cache.players.splice(i, 1);
                return;
            }
    }

    addPlayer = true;
    for (var i = cache.players.length - 1; i >= 0; i--) {
        if(cache.players[i].id == obj.player.id){
            cache.players[i] = obj.player;
            addPlayer = false;
        }
    }
    if(addPlayer){
        cache.players.push(obj.player);
    }
}