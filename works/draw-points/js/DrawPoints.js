var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    w, h;

canvas.width = w = window.innerWidth * 0.98;
canvas.height = h = window.innerHeight * 0.9;

function DrawPointCollection(ctx) {
    this.offset = { x:0, y:0 };// 讓畫筆判斷在正中心
    this.hitPoints = {};
    this.outlinePoints = [];
    this.pcounter = 0;
    this.doneNotification = false;
    this.context = ctx;
    this.pointSensorRegion = 10;
}
DrawPointCollection.prototype.setSensorRegion = function(region){
    this.pointSensorRegion = region;
};
DrawPointCollection.prototype.setOffet = function(pX, pY){
    this.offset.x = pX;
    this.offset.y = pY;
};
DrawPointCollection.prototype.getDoneNotification=function(){
    return this.doneNotification;
};
DrawPointCollection.prototype.addPoint=function(pX, pY) {
    var p = {
        x: pX,
        y: pY
    };
    this.hitPoints[this.pcounter] = p;
    this.outlinePoints.push(p);
    ++this.pcounter;
};
DrawPointCollection.prototype.forEach=function(func) {
    var k;
    if(this.pcounter == 0){
        console.log("no point here!!!");
        return;
    }

    for (k in this.hitPoints)
        func(this.hitPoints[k]);
};
DrawPointCollection.prototype.calculateOutlinePoints = function(){
    var result, upperPoints, lowerPoints;
    var result = this.outlinePoints.reduce(function(outlinePts, point){
        if(outlinePts[point.x] === undefined){
            outlinePts[point.x] = { max:point, min:point };
            return outlinePts;
        }
        else{
            var maxminPts = outlinePts[point.x];
            if(maxminPts.max.y < point.y)
                maxminPts.max = point;
            else if(maxminPts.min.y > point.y)
                maxminPts.min = point;

            return outlinePts;
        }
    },{});
    upperPoints = [];
    lowerPoints = [];
    for(var key in result){
        var maxminPts = result[key];
        if(maxminPts.max === maxminPts.min){
            upperPoints.push(maxminPts.max);
            continue;
        }
        upperPoints.push(maxminPts.max);
        lowerPoints.splice(0,0,maxminPts.min);
    }
    this.outlinePoints = upperPoints.concat(lowerPoints);
};
DrawPointCollection.prototype.draw=function() {
    var o, k, flipColor,drawPoint, drawContext = this.context;
    drawContext.save();
    drawContext.lineCap = "round";// 畫筆是圓的
    drawContext.lineJoin = "round";// 轉折邊緣 是圓的
    drawContext.lineWidth = 5; // Make lines thick
    drawContext.lineDashOffset = 5;
    drawContext.setLineDash([5,10]);
    
    drawContext.beginPath(); // Start the path
    for (o in this.outlinePoints) {
        drawPoint = this.outlinePoints[o];
        
        drawContext.lineTo(drawPoint.x, drawPoint.y);
    }
    drawContext.closePath(); // Fill Close the path
    drawContext.fillStyle = "white";
    drawContext.fill();
    drawContext.strokeStyle = "red";
    drawContext.stroke();

};
DrawPointCollection.prototype.detectDrawed=function(pX, pY) {
    var k, detectPoint, drawContext = this.context;
    if(this.pcounter < 3){
        if(!this.doneNotification){
            var mainbody = document.getElementsByClassName('mainbody')[0];
            mainbody.setAttribute("src", "file/vanper02nowing.svg");

            var wingL = document.getElementsByClassName('wingL')[0];
            wingL.setAttribute('class', 'wingLswing');

            var wingR = document.getElementsByClassName('wingR')[0];
            wingR.setAttribute('class', 'wingRswing');

            var title = document.getElementsByClassName('title')[0];
            title.setAttribute('class', 'hidetitle');
            
            var thanks = document.getElementsByClassName('thanks')[0];
            thanks.setAttribute('class', 'showthanks');
            // this.doneNotification = true;
        }
    }
    else{
        pX = pX-this.offset.x;
        pY = pY-this.offset.y;
        for (k in this.hitPoints) {
            detectPoint = this.hitPoints[k];
            if (Math.sqrt(Math.pow(detectPoint.x - pX, 2) + Math.pow(detectPoint.y - pY, 2)).toFixed(1) < this.pointSensorRegion) {
                console.log(detectPoint.x+", "+detectPoint.y+":: hit");
                --this.pcounter;
                delete this.hitPoints[k];
            }
        }
    }
    
};
////////////////////////////////////////////////////////////////////////

function Pen(ctx){
    this.offset = { x:0, y:0 },// 讓畫筆判斷在正中心
    this.isDrawing = false,
    this.radius = 15,
    this.penShape = "round",
    this.color = "red",
    this.context = ctx;
}
Pen.prototype.setOffet = function(pX, pY){
    this.offset.x = pX;
    this.offset.y = pY;
};
Pen.prototype.setDoneNotification = function(done){
    return this.isDrawing = done;
};
Pen.prototype.setDrawMode = function(draw){
    var drawContext = this.context;
    this.isDrawing = draw;
    if(this.isDrawing){
        drawContext.restore();
        drawContext.lineCap = this.penShape;// 畫筆是圓的
        drawContext.lineJoin = this.penShape;// 轉折邊緣 是圓的
        drawContext.lineWidth = this.radius; // Make lines thick
        drawContext.strokeStyle = this.color;// a:透明度
        drawContext.beginPath();
    }
};
Pen.prototype.getDrawMode = function(){ return this.isDrawing; };
Pen.prototype.getRadius = function(){
    return this.radius;
};
Pen.prototype.draw = function(pX, pY){
    var drawContext = this.context;
    if(this.isDrawing){
        drawContext.lineTo(pX - this.offset.x, pY - this.offset.y);
        drawContext.stroke();
    }
    //pen round
};
Pen.prototype.move = function(pX, pY){
    this.context.moveTo(pX - this.offset.x, pY - this.offset.y);
};
////////////////////////////////////////////////////////////////////////

var drawPen = new Pen(context);
var drawPoints = new DrawPointCollection(context);
drawPoints.setSensorRegion(drawPen.getRadius()/1.2);

function setPoints(pointColl) {
    var i, j, count = 15, density = drawPen.getRadius()*0.8,
        startPoint = {
            x: 470,
            y: 430
        };
    for (i = 0; i < count; ++i)
        for (j = i; j < count-i; ++j)
            pointColl.addPoint(startPoint.x + density * i , startPoint.y + density * j + Math.random() * 5);

    pointColl.addPoint(startPoint.x + density * i , startPoint.y + density * j + Math.random() * 5);

    startPoint.x += density*(count-1);
    for (i = 0; i < count; ++i)
        for (j = i; j < count-i; ++j)
            pointColl.addPoint(startPoint.x - density * i, startPoint.y + density * j + Math.random() * 5);

    pointColl.addPoint(startPoint.x - density * i, startPoint.y + density * j + Math.random() * 5);

    pointColl.calculateOutlinePoints();
}

function initialize() {
    

    setPoints(drawPoints);
    drawPoints.draw();
    drawPoints.setOffet(canvas.offsetLeft, canvas.offsetTop);
    drawPen.setOffet(canvas.offsetLeft, canvas.offsetTop);
}

canvas.addEventListener('mousedown', function (e) {
    drawPen.move(e.clientX, e.clientY);
    drawPen.setDrawMode(true);
}, false);
canvas.addEventListener('mousemove', function (e) {
    if(drawPen.getDrawMode()){
        drawPen.draw(e.clientX, e.clientY);
        drawPoints.detectDrawed(e.clientX, e.clientY);
        drawPen.setDoneNotification(!drawPoints.getDoneNotification());
    }
}, false);
canvas.addEventListener('mouseup', function (e) {
    drawPen.setDrawMode(false);
}, false);

////////////////////////////////////////////////////////////////////////

initialize();
// update();
