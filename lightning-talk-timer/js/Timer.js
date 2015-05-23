var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),//settingContext
    offsetX = canvas.offsetLeft,
    offsetY = canvas.offsetTop,
    cw = 1800, ch = 890, scaleX = 1, scaleY = 1,
    animationUpdateHandle,
    dragSensor = {
        startPosition:{ x:0, y:0},
        delayRegion : 3,
    };

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB,
    db, request;

var countDownModel = new CountDownTimerModel();
var countDownBoard = new CountDownBoard(cw, ch, countDownModel);
var timerSettingBoard = new TimerSettingBoard(cw, ch, countDownModel, countDownBoard.timerController);
var isCountDownPlaying = false;

function initialize() {
    resize();

    request = indexedDB.open("CountDownTimeDB", 1);// Version 1.0
    request.onsuccess = function (e) {
        // countDownModel.dataBase = request.result;
        countDownModel.dataBase = e.target.result;
        timerSettingBoard.initialize();
    }; 
    request.onerror = function (e) {
        console.log("IndexedDB error: " + e.target.errorCode);
    };
    request.onupgradeneeded = function (e) {
        var objectStore = e.currentTarget.result.createObjectStore("timerSettings", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("data", "data", { unique: false });// store string

        objectStore.add({data:[{time:{min:1,sec:0,ringOn:true},color:{font:"black",bg:"white"}}]});
    };

    countDownBoard.ringing = document.getElementsByTagName("audio")[0];
}

function resize() {
    scaleX = window.innerWidth*0.98 / cw;
    scaleY = window.innerHeight*0.95 / ch;

    canvas.width = cw * scaleX;
    canvas.height = ch * scaleY;

    context.scale(scaleX, scaleY);
    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;
}

function getRealX(x) {
    return x / scaleX - offsetX;
}

function getRealY(y) {
    return y / scaleY -offsetY;
}

function update(){
    if(isCountDownPlaying){
        context.clearRect(0, 0, cw, ch);
        // timerSettingBoard.hoverAction();
        timerSettingBoard.draw(context);
        countDownBoard.draw(context);
        isCountDownPlaying = !countDownBoard.isStopCountDown();
    }
    else{
        context.clearRect(0, 0, cw, ch);
        timerSettingBoard.hoverAction();
        timerSettingBoard.draw(context);
    }
    
    animationUpdateHandle = window.requestAnimationFrame(update);
}

window.addEventListener('resize', function (e) {
    resize();
});

canvas.addEventListener('mousedown', function (e) {
    var realX = getRealX(e.clientX),
        realY = getRealY(e.clientY);

    if(isCountDownPlaying){
        countDownBoard.touchButton(realX, realY);
    }
    else{
        timerSettingBoard.selectCard(realX, realY);
        isCountDownPlaying = timerSettingBoard.countDownCilck(realX, realY);
    }
}, false);
canvas.addEventListener('mousemove', function (e) {
    var realX = getRealX(e.clientX),
        realY = getRealY(e.clientY);
    timerSettingBoard.dragCard(realX, realY);
}, false);
canvas.addEventListener('mouseup', function (e) {
    timerSettingBoard.releaseCard();
}, false);

canvas.addEventListener('mouseout', function (e) {
    timerSettingBoard.releaseCard();
}, false);


////////////////////////////////////////////////////////////////////////

initialize();
update();
