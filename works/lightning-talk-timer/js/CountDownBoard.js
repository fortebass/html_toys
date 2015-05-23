function CountDownBoard(cw, ch, tModel){
    var countDownResumeButton, countDownSuspendButton, countDownStopButton;
    this.fontSize = 800;
    this.translate = { dis:0, end:0, delta:0, dir:0 };
    this.translateRestore = false;
    this.timerModel = tModel;
    this.timerController = new CountDownTimerController(tModel, this);
    this.ringing = null;
    this.width = cw;
    this.height = ch;

    //suspend, stop, resume, start
    countDownResumeButton = new ControlComponent("resume", this.timerController);
    countDownResumeButton.setRegion({ x:cw+41, y:40, r:40 });
    countDownResumeButton.animation.initial = function(){ this.alpha = 1; };
    countDownResumeButton.animation.display = function(){ this.region.x = cw-41; };
    countDownResumeButton.animation.hidden  = function(){ this.region.x = cw+41; };
    countDownResumeButton.drawCutShape = function(ctx){
        var x = -13, y = -20, tri = 35, h = 40;
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.moveTo(this.region.x+x    , this.region.y+y);
        ctx.lineTo(this.region.x+x+tri, this.region.y+y+h/2);
        ctx.lineTo(this.region.x+x    , this.region.y+y+h);
        ctx.closePath();
        ctx.fill();
    };
    
    countDownSuspendButton = new ControlComponent("suspend", this.timerController);
    countDownSuspendButton.setRegion({ x:cw-41, y:40, r:40 });
    countDownSuspendButton.animation.initial = function(){ this.alpha = 1; };
    countDownSuspendButton.animation.display = function(){ this.region.x = cw-41; this.alpha = (this.alpha < 0.1) ? this.alpha-0.02 : 0.1; };
    countDownSuspendButton.animation.hidden  = function(){ this.region.x = cw+41; };
    countDownSuspendButton.drawCutShape = function(ctx){
        var x1 = -15, y1 = -20, w1 = 10, h1 = 40,
            x2 = 5  , y2 = -20, w2 = 10, h2 = 40;
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.moveTo(this.region.x+x1   , this.region.y+y1);
        ctx.lineTo(this.region.x+x1+w1, this.region.y+y1);
        ctx.lineTo(this.region.x+x1+w1, this.region.y+y1+h1);
        ctx.lineTo(this.region.x+x1   , this.region.y+y1+h1);
        ctx.closePath();

        ctx.moveTo(this.region.x+x2   , this.region.y+y2);
        ctx.lineTo(this.region.x+x2+w2, this.region.y+y2);
        ctx.lineTo(this.region.x+x2+w2, this.region.y+y2+h2);
        ctx.lineTo(this.region.x+x2   , this.region.y+y2+h2);
        ctx.closePath();
        ctx.fill();
    };

    countDownStopButton = new ControlComponent("stop", this.timerController);
    countDownStopButton.setRegion({ x:-40, y:40, r:40 });
    countDownStopButton.animation.initial = function(){ };
    countDownStopButton.animation.display = function(){ this.region.x = (this.region.x < 40) ? this.region.x+15 : 40; };
    countDownStopButton.animation.hidden  = function(){ this.region.x = (this.region.x > -40) ? this.region.x-15 : -40; };
    countDownStopButton.drawCutShape = function(ctx){
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.moveTo(this.region.x-18   , this.region.y-18);
        ctx.lineTo(this.region.x+17, this.region.y-18);
        ctx.lineTo(this.region.x+17, this.region.y+17);
        ctx.lineTo(this.region.x-18   , this.region.y+17);
        ctx.closePath();
        ctx.fill();
    };

    this.controller = {
        display : ["suspend"],
        hidden  : ["resume","stop"],

        resume  : countDownResumeButton,
        suspend : countDownSuspendButton,
        stop    : countDownStopButton
    };
    this.bgColor = {flash:"black",color:"white"};
    this.fontColor = {flash:"white",color:"black"};
    this.state = ""; 
}
CountDownBoard.prototype = {
    draw : function(ctx) {
        if(this.translate.dis < this.height){
            this.timerController.countTimePass();

            this.translateAnim(ctx);
            this.drawCountDownTimer(ctx);
            this.translateRestoreAnim(ctx);
        }
    },
    drawCountDownTimer : function(ctx){
        var restTime = this.timerModel.getRestTime(),
            fontSize = this.fontSize;
            fontPosition = {x:this.width/2, y:(this.height+fontSize)/2};

        ////////fill white bg/////////
        ctx.beginPath();
        ctx.fillStyle = this.bgColor.color;
        ctx.rect(0, 0, this.width, this.height);
        ctx.fill();

        ////////draw control component/////////
        this.controller.stop.draw(ctx);
        this.controller.suspend.draw(ctx);
        this.controller.resume.draw(ctx);
        ////////show time/////////
        ctx.fillStyle = this.fontColor.color;
        ctx.font = "bold "+fontSize+"pt Locator";
        ctx.textAlign = "center";
        if(restTime.min>0){
            ctx.fillText(restTime.min, fontPosition.x, fontPosition.y-50);

            ctx.font = "bold "+fontSize/7+"pt Locator";
            ctx.textAlign = "center";
            ctx.fillText(restTime.sec, this.width-fontSize/7, this.height-fontSize/28);
        }
        else{
            ctx.fillText(restTime.sec, fontPosition.x, fontPosition.y-50);
        }
    },
    touchButton :function(cX, cY){
        var ctrlComponent, isTouchAnyOne = false;
        for(var ctrl in this.controller.display){
            ctrlComponent =  this.controller[this.controller.display[ctrl]];
            if(ctrlComponent.isInRegion(cX, cY)){
                isTouchAnyOne = true;
                ctrlComponent.triggerAction();
                break;
            }
        }
        if(isTouchAnyOne && ctrlComponent.style !== "stop"){
            for(var ctrl in this.controller.display){
                this.controller[this.controller.display[ctrl]].playHiddenAnim();
            }
            for(var ctrl in this.controller.hidden){
                this.controller[this.controller.hidden[ctrl]].playDisplayAnim();
            }
            Utility.swap(this.controller,["display", "hidden"]);
        }
    },
    initial : function (){
        if(this.state === "stop"){
            for(var ctrl in this.controller.display){
                this.controller[this.controller.display[ctrl]].playHiddenAnim();
            }
            for(var ctrl in this.controller.hidden){
                this.controller[this.controller.hidden[ctrl]].playDisplayAnim();
            }
        }
        this.controller.display = ["suspend"];
        this.controller.hidden  = ["resume","stop"];
    },
    isStopCountDown : function() {
        return this.state === "stop" && this.translate.dis == this.translate.end;
    },
    ringingBell : function(){
        if(this.ringing)
            this.ringing.play();
    },
    ringingEndingBell : function(){
        if(this.ringing){
            this.ringing.pause();
            this.ringing.loop = true;
            this.ringing.play();
        }
    },
    flash : function() {
        Utility.swap(this.fontColor,["color","flash"]);
    },
    flashFontAndBG : function() {
        Utility.swap(this.bgColor,["color","flash"]);
        Utility.swap(this.fontColor,["color","flash"]);
    },
    enddingAction : function() {
        Utility.swap(this.controller,["display", "hidden"]);
        this.controller.stop.playDisplayAnim();
        this.controller.suspend.playHiddenAnim();
        this.controller.resume.playHiddenAnim();
    },
    sceneOut : function(){
        this.color = {font:"rgba(0, 0, 0, 0.1)",bg:"white",flashFont:"rgba(0, 0, 0, 0.1)"};
        this.translate = { dis:0, end:this.height, delta:100, dir:+1 };

        for(var ctrl in this.controller.display){
            this.controller[this.controller.display[ctrl]].enable = false;
        }
        for(var ctrl in this.controller.hidden){
            this.controller[this.controller.hidden[ctrl]].enable = false;
        }
    },
    translateAnim : function(ctx) {
        if(this.translate.dis == this.translate.end){
            this.translateRestore = false;
            return;
        }
        this.translateRestore = true;

        var move = this.translate.delta*this.translate.dir,
            disTest = this.translate.dis + move;
        if(this.translate.dir*(disTest-this.translate.end)<0) {
            this.translate.dis = disTest;
        }
        else{
            this.translate.dis = this.translate.end;
        }

        ctx.translate(0, this.translate.dis);  
    },
    translateRestoreAnim : function(ctx) {
        if(this.translateRestore)
            ctx.translate(0, -1*this.translate.dis);
    },
    sceneIn : function(){
        this.translate = { dis:this.height-0.5, end:0, delta:100, dir:-1 };
        for(var ctrl in this.controller.display){
            this.controller[this.controller.display[ctrl]].enable = true;
        }
        for(var ctrl in this.controller.hidden){
            this.controller[this.controller.hidden[ctrl]].enable = true;
        }
    },
};