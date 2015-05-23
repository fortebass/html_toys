function TimerSettingBoard(cw, ch, tModel, cdController){
    this.timerModel = tModel;
    this.countdownController = cdController;
    this.center = {x:cw/2,y:ch/2};
    this.cardColor = [{font:"black",bg:"white"},
                      {font:"white",bg:"green"},
                      {font:"white",bg:"red"},
                      {font:"black",bg:"yellow"}];

    this.itemSize = {
        card: {w:cw/9, h:ch/3},
        gap : 30,
        startBtnRadius : 40
    };

    var cardWidth = this.itemSize.card.w,
        gap = this.itemSize.gap,
        offsetX = this.center.x - ((cardWidth+gap)+40)/2,
        offsetY = this.center.y - (this.itemSize.card.h)/2,
        pos = { x:offsetX, y:offsetY, w:cardWidth, h:this.itemSize.card.h, offset: gap };

    var whiteCard, yellowCard, redCard, greenCard;
    whiteCard  = new TimeCard({min:01, sec:00, ringOn:true}, this.cardColor[0]);
    whiteCard.setRegion({ x:pos.x, y:offsetY, w:pos.w, h:pos.h });
    whiteCard.isStart = true;
    whiteCard.cardBound.upper = null;
    whiteCard.cardBound.lower = null;
    whiteCard.isEnd = true;

    yellowCard = new TimeCard({min:00, sec:45, ringOn:true},this.cardColor[3]);
    yellowCard.setRegion({ x:pos.x+(pos.w+pos.offset), y:offsetY, w:pos.w, h:pos.h });

    redCard    = new TimeCard({min:00, sec:30, ringOn:true},this.cardColor[2]);
    redCard.setRegion({ x:pos.x+(pos.w+pos.offset)*2, y:offsetY, w:pos.w, h:pos.h });

    greenCard  = new TimeCard({min:00, sec:15, ringOn:true},this.cardColor[1]);
    greenCard.setRegion({ x:pos.x+(pos.w+pos.offset)*3, y:offsetY, w:pos.w, h:pos.h });

    this.cardCollection = [];
    this.cardCollection.push({
        currentPosition : {x:whiteCard.region.x , y:whiteCard.region.y}, 
        originalPosition : {x:whiteCard.region.x , y:whiteCard.region.y}, 
        moveTimes: 0,
        card : whiteCard
    });

    this.hiddenCardCollection = [];
    this.hiddenCardCollection.push(yellowCard);
    this.hiddenCardCollection.push(redCard);
    this.hiddenCardCollection.push(greenCard);

    var btnRegion = { x:pos.x+(pos.w+pos.offset)+this.itemSize.startBtnRadius, y:offsetY+pos.h/2, r:this.itemSize.startBtnRadius };
    this.countDownStart = {
        currentPosition:{x:btnRegion.x, y:btnRegion.y},
        originalPosition:{x:btnRegion.x, y:btnRegion.y},
        moveTimes: 0,
        button:new ControlComponent("start", cdController)
    };
    this.countDownStart.button = new ControlComponent("start", cdController);
    this.countDownStart.button.setRegion(btnRegion);
    this.countDownStart.button.drawCutShape = function(ctx){
        var x = -13, y = -20, tri = 35, h = 40;
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.moveTo(this.region.x+x    , this.region.y+y);
        ctx.lineTo(this.region.x+x+tri, this.region.y+y+h/2);
        ctx.lineTo(this.region.x+x    , this.region.y+y+h);
        ctx.closePath();
        ctx.fill();
    };

    this.selectedCard = {
        index:null, 
        originalPosition:{x:0, y:0}, 
        card:null
    };
    this.direction = {
        clickPoint    : {x:0, y:0}, 
        dragPoint     : {x:0, y:0}, 
        previousPoint : {x:0, y:0}, 
        orient        : "",
        factor        : 0
    };
    this.setTimeDragDistance = whiteCard.region.h/10;
    this.hoverTime;
    this.eachTimeRemove = 0;
    this.eachTimeAdd = 0;
    this.isHoverTime = false;
    this.alignmentXAxis();
}
TimerSettingBoard.prototype = {
    initialize : function(){
        var timeCardItems, that = this;
        //get from model
        this.timerModel.loadData(function(datas){
            if(datas){
                that.setAlertTimes(datas);
                that.alignmentXAxis();   
            }
        });
    },
    setAlertTimes : function(timeCardItems){
        var length = timeCardItems.length,
            upperCard = this.cardCollection[0].card;

        upperCard.time = timeCardItems[0].time;
        upperCard.isStart = true;
        for (var i = 1; i < length; i++) {
            // find in hidden[] splice one, and push in cardCollection[]
            var hideIdx, hideLength = this.hiddenCardCollection.length;
            for (hideIdx = 0; hideIdx < hideLength; hideIdx++) {
                var hideCard = this.hiddenCardCollection[hideIdx];

                if(timeCardItems[i].color.bg === hideCard.color.bg){
                    hideCard.time = timeCardItems[i].time;
                    hideCard.region.x = upperCard.region.x;
                    hideCard.region.y = upperCard.region.y;

                    upperCard.cardBound.lower = hideCard;
                    hideCard.cardBound.upper = upperCard;
                    hideCard.cardBound.lower = null;
                    hideCard.isEnd = this.hiddenCardCollection.length == 1;

                    upperCard = hideCard;

                    this.cardCollection.push({
                        currentPosition  : {x:0 , y:0},
                        originalPosition : {x:0 , y:0},
                        moveTimes: 0,
                        card : hideCard
                    });
                    
                    this.hiddenCardCollection.splice(hideIdx, 1);
                    break;
                }
            };
        };
        
        // this.alignmentXAxis();
    },
    getAlertTimes : function(){
        var timeCardItems = [], collection = this.cardCollection, collectionLeng = collection.length;
        for (var i = 0; i < collectionLeng; i++) {
            timeCardItems.push(collection[i].card.getAlertTime());
        }
        return timeCardItems;
    },
    draw : function(ctx) {
        //draw card
        for (var i = this.cardCollection.length - 1; i >= 0; i--) {
            var cardItem = this.cardCollection[i];
            if( this.direction.orient === "" ){
                this.alignmentCardXAxis(cardItem);
                this.alignmentCardYAxis(cardItem);
            }
            cardItem.card.draw(ctx);
        }

        //draw btn
        if( this.direction.orient === "" ){
            var startBtn = this.countDownStart.button,
                startBtnOriginalPos = this.countDownStart.originalPosition,
                startBtnCurPos = this.countDownStart.currentPosition,
                startBtnMoveTimes = this.countDownStart.moveTimes++;
            if(startBtn.region.x !== startBtnOriginalPos.x){
                this.moveBackAtXAxis(startBtn, startBtnMoveTimes, startBtnCurPos.x, startBtnOriginalPos.x);
            }
        }
        this.countDownStart.button.draw(ctx);
    },
    alignmentXAxis : function(){
        var cards = this.cardCollection,
            cardsLength = cards.length,
            cardSize = this.itemSize.card,
            gap = this.itemSize.gap,
            btnWidth = this.itemSize.startBtnRadius,
            offsetX = this.center.x - ((cardSize.w+gap)*cardsLength+btnWidth)/2,
            offsetY = this.center.y - (cardSize.h)/2,
            drawPositionX = offsetX;

        for (var i = cardsLength - 1; i >= 0; i--) {
            var card = cards[i];
            card.originalPosition.x = offsetX + (cardSize.w+gap)*(i);
            card.originalPosition.y = offsetY;
            card.currentPosition.x = card.card.region.x;
            card.currentPosition.y = card.card.region.y;
            card.moveTimes = 0;
        }

        drawPositionX = offsetX+(cardSize.w+gap)*(cardsLength)+btnWidth;
        this.countDownStart.originalPosition.x = drawPositionX;
        this.countDownStart.originalPosition.y = offsetY+cardSize.h/2;
        this.countDownStart.currentPosition.x = this.countDownStart.button.region.x;
        this.countDownStart.currentPosition.y = this.countDownStart.button.region.y;
        this.countDownStart.moveTimes = 0;
    },
    //swip left 
    addTimeCard : function() {
        if(this.selectedCard.card){
            var newTimeCard, selectedTimeCard = this.selectedCard.card;
            if(this.hiddenCardCollection.length > 0){
                newTimeCard = this.hiddenCardCollection.pop();
                selectedTimeCard.addLowerBoundTimeCard(newTimeCard);

                for (var i = 0; i < this.cardCollection.length; i++) {
                    if(this.cardCollection[i].card === selectedTimeCard){
                        newTimeCard.region.x = selectedTimeCard.region.x+selectedTimeCard.region.w-40;
                        newTimeCard.region.y = selectedTimeCard.region.y;
                        this.cardCollection.splice(i+1, 0, {
                            currentPosition : {x:selectedTimeCard.region.x , y:selectedTimeCard.region.y},
                            originalPosition : {x:selectedTimeCard.region.x , y:selectedTimeCard.region.y},
                            moveTimes: 0,
                            card : newTimeCard
                        });
                        break;
                    }
                };
                this.eachTimeAdd++;
                this.eachTimeRemove = (this.eachTimeRemove == 0) ? 0 : this.eachTimeRemove-1;
            }
        }
    },
    //swip right
    removeTimeCard : function() {
        if(this.selectedCard.card){
            var currentCard = this.selectedCard.card,
                removeCard = currentCard.cardBound.lower;
    
            if(currentCard.cardBound.lower){
                currentCard.removeLowerBoundTimeCard();
                
                // add to hidden array
                this.hiddenCardCollection.push(removeCard);
                for (var i = 0; i < this.cardCollection.length; i++) {
                    if(this.cardCollection[i].card === removeCard){
                        this.cardCollection.splice(i,1);
                        break;
                    }
                };
                this.eachTimeRemove++;
                this.eachTimeAdd = (this.eachTimeAdd == 0) ? 0 : this.eachTimeAdd-1;
            }
        }
    },
    hoverAction : function(){
        if(this.selectedCard.card){
            var seleCard = this.selectedCard;
            var moveVector = Utility.subtractPoint(seleCard.card.region, seleCard.originalPosition);
            if(this.setTimeDragDistance < Math.abs(moveVector.y)){
                var currentTime = new Date(),
                	currentMilliseconds = (currentTime.getSeconds())*1000+currentTime.getMilliseconds();
                   // currentMilliseconds = (currentTime.getMinutes()*60+currentTime.getSeconds())*1000+currentTime.getMilliseconds();
                if(currentMilliseconds - this.hoverTime > 700){
                    this.isHoverTime = true;
                    if(seleCard.card.time.min == 0 && !seleCard.card.isStart)
                        seleCard.card.adjustmentTime(0, this.direction.factor*15);
                    else
                        seleCard.card.adjustmentTime(this.direction.factor, 0);
                }
            }
        }
    },
    countDownCilck : function(dX, dY){
        if(this.countDownStart.button.isInRegion(dX, dY)){
            var alertTimePoints = this.getAlertTimes();
            this.timerModel.setAlerts(alertTimePoints);
            this.timerModel.saveData();
            // var alertColorTimes = [];
            // for (var i = 0; i < this.cardCollection.length; i++)
            //     alertColorTimes.push(this.cardCollection[i].card.getAlertTime());
            // this.timerModel.setAlerts(alertColorTimes);
            this.countdownController.start();
            return true;
        }
        return false;
    },
    selectCard : function(dX, dY){
        var collection = this.cardCollection, collectionLeng = collection.length;
        for (var i = 0; i < collectionLeng; i++) {
            if(collection[i].card.isInRegion(dX, dY)){
                var card = collection[i].card;
                this.selectedCard.index = i;
                this.selectedCard.card = card;
                this.selectedCard.originalPosition = collection[i].originalPosition;

                this.direction.clickPoint = { x:dX, y:dY };
                this.direction.previousPoint = this.direction.clickPoint;
                break;
            }
        }
    },
    dragCard : function(dX, dY){
        if(this.selectedCard.card){
            var selectedCard = this.selectedCard.card,
                selectedCardOriginalPos = this.selectedCard.originalPosition;

            this.direction.dragPoint = { x:dX, y:dY };
            if(this.direction.orient === ""){
                var subVector = Utility.subtractPoint(this.direction.dragPoint, this.direction.clickPoint),
                    delta = Math.abs(subVector.x) - Math.abs(subVector.y)
                    buffer = {l:-3, u:3};

                if(!(buffer.l <= delta && delta <= buffer.u)){
                    this.direction.orient = delta > buffer.u ? "leftright" : "updown" ;
                }
            }
            else{
                var moveVector = Utility.subtractPoint(this.direction.dragPoint, this.direction.previousPoint);
                if(this.direction.orient === "updown"){
                    var deltaY = selectedCardOriginalPos.y - selectedCard.region.y;
                    if(Math.abs(deltaY) < selectedCard.region.h/2.5){
                        selectedCard.region.y += moveVector.y*0.5;
                        this.direction.factor = (deltaY < 0) ? -1 : 1;

                        var timeCheckStart = new Date();
                       // this.hoverTime = (timeCheckStart.getMinutes()*60+timeCheckStart.getSeconds())*1000 + timeCheckStart.getMilliseconds();
                        this.hoverTime = (timeCheckStart.getSeconds())*1000 + timeCheckStart.getMilliseconds();
                        this.isHoverTime = false;
                    }
                }
                else if(this.direction.orient === "leftright"){
                    var deltaX, collection = this.cardCollection, 
                        collectionLeng = collection.length;

                    selectedCard.region.x += moveVector.x;
                    for (var i = 0; i < collectionLeng; i++) {
                        if(i < this.selectedCard.index)
                            collection[i].card.region.x += moveVector.x;
                        else if(i > this.selectedCard.index)
                            collection[i].card.region.x -= moveVector.x;
                    };
                    this.countDownStart.button.region.x -= moveVector.x;

                    deltaX = selectedCardOriginalPos.x - selectedCard.region.x;
                    if(deltaX > 0){
                        if(Math.abs(deltaX) >= selectedCard.region.w*(0.4+0.6*this.eachTimeAdd))
                            this.addTimeCard();
                        else if(this.eachTimeAdd > 0){
                            interval = selectedCard.region.w*(0.4+0.6*(this.eachTimeAdd-1));
                            if(Math.abs(deltaX) < interval)
                                this.removeTimeCard();
                        }
                    }
                    else if(deltaX < 0){
                        var interval = selectedCard.region.w*(0.4+0.6*this.eachTimeRemove);
                        if(Math.abs(deltaX) >= interval)
                            this.removeTimeCard();
                        else if(this.eachTimeRemove > 0){
                            interval = selectedCard.region.w*(0.4+0.6*(this.eachTimeRemove-1));
                            if(Math.abs(deltaX) < interval)
                                this.addTimeCard();
                        }
                    }
                }
            }
            this.direction.previousPoint = this.direction.dragPoint;
        }
    },
    releaseCard : function(){
        if(this.selectedCard.card){
            var selectedCard = this.selectedCard.card,
                deltaY = this.selectedCard.originalPosition.y - selectedCard.region.y,
                factor;

            if(this.setTimeDragDistance < Math.abs(deltaY) && !this.isHoverTime){
                factor = (deltaY < 0) ? -1 : 1;
                if(selectedCard.isStart)
                    selectedCard.adjustmentTime(factor, 0);
                else
                    selectedCard.adjustmentTime(0, factor*15);
            }
            this.alignmentXAxis();
        }
        this.direction.orient = "";
        this.selectedCard.index = null;
        this.selectedCard.card = null;
        this.selectedCard.originalPosition = null;
        this.eachTimeRemove = 0;
        this.eachTimeAdd = 0;
    },
    moveBackAtXAxis : function(item, mTimes, nowPos, targetPos){
        var shift = Utility.shiftByEaseFunction(mTimes, nowPos, targetPos);
        item.moveTo(shift, item.region.y);
    },
    alignmentCardXAxis : function(cardItem){
        var card = cardItem.card,
            oPos = cardItem.originalPosition,
            curPos = cardItem.currentPosition,
            cTimes = cardItem.moveTimes++,
            shift;
        if(card.region.x !== oPos.x){
            // if(card.region.x > 1800) card.moveTo(oPos.x, card.region.y);
            this.moveBackAtXAxis(card, cTimes, curPos.x, oPos.x);
        }else{
            // if(card.region.x > 1800) card.moveTo(oPos.x, card.region.y);
            card.moveTo(oPos.x, card.region.y);
        }

    },
    alignmentCardYAxis : function(cardItem){
        var card = cardItem.card,
            oPos = cardItem.originalPosition,
            delta = 30,shift;
        if(card.region.y !== oPos.y){
        	shift = Utility.shiftToDestinationByDelta(card.region.y, oPos.y, delta);
            card.moveTo(card.region.x, shift);
        }
    }
};