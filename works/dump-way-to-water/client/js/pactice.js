
var isMouseDown = false,
    world,
    entityCache = {},
    stringCache = {},
    waterCache = {},
    iceCache = {},
    beautyCache ={},
    frontCache ={},
    CANVAS_Left = 0,
    CANVAS_Top = 0;

function initializePipeGame() {

    world = new b2World(new b2Vec2(0, 10), true);

    createRoom();
    createSeperateBoard();
    createPullString();
    
    createBoard();
    createObstacleWheel();
    createWaterContainer();
    createWaterBalls();

    listenForContact();//碰撞處理

    // createDebugDraw();  

}; // init()

function listenForContact () {
    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.PostSolve = function(contact,impulse){
        var body1 = contact.GetFixtureA().GetBody();
        var body2 = contact.GetFixtureB().GetBody();
        // If either of the bodies is the special body, reduce its life
        if(body1 && body2){
            var body1UserData = body1.GetUserData(),
                body2UserData = body2.GetUserData();
            if (body1UserData && body1UserData.type == "water"){
                if (body2 === entityCache.goalContainer){
                    var impulseAlongNormal = impulse.normalImpulses[0];
                    entityCache.goalContainer.GetUserData().life -= impulseAlongNormal;
                }
            }
            else if (body2UserData && body2UserData.type == "water"){
                if(body1 === entityCache.goalContainer){
                    var impulseAlongNormal = impulse.normalImpulses[0];
                    entityCache.goalContainer.GetUserData().life -= impulseAlongNormal;
                }
            }
            else if (body1 === entityCache.glass && body2.GetUserData().isTool){
                var impulseAlongNormal = impulse.normalImpulses[0];
                entityCache.glass.GetUserData().life -= impulseAlongNormal;
            }
            else if (body2 === entityCache.glass && body1.GetUserData().isTool){
                var impulseAlongNormal = impulse.normalImpulses[0];
                entityCache.glass.GetUserData().life -= impulseAlongNormal;
            }
        }
    };
    world.SetContactListener(listener);
}

function createBoard () {
    entityCache[entity.board001.name] = gameObject.createRectangle(entity.board001, definition);
    entityCache[entity.board002.name] = gameObject.createRectangle(entity.board002, definition);
    entityCache[entity.glass.name] = gameObject.createRectangle(entity.glass, definition);
}

function createPullString(){
    var body1 = gameObject.createRectangle(entity.box001, definition),
        body2 = gameObject.createRectangle(entity.box002, definition),
        ga1 = new b2Vec2(entity.box001.x/SCALE,-5/SCALE),
        ga2 = new b2Vec2(entity.box002.x/SCALE,-5/SCALE),
        pulleyJoint = new b2PulleyJointDef;
    pulleyJoint.Initialize(body1, body2, ga1, ga2, body1.GetWorldCenter(), body2.GetWorldCenter(), 1.0);
    world.CreateJoint(pulleyJoint);
    entityCache[entity.box001.name] = body1;
    entityCache[entity.box002.name] = body2;
    stringCache["box0012"] = new PulleyJoint(body1, body2, ga1, ga2);
}

function createPullStringALS(){
    var body1 = gameObject.createRectangle(entity.box003, definition),
        body2 = gameObject.createRectangle(entity.box004, definition),
        ga1 = new b2Vec2(entity.box003.x/SCALE,-5/SCALE),
        ga2 = new b2Vec2((entity.box004.x-500)/SCALE,-5/SCALE),
        pulleyJoint = new b2PulleyJointDef;
    pulleyJoint.Initialize(body1, body2, ga1, ga2, body1.GetWorldCenter(), body2.GetWorldCenter(), 1.0);
    world.CreateJoint(pulleyJoint);
    entityCache[entity.box003.name] = body1;
    entityCache[entity.box004.name] = body2;
    stringCache["box0034"] = new PulleyJoint(body1, body2, ga1, ga2);

}

function createRoom(){
    entityCache[entity.floor.name] = gameObject.createFloor(entity.floor, definition);
    entityCache[entity.wallR.name] = gameObject.createRectangle(entity.wallR, definition);
    entityCache[entity.wallL.name] = gameObject.createRectangle(entity.wallL, definition);
}

function createWaterContainer(){
    frontCache[entity.pipeOut.name] = gameObject.createPipeOut(entity.pipeOut, definition);
    entityCache[entity.goalContainer.name] = gameObject.createGoalContainer(entity.goalContainer, definition);
    
}

function createObstacleWheel(){
    entityCache[entity.wheel001.name] = gameObject.createObstacleWheel(entity.wheel001, definition);
    entityCache[entity.wheel002.name] = gameObject.createObstacleWheel(entity.wheel002, definition);
    entityCache[entity.wheel003.name] = gameObject.createObstacleWheel(entity.wheel003, definition);
}

function createSeperateBoard(){
    for(var key in level02SperateBoards){
        var board = level02SperateBoards[key];
        entityCache[board.name] = gameObject.createRectangle(board, definition);
    }
}

function createWaterBalls () {
    var fixDef = new b2FixtureDef;
    fixDef.density = 5.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    //create some objects
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.y = 0;
    var balls = [];
    for (var i = 0; i < 200; ++i) {
        fixDef.shape = new b2CircleShape(2 / SCALE);//radius
        bodyDef.position.x = (Math.random()+ -10)/ SCALE;
        bodyDef.position.y += 1 / SCALE;
        var body = world.CreateBody(bodyDef)
        body.CreateFixture(fixDef);
        body.SetUserData({type:"water", radius:Math.random()*8+8});
        balls.push(body);
    }
    // entityCache.balls = balls;
    waterCache["balls"] = balls;
}

function createBeauty(){
    beautyCache[entity.beauty.name] = gameObject.createRectangle(entity.beauty, definition);
}

function createIceWaterBalls(){
    var fixDef = new b2FixtureDef;
    fixDef.density = 5.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    //create some objects
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.y = -200/SCALE;
    var balls = [];
    for (var i = 0; i < 200; ++i) {
        fixDef.shape = new b2CircleShape(2 / SCALE);//radius
        bodyDef.position.x = (Math.random()*45+ 1400)/ SCALE;
        bodyDef.position.y += 1 / SCALE;
        var body = world.CreateBody(bodyDef)
        body.CreateFixture(fixDef);
        body.SetUserData({type:"water", radius:Math.random()*8+8});
        balls.push(body);
    }
    // entityCache.balls = balls;
    iceCache["ices"] = balls;
}

function createDebugDraw () {
    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("game").getContext("2d"));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
}



function getBodyAt (x, y) {
   var mousePVec = new b2Vec2(x, y);
   var aabb = new b2AABB();
   aabb.lowerBound.Set(x - 0.001, y - 0.001);
   aabb.upperBound.Set(x + 0.001, y + 0.001);
   
   // Query the world for overlapping shapes.

   var selectedBody = null;
   world.QueryAABB(function(fixture) {
    if(fixture){
        var body = fixture.GetBody();
        if(body.GetUserData().isTool) {
            if(fixture.GetShape().TestPoint(body.GetTransform(), mousePVec)) {
               selectedBody = body;
               return false;
            }
         }
         return true;
    }
    return false;
   }, aabb);
   return selectedBody;
}

function movePipe(pipeOut){
    var pipePosition = pipeOut.GetPosition(),
        movePipeValue = pipeOut.GetUserData().move;
    pipePosition.y += movePipeValue.y/SCALE;
    movePipeValue.offset+= movePipeValue.y;
    if(movePipeValue.offset > movePipeValue.max || movePipeValue.offset < movePipeValue.min)
        movePipeValue.y *= -1;

    pipeOut.SetPosition(pipePosition);
}

function sendPlayerData(iamplayer){
    
    iamplayer.player.toolAngle = currentSelectBody.GetAngle();
    iamplayer.player.toolPosX = preFallPosition.x;
    iamplayer.player.toolPosY = preFallPosition.y;
    websocket.send(JSON.stringify(iamplayer));
}


var preMousePosition;
var preFallPosition;
var currentSelectBody;

function adjustPoint (clientX, clientY) {
    return {
        x : clientX - CANVAS_Left,
        y : clientY - CANVAS_Top
    };
}
function subPoint(p1, p2){
    return {
        x : p1.x - p2.x,
        y : p1.y - p2.y
    };
}

function mouseDownHandler (e){
    if(!isMouseDown){
        preMousePosition = adjustPoint(e.clientX, e.clientY);
        var mouseX = preMousePosition.x / SCALE,
            mouseY = preMousePosition.y / SCALE;
        currentSelectBody = getBodyAt(mouseX, mouseY);
        if(currentSelectBody){
            currentSelectBody.SetType(b2Body.b2_staticBody);
            currentSelectBody.SetAwake(false);
            preFallPosition = currentSelectBody.GetPosition();
            isMouseDown = true;

            var userData = currentSelectBody.GetUserData();
            userData.playerName = iamplayer.player.id;
            iamplayer.player.takeTool = userData.name;
            iamplayer.player.releaseTool = "none";
            sendPlayerData(iamplayer);
        }
    }
}

function mouseMoveHandler (e){
    if(isMouseDown && currentSelectBody){
        var curMousePosition = adjustPoint(e.clientX, e.clientY),
            move = subPoint(curMousePosition, preMousePosition);

        move.x = move.x / SCALE;
        move.y = move.y / SCALE;
        currentSelectBody.SetAwake(false);
        preFallPosition.Add(move);
        currentSelectBody.SetPosition(preFallPosition);
        preMousePosition = curMousePosition;

        iamplayer.player.takeTool = currentSelectBody.GetUserData().name;
        iamplayer.player.releaseTool = "none";
        sendPlayerData(iamplayer);
    }
}

function mouseWheelHandler (e) {
    if(isMouseDown && currentSelectBody){
        // cross-browser wheel delta
        var e = window.event || e, // old IE support
            delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))),
            selectBodyAngle = currentSelectBody.GetAngle();
        currentSelectBody.SetAngle(selectBodyAngle+=(0.05*delta));

        iamplayer.player.takeTool = currentSelectBody.GetUserData().name;
        iamplayer.player.releaseTool = "none";
        sendPlayerData(iamplayer);
    }
}

canvas.addEventListener("DOMMouseScroll", mouseWheelHandler);//FireFox
canvas.addEventListener("mousewheel", mouseWheelHandler);//Chrome
canvas.addEventListener("mousedown", mouseDownHandler, true);
canvas.addEventListener("mousemove", mouseMoveHandler, true);
canvas.addEventListener("mouseup", function(e) {
    isMouseDown = false;
    if(currentSelectBody){
        iamplayer.player.releaseTool = iamplayer.player.takeTool;
        iamplayer.player.takeTool = "none";
        sendPlayerData(iamplayer);

        iamplayer.player.releaseTool = "none";
        sendPlayerData(iamplayer);
        currentSelectBody.GetUserData().playerName = "";
        currentSelectBody.SetType(b2Body.b2_dynamicBody);
        currentSelectBody.SetAwake(true);
        currentSelectBody = null;
    }
}, true);


function drawWater () {// draw water
    var balls = waterCache.balls;
    for (var i = balls.length - 1; i >= 0; i--) {
        var ballInfo = balls[i],
            radius   = ballInfo.GetUserData().radius,
            position = ballInfo.GetPosition(),
            shiftPen = {x:position.x*SCALE, y:position.y*SCALE};

        context.translate(shiftPen.x,shiftPen.y);
        context.fillStyle = "#0785b2";
        context.beginPath();
        context.arc(0,0,radius,0,2*Math.PI,false);
        context.fill();
        context.translate(-shiftPen.x,-shiftPen.y);
    };
}


function drawIceWater () {// draw water
    var ices = iceCache.ices;
    if(ices){
        for (var i = ices.length - 1; i >= 0; i--) {
            var ballInfo = ices[i],
                userData = ballInfo.GetUserData()
                radius   = userData.radius,
                drawtype = userData.drawtype,
                position = ballInfo.GetPosition(),
                shiftPen = {x:position.x*SCALE, y:position.y*SCALE};

            context.translate(shiftPen.x,shiftPen.y);
            context.fillStyle = "#66d5fd";
            context.beginPath();
            context.arc(0,0,radius,0,2*Math.PI,false);
            context.fill();
            context.translate(-shiftPen.x,-shiftPen.y);
        };
    }
}
var handSprite = loader.loadImage("image/grab.png");
function drawPlayers(context, entityBody, userData, offsetx, offsety){
    if(entityBody.GetType() == b2Body.b2_staticBody){
        context.drawImage(handSprite,offsetx,offsety);
        context.font="30px Verdana";
        context.fillStyle = "#FFF";
        context.fillText(userData.playerName,offsetx,offsety+80);
    }
}

// function draw(entity , position, angle){
function draw(entityBody){
    var userData = entityBody.GetUserData(),
        position = entityBody.GetPosition(),
        angle = entityBody.GetAngle(),
        cache_x = position.x*SCALE,
        cache_y = position.y*SCALE,
        shiftPen = {x:cache_x.toFixed(2), y:cache_y.toFixed(2)};

    context.translate(shiftPen.x,shiftPen.y);
    
    switch(userData.type){
        case "board":
            context.rotate(angle);
            context.drawImage(userData.sprite,-(userData.half_width),-(userData.half_height));
            context.rotate(-angle);

            drawPlayers(context, entityBody, userData, -(userData.half_width-100), -(userData.half_height));
        break;
        case "wheel":
            context.rotate(angle);
            context.drawImage(userData.sprite,-50,-49);
            context.rotate(-angle);
        break;
        case "wall":
            context.fillStyle = "#FF8450"; // Fill
            context.beginPath();
            context.moveTo(-userData.half_width,-userData.half_height);
            context.lineTo(userData.half_width, -userData.half_height);
            context.lineTo(userData.half_width, userData.half_height);
            context.lineTo(-userData.half_width, userData.half_height);
            context.closePath();
            context.fill();
            // context.drawImage(userData.sprite,-(userData.width/2),-(userData.height/2));
        break;
        case "box":
            context.rotate(angle);
            context.fillStyle = "#FF8450"; // Fill
            context.beginPath();
            context.moveTo(-userData.half_width,-userData.half_height);
            context.lineTo(userData.half_width, -userData.half_height);
            context.lineTo(userData.half_width, userData.half_height);
            context.lineTo(-userData.half_width, userData.half_height);
            context.closePath();
            context.fill();
            context.rotate(-angle);

            drawPlayers(context, entityBody, userData, -(userData.half_width-15), -(userData.half_height-10));
        break;
        case "pipe"://front draw
            context.drawImage(userData.sprite, userData.shift_x, userData.shift_y);
        break;
        case "goal"://front draw
            context.drawImage(userData.sprite, userData.shift_x, userData.shift_y);
        break;
        case "glass":
            context.drawImage(userData.sprite, -(userData.half_width), -(userData.half_height));
        break;
        // case "beauty":
        //     context.rotate(angle);
        //     context.drawImage(userData.sprite,userData.shift_x,userData.shift_y);
        //     context.rotate(-angle)
        // break;
        
    }
    
    context.translate(-shiftPen.x,-shiftPen.y);
}

var isALSCreate = false;
function checkDeleteEntity(){
    var checkEntity = entityCache.glass;
    //Kill Special Body if Dead entityCache.glass.GetUserData().life
    if (checkEntity && checkEntity.GetUserData().life<=0){
        world.DestroyBody(checkEntity);
        delete entityCache[checkEntity.GetUserData().name];

        if(!isALSCreate){
            createBeauty();
            createIceWaterBalls();
            createPullStringALS();
            isALSCreate = true;
        }
    }
}
// var isChangeBeauty = true;
// function checkChangeBeauty(){
//     var checkEntity = entityCache.beauty,
//         userData = checkEntity.GetUserData();
//     if (checkEntity && userData.life<=0){
//         userData.sprite = userData.spriteChange;
//         isChangeBeauty = false;
//     }
// }

function drawBeauty(context){
    if("beauty" in beautyCache){
        var entityBody = beautyCache.beauty, 
            userData = entityBody.GetUserData(),
            position = entityBody.GetPosition(),
            angle = entityBody.GetAngle(),
            cache_x = position.x*SCALE,
            cache_y = position.y*SCALE,
            shiftPen = {x:cache_x.toFixed(2), y:cache_y.toFixed(2)};

        context.translate(shiftPen.x,shiftPen.y);
        context.rotate(angle);
        context.drawImage(userData.sprite,userData.shift_x,userData.shift_y);
        context.rotate(-angle);
        context.translate(-shiftPen.x,-shiftPen.y);
        
    }
}

var winSprite = loader.loadImage("image/success.png");
function checkWinTheGame(){
    var successCheckEntity = entityCache.goalContainer;
    if (successCheckEntity && successCheckEntity.GetUserData().life<=0 && iamplayer.state != "succeed"){
        iamplayer.state = "succeed";
        websocket.send(JSON.stringify(iamplayer));
    }

    if(iamplayer.state == "succeed"){
        context.translate(300,500);
        context.rotate(-0.25);
        context.drawImage(winSprite,0,0);
        context.rotate(0.25);
        context.translate(-300,-500);
    }
}

var timeStep = 1/60;//frame-rate
var velocityIterations = 8;
var positionIterations = 3;

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    world.Step(timeStep, velocityIterations, positionIterations);
    world.ClearForces();

    movePipe(frontCache.pipeOut);

    // world.DrawDebugData();

    drawBeauty(context);
    // if(isALSCreate && isChangeBeauty){
    //     checkChangeBeauty();
    // }
    for (var key in stringCache) {
        stringCache[key].draw(context);
    }

    for (var key in entityCache) {
        var entityBody = entityCache[key];
        draw(entityBody);
    }

    drawWater();
    drawIceWater();

    for(var key in frontCache){
        var entityBody = frontCache[key];
        draw(entityBody);
    }
    
    checkDeleteEntity();
    checkWinTheGame();


    requestAnimFrame(update);
}; // update()

DEBUG_MODEL = 0;

function pipeGameStart(){
    initializePipeGame();
    requestAnimFrame(update);
}
