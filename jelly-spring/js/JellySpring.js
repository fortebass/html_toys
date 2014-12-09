var context = canvas.getContext('2d'),
    w, h,
    offsetX = canvas.offsetLeft,
    offsetY = canvas.offsetTop;

canvas.width = w = window.innerWidth * 0.3;
canvas.height = h = window.innerHeight * 0.6;

function scratch(){
    
}

//springLaunch
function springLaunch() {
    var isKeepUpdate = true,
        isDragging = false,
        ptX = 10,
        ptY = 300,
        launchDeep = 200,
        launchLength = 300,
        launchMidLength = launchLength / 2,
        amplitudeMax = 30,
        amplitudeCrest = amplitudeMax,
        amplitudePosition = 0,
        amplitude = amplitudeMax,
        amplitudeReduce = 2,
        diretion = 1,
        velocity = amplitudeMax / 5,
        velocityDelta = 0.1,
        controlForce = launchLength / 2,
        controlLeftForce = 0,
        controlRightForce = 0,
        drawSpringCurve = function (context) {
            var dragPoint = {
                x: ptX + amplitudePosition,
                y: ptY + amplitude,
            };
            
            setDrawStyle(context);
            context.beginPath();
            context.moveTo(ptX, ptY); // 只移動畫筆，不會畫上去
            context.bezierCurveTo(ptX + 5, ptY,
                                  dragPoint.x - controlLeftForce, dragPoint.y,
                                  dragPoint.x, dragPoint.y);

            context.bezierCurveTo(dragPoint.x + controlRightForce, dragPoint.y,
                                  ptX + launchLength - 5, ptY,
                                  ptX + launchLength, ptY);

            context.lineTo(ptX + launchLength, ptY + launchDeep);
            context.lineTo(ptX, ptY + launchDeep);
            context.lineTo(ptX, ptY);
            context.fill(); // Fill the path
            context.stroke();
        },
        setDrawStyle = function(context){
            context.strokeStyle = "rgba(163, 250, 200, 0.5)"; // a:透明度
            context.lineWidth = 10;
            context.lineJoin = "round"; // 轉折邊緣 是圓的
            context.lineCap = "round"; // 畫筆是圓的
            context.fillStyle = "rgba(163, 193, 169, 1)"; // Fill
        },
        initialize = function () {
            isKeepUpdate = true;
            isDragging = false;
        },
        setAmplitudePosition = function (cX) {
            amplitudePosition = (cX - ptX) * 0.9 + launchLength * 0.05; // 避免太靠近邊界
            controlLeftForce = controlForce * (amplitudePosition + 40) / launchLength;
            controlRightForce = controlForce * (launchLength - amplitudePosition + 20) / launchLength;
        },
        setAmplitudeCrest = function (cY) {
            amplitudeCrest = cY - ptY;

            if (amplitudeCrest >= amplitudeMax){
                amplitude = amplitudeMax;
                amplitudeCrest = amplitudeMax;
            }
            else if (amplitudeCrest <= -amplitudeMax){
                amplitude = -amplitudeMax;
                amplitudeCrest = amplitudeMax;
            }
            else{
                amplitude = amplitudeCrest;
                amplitudeCrest = Math.abs(amplitudeCrest);
            }
            
            velocity = amplitudeCrest / 5;
        };
    return {
        isInTheRegion: function (cX, cY) {
            //return (ptX <= cX && cX <= ptX + launchLength) && (ptY <= cY && cY <= ptY + launchDeep);
            return (ptX <= cX && cX <= ptX + launchLength) && (ptY - amplitudeMax <= cY && cY <= ptY + launchDeep);
        },
        setReleasePoint:function(cX, cY){
            initialize();
            setAmplitudePosition(cX);
            setAmplitudeCrest(cY);
        },
        setDragPoint:function(cX, cY){
            setAmplitudePosition(cX);
            
            amplitude = cY - ptY;
            if (amplitude >= amplitudeMax)
                amplitude = amplitudeMax;
        },
        update: function (context) {
            if (isKeepUpdate) {
                amplitude = amplitude + velocity * diretion;
                                
                if (amplitude < -amplitudeCrest) {
                    diretion = 1;
                    amplitudeCrest -= amplitudeReduce;
                    if (amplitudeCrest > 0) {
                        amplitudeCrest = Math.pow(Math.sqrt(amplitudeCrest), 2);
                        amplitude = amplitude + velocity * diretion;
                        velocity += velocityDelta;
                    }
                } else if (amplitude > amplitudeCrest) {
                    diretion = -1;
                    amplitudeCrest -= amplitudeReduce;
                    if (amplitudeCrest > 0) {
                        amplitudeCrest = Math.pow(Math.sqrt(amplitudeCrest), 2);
                        amplitude = amplitude + velocity * diretion;
                        velocity += velocityDelta;
                    }
                }
    
                if (amplitudeCrest < 0) {
                    amplitude = 0;
                    drawSpringCurve(context);
                    isKeepUpdate = false;
                    return;
                }
            }
            drawSpringCurve(context);
        },
        keepUpdate: function (keepUpdate) {
            isKeepUpdate = keepUpdate;
        },
        setDragging:function (dragging){
            isDragging = dragging;
        },
        isDragging:function (){
            return isDragging;
        }
    };
}//springLaunch

var springLauncher = springLaunch();

function update() {
    context.clearRect(0, 0, w, h);
    springLauncher.update(context);
    requestAnimationFrame(update);
}
document.onkeydown = function(e){
    switch(e.keyCode){
        case 65://a
            springLauncher.setReleasePoint(30, 200);
            break;
        case 83://s
            springLauncher.setReleasePoint(150, 295);
            break;
        case 68://d
            springLauncher.setReleasePoint(280, 200);
            break;
        case 87://w
            springLauncher.setReleasePoint(150, 315);
            break;
        default:
            springLauncher.setReleasePoint(150, 300);
    }
    springLauncher.keepUpdate(true);
};//a:65,s:83,d:68,w:87

function getRealX(x) {
    return x - offsetX;
}

function getRealY(y) {
    return y -offsetY;
}

canvas.addEventListener('mousedown', function (e) {
	var x = getRealX(e.clientX), y = getRealY(e.clientY);
    if(springLauncher.isInTheRegion(x, y)){
        springLauncher.setDragging(true);
        springLauncher.setDragPoint(x, y);
    }
}, false);
canvas.addEventListener('mousemove', function (e) {
	var x = getRealX(e.clientX), y = getRealY(e.clientY);
    if(springLauncher.isDragging()){
        if (springLauncher.isInTheRegion(x, y)){
            springLauncher.setDragPoint(x, y);
        }
        else{
            springLauncher.setDragging(false);
            springLauncher.setReleasePoint(x, y);
            springLauncher.keepUpdate(true);
        }
    }
}, false);
canvas.addEventListener('mouseup', function (e) {
	var x = getRealX(e.clientX), y = getRealY(e.clientY);
    springLauncher.setDragging(false);
    if (springLauncher.isInTheRegion(x, y)) 
    {
        springLauncher.setReleasePoint(x, y);
        springLauncher.keepUpdate(true);
    }
    
}, false);

springLauncher.setReleasePoint(150, 200);

update();