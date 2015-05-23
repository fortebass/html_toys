function CountDownTimerController(tModel, tBoard){
    this.timerModel = tModel;
    this.timerCountDownBoard = tBoard;
    this.endingInterval = null;
    this.alreadyTimesUp = false;
    this.currentTime = 0;
    this.previosTime = 0;
    this.isCounDowning = false;
}
CountDownTimerController.prototype = {
    countTimePass : function(){
        if(this.isCounDowning){
            this.currentTime = new Date().getTime();
            if(this.currentTime - this.previosTime >= 1000){
                this.previosTime = this.currentTime;
                this.tickTock();
            }
        }
    },
    start : function() {
        if(this.timerModel.isAlertRing()){
            this.alertRing();//change color
        }
        this.timerCountDownBoard.sceneIn();
        this.timerCountDownBoard.initial();
        this.timerCountDownBoard.state = "start";
        this.previosTime = new Date().getTime();
        this.isCounDowning = true;
    },
    alertRing : function() {
        var colors = this.timerModel.currentColors;
        this.timerCountDownBoard.bgColor   = {flash:colors.font, color:colors.bg};
        this.timerCountDownBoard.fontColor = {flash:colors.bg, color:colors.font};
        if(this.timerModel.currentBellOn)
            this.timerCountDownBoard.ringingBell();
    },
    lastOneMinutePlay : function() { // lastOneMinute setInterval 500 flash
        this.timerCountDownBoard.flash();
        var that = this;
        setTimeout(function (){ that.timerCountDownBoard.flash(); },250);
    },
    endingPlay : function() { // ending setInterval 250 flash
        var colors = this.timerModel.currentColors;
        this.timerCountDownBoard.bgColor   = {flash:colors.font, color:colors.bg};
        this.timerCountDownBoard.fontColor = {flash:colors.bg, color:colors.font};
        var timerCountDownBoardFlashFunction = (function(that){
            return function (){ that.timerCountDownBoard.flashFontAndBG(); };
        })(this);
        this.endingInterval = setInterval(timerCountDownBoardFlashFunction,250);
    },
    tickTock : function() {
        var time = this.timerModel.countDown();

        if(this.timerModel.isAlertRing()){
            this.alertRing();//change color
        }

        if(this.timerModel.isTimesUp()){
            if(!this.alreadyTimesUp){
                this.alreadyTimesUp = true;
                this.timerCountDownBoard.enddingAction();
                this.endingPlay();
            }
            this.timerCountDownBoard.ringingBell();
        }
        else if(this.timerModel.islastOneMinute()){
            this.lastOneMinutePlay();
        }
    },
    resume : function() {
        if(this.timerModel.isAlertRing()){
            this.alertRing();//change color
        }
        this.previosTime = new Date().getTime();
        this.isCounDowning = true;
        this.timerCountDownBoard.state = "resume";
    },
    suspend : function() {
        var colors = this.timerModel.currentColors;
        this.isCounDowning = false;
        this.timerCountDownBoard.state = "suspend";
    },
    stop : function() {
        this.isCounDowning = false;

        if(this.endingInterval){
            clearTimeout(this.endingInterval);
            this.endingInterval = null;
        }
        this.timerCountDownBoard.sceneOut();
        this.timerCountDownBoard.state = "stop";
    }
};