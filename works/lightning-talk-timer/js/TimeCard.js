function TimeCard(t, color){
    this.color = { font:color.font, bg:color.bg };
    this.font = { min:110, sec:40, name:"Locator" };
    this.time = { min:t.min ,sec:t.sec, ringOn:t.ringOn };
    this.ring = new Image();
    this.ring.src = (color.font === "black")?'file/ring1.png':'file/ring2.png';
    this.region = { x:0, y:0, w:0, h:0 };
    this.cardBound = { upper:null, lower:null };
    this.isStart = false;
    this.isEnd = false;
    var amp = 5;
    this.shack = {
        isShacking:false,
        times:0,
        param:[
            {x:-amp, y:-amp},
            {x:amp, y:amp},
            {x:amp, y:amp},
            {x:-amp, y:-amp},
            {x:-amp, y:amp},
            {x:amp, y:-amp},
            {x:amp, y:-amp},
            {x:-amp, y:amp}
        ]
    };

    this.cacheSize = {};
}
TimeCard.prototype = {
    setRegion : function(reg){
        this.region = reg;
        this.cacheSize = {
            triangle : this.region.w/15,
            halfH : this.region.h/2,
            halfW : this.region.w/2,
            fontYH : this.region.h/3+30,
            twoDByThreeH : this.region.h*2/3
        };
    },
    moveTo : function(dX, dY){
        this.region.x = dX;
        this.region.y = dY;
    },
    isInRegion : function(dX, dY){
        var reg = this.region;
        if(reg.x < dX && dX < reg.x+reg.w && 
           reg.y < dY && dY < reg.y+reg.h){
            if(reg.x+reg.w/2-27< dX && dX < reg.x+reg.w/2+27 && 
               reg.y+reg.h*2/3 < dY && dY < reg.y+reg.h*2/3+50)
                this.time.ringOn = !this.time.ringOn;

            return true;        
        }
        return false;
    },
    addLowerBoundTimeCard : function(newLowerBoundCard){
        var lowerBoundCard = this.cardBound.lower;
        
        newLowerBoundCard.time = {
            min    : this.time.min,
            sec    : this.time.sec,
            ringOn : true
        };

        this.cardBound.lower = newLowerBoundCard;
        newLowerBoundCard.cardBound.upper = this;
        newLowerBoundCard.cardBound.lower = lowerBoundCard;

        var subTime;
        if(lowerBoundCard){
            subTime = Utility.subtractTime(this.time, lowerBoundCard.time);
            lowerBoundCard.cardBound.upper = newLowerBoundCard;
        }
        else{
            subTime = Utility.subtractTime(this.time, {min:0, sec:0});
            newLowerBoundCard.isEnd = true;
            this.isEnd = false;
        }

        if(subTime.min * 60 + subTime.sec <= 15){
            var currentTimeCard = this, upperTimeCard = this.cardBound.upper;
            if(currentTimeCard.isStart)
                currentTimeCard.incrementTime(1, 0);
            else    
                currentTimeCard.incrementTime(0, 15);

            while(upperTimeCard){
                var subUpperTime = Utility.subtractTime(upperTimeCard.time, currentTimeCard.time);
                if(subUpperTime.min * 60 + subUpperTime.sec < 15){
                    if(upperTimeCard.isStart)
                        upperTimeCard.incrementTime(1, 0);
                    else
                        upperTimeCard.incrementTime(0, 15);
                    currentTimeCard = upperTimeCard;
                    upperTimeCard = upperTimeCard.cardBound.upper;
                }
                else 
                    break;
            }
        }
        else{
            newLowerBoundCard.incrementTime(0, -15);
        }

    },
    removeLowerBoundTimeCard : function(){
        var lowerBoundCard = this.cardBound.lower;
        if(lowerBoundCard){
            var nextLowerBoundTimeCard = lowerBoundCard.cardBound.lower;
            if(nextLowerBoundTimeCard){
                this.cardBound.lower = nextLowerBoundTimeCard;
                nextLowerBoundTimeCard.cardBound.upper = this;
            }
            else{
                this.cardBound.lower = null;
                this.isEnd = true;
            }
        }
    },
    adjustmentTime : function(dMin, dSec){
        var timeCheck = {min:this.time.min + dMin, sec:this.time.sec + dSec},
            timeUpper = this.cardBound.upper ? this.cardBound.upper.time : null,
            timeLower = this.cardBound.lower ? this.cardBound.lower.time : null;

        if(timeUpper){
            if(Utility.compareTime(timeUpper, timeCheck) <= 0){
                this.cardBound.upper.setShack(true);
                return false;
            }
        }
        else{
            if(Utility.compareTime({min:100, sec:0}, timeCheck) <= 0){
                this.setShack(true);
                return false;
            }
        }

        if(timeLower) {
            if(Utility.compareTime(timeCheck, timeLower) <= 0){
                this.cardBound.lower.setShack(true);
                return false;
            }
        }
        else{
            if(Utility.compareTime(timeCheck, {min:0, sec:0}) <= 0){
                this.setShack(true);
                console.log("0:0, timeCheck:"+timeCheck.min+":"+timeCheck.sec);
                return false;
            }
        }

        this.incrementTime(dMin, dSec);
        return true;
    },
    incrementTime : function(dMin, dSec) {
        this.time.sec += dSec;
        if(this.time.sec >= 60){
            this.time.min ++;
            this.time.sec %= 60; 
        }
        else if(this.time.sec < 0){
            this.time.min --;
            this.time.sec = 60;
            this.time.sec += dSec;
        }
        this.time.min += dMin;
    },
    getAlertTime : function() {
        return {
            time : { min:this.time.min, sec:this.time.sec, ringOn:this.time.ringOn },
            color : { font:this.color.font, bg:this.color.bg }
        };
    },
    setShack : function(shacking) {
        this.shack.isShacking = shacking;
    },
    shakeAction : function(){
        if(this.shack.isShacking){
            if(this.shack.times < this.shack.param.length){
                var point = this.shack.param[this.shack.times];
                this.region.x += point.x;
                this.region.y += point.y;
                this.shack.times++;
            }
            else{
                this.shack.isShacking = false;
                this.shack.times = 0;
            }
        }
    },
    draw : function(ctx) {
        this.shakeAction();
        
        var drawContext = ctx,
            reg = this.region,
            rightX = reg.x+reg.w,
            bottomY = reg.y+reg.h,
            triangleW = this.cacheSize.triangle,
            timY = reg.y+this.cacheSize.halfH,
            fontY = reg.y+this.cacheSize.fontYH;

        drawContext.shadowColor = "rgba(0,0,0,0.15)";
        drawContext.shadowBlur = 20;
        drawContext.fillStyle = this.color.bg; // Fill
        drawContext.beginPath();
        drawContext.moveTo(reg.x+10, reg.y);
        drawContext.arcTo(rightX, reg.y, rightX, reg.y+10, 5);
        drawContext.lineTo(rightX, reg.y+10);
        drawContext.lineTo(rightX, timY-triangleW*1.5);
        drawContext.lineTo(rightX+triangleW, timY);
        drawContext.lineTo(rightX, timY+triangleW*1.5);
        drawContext.arcTo(rightX, bottomY, rightX-10, bottomY, 5);
        drawContext.lineTo(rightX-10, bottomY);
        drawContext.arcTo(reg.x, bottomY, reg.x, bottomY-10, 5);
        drawContext.lineTo(reg.x, bottomY-10);
        drawContext.arcTo(reg.x, reg.y, reg.x+10, reg.y, 5);
        drawContext.closePath();
        drawContext.fill();

        drawContext.shadowOffsetX = 0;
        drawContext.shadowOffsetY = 0;
        drawContext.shadowColor = "rgba(0,0,0,0)";
        drawContext.shadowBlur = 0;
        drawContext.fillStyle = this.color.font; // Fill
        // draw min
        drawContext.font = "bold "+this.font.min+"pt "+this.font.name;
        drawContext.textAlign = "center";
        drawContext.fillText(this.time.min, reg.x+this.cacheSize.halfW, fontY); 
        
        if(this.time.sec !== 0){
            drawContext.font = ""+this.font.sec+"pt "+this.font.name;
            drawContext.fillText(":"+this.time.sec, reg.x+this.cacheSize.halfW, fontY+60); 
        }

        if(!this.time.ringOn)
            drawContext.globalAlpha = 0.7;

        drawContext.beginPath();
        var start = {x:reg.x+this.cacheSize.halfW, y:reg.y+this.cacheSize.twoDByThreeH+15};

        drawContext.drawImage(this.ring, start.x-25, start.y, 50, 50);

        if(!this.time.ringOn){
            drawContext.lineCap = "round";// 畫筆是圓的
            drawContext.beginPath();
            drawContext.strokeStyle = this.color.font;
            drawContext.lineWidth = 8; // Make lines thick
            drawContext.moveTo(start.x+27, start.y+5);
            drawContext.lineTo(start.x-27, start.y+50);
            drawContext.stroke();
            drawContext.globalAlpha = 1;
        }
    },

};