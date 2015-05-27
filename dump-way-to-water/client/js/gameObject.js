
var gameObject = {
    createRectangle : function (entity, definition) {
        var bodyDef = new b2BodyDef;
        if (entity.isStatic) {
            bodyDef.type = b2Body.b2_staticBody;
        } else {
            bodyDef.type = b2Body.b2_dynamicBody;
        }
        bodyDef.position.x = entity.x / SCALE;
        bodyDef.position.y = entity.y / SCALE;
        if (entity.angle) {
            bodyDef.angle = entity.angle * Math.PI / 180;
        }
        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;

        fixtureDef.shape = new b2PolygonShape;
        fixtureDef.shape.SetAsBox(entity.width / 2 / SCALE, entity.height / 2 / SCALE);
        var body = world.CreateBody(bodyDef);
        body.SetUserData(entity);
        var fixture = body.CreateFixture(fixtureDef);
        return body;
    },
    createCircle:function(entity, definition){
        var bodyDef = new b2BodyDef;
        if(entity.isStatic){
            bodyDef.type = b2Body.b2_staticBody;
        } else {
            bodyDef.type = b2Body.b2_dynamicBody;
        }
        bodyDef.position.x = entity.x/SCALE;
        bodyDef.position.y = entity.y/SCALE;
        if (entity.angle) {
            bodyDef.angle = Math.PI*entity.angle/180;
        }
        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;
         
        fixtureDef.shape = new b2CircleShape(entity.radius/SCALE);
        var body = world.CreateBody(bodyDef);
        body.SetUserData(entity);
         
        var fixture = body.CreateFixture(fixtureDef);
        return body;
    },
    createObstacleWheel:function(entity, definition){
        var bodyDef = new b2BodyDef;
        if(entity.isStatic){
            bodyDef.type = b2Body.b2_staticBody;
        } else {
            bodyDef.type = b2Body.b2_dynamicBody;
        }
        bodyDef.position.x = entity.x/SCALE;
        bodyDef.position.y = entity.y/SCALE;
        if (entity.angle) {
            bodyDef.angle = Math.PI*entity.angle/180;
        }
        var body = world.CreateBody(bodyDef);
        body.SetUserData(entity);

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;
        fixtureDef.shape = new b2CircleShape(30/SCALE);
        body.CreateFixture(fixtureDef);

        // Create second fixture and attach a polygon shape to the body
        fixtureDef.shape = new b2PolygonShape;
        var points = [
            new b2Vec2(10/SCALE,-5/SCALE),
            new b2Vec2(60/SCALE,-5/SCALE),
            new b2Vec2(60/SCALE,5/SCALE),
            new b2Vec2(10/SCALE,5/SCALE),
        ];
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = [
            new b2Vec2(-5/SCALE,-60/SCALE),
            new b2Vec2(5/SCALE,-60/SCALE),
            new b2Vec2(5/SCALE,-10/SCALE),
            new b2Vec2(-5/SCALE,-10/SCALE),
        ];
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = [
            new b2Vec2(-60/SCALE,-5/SCALE),
            new b2Vec2(-10/SCALE,-5/SCALE),
            new b2Vec2(-10/SCALE,5/SCALE),
            new b2Vec2(-60/SCALE,5/SCALE),
        ];
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = [
            new b2Vec2(-5/SCALE,10/SCALE),
            new b2Vec2(5/SCALE,10/SCALE),
            new b2Vec2(5/SCALE,60/SCALE),
            new b2Vec2(-5/SCALE,60/SCALE),
        ];
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        var bodyDef2 = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef2.position.x = entity.x/SCALE;
        bodyDef2.position.y = entity.y/SCALE;
        var body2 = world.CreateBody(bodyDef2);

        fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;
        fixtureDef.shape = new b2CircleShape(5/SCALE);
        body2.CreateFixture(fixtureDef);

        // Create a joint between body and body2
        var jointDef = new b2RevoluteJointDef;
        var jointCenter = new b2Vec2(bodyDef2.position.x, bodyDef2.position.y);
        jointDef.Initialize(body, body2, jointCenter);
        world.CreateJoint(jointDef);

        return body;
    },
    createGoalContainer : function (entity, definition) {
        var bodyDef = new b2BodyDef;
        // if (entity.isStatic) {
            bodyDef.type = b2Body.b2_staticBody;
        // } else {
        //     bodyDef.type = b2Body.b2_dynamicBody;
        // }
        bodyDef.position.x = entity.x / SCALE;
        bodyDef.position.y = entity.y / SCALE;
        if (entity.angle) {
            bodyDef.angle = entity.angle * Math.PI / 180;
        }
        var body = world.CreateBody(bodyDef);
        body.SetUserData(entity);

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;

        fixtureDef.shape = new b2PolygonShape;

        points = gameObject.createRectFixturePointsByArray([0, 0, 20, entity.height]);
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = gameObject.createRectFixturePointsByArray([0, entity.height-20, entity.width, 20]);
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = gameObject.createRectFixturePointsByArray([entity.width-20, 0, 20, entity.height]);
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        return body;
    },
    createFloor:function(entity, definition){
        var bodyDef = new b2BodyDef;
        // if (entity.isStatic) {
            bodyDef.type = b2Body.b2_staticBody;
        // } else {
        //     bodyDef.type = b2Body.b2_dynamicBody;
        // }
        bodyDef.position.x = entity.x / SCALE;
        bodyDef.position.y = entity.y / SCALE;
        if (entity.angle) {
            bodyDef.angle = entity.angle * Math.PI / 180;
        }
        var body = world.CreateBody(bodyDef);
        body.SetUserData(entity);

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;

        fixtureDef.shape = new b2PolygonShape;

        var points;
        for (var i = -entity.width/2; i < entity.width/2; i+=50) {
            points = [
                new b2Vec2(i/SCALE,0/SCALE),
                new b2Vec2((i+35)/SCALE,0/SCALE),
                new b2Vec2((i+35)/SCALE,entity.height/2/SCALE),
                new b2Vec2(i/SCALE,entity.height/2/SCALE),
            ];
            fixtureDef.shape.SetAsArray(points,points.length);
            body.CreateFixture(fixtureDef);
        };
        
        return body;
    },
    createPipeOut:function(entity, definition){
        var bodyDef = new b2BodyDef;
        // if (entity.isStatic) {
            bodyDef.type = b2Body.b2_staticBody;
        // } else {
        //     bodyDef.type = b2Body.b2_dynamicBody;
        // }
        bodyDef.position.x = entity.x / SCALE;
        bodyDef.position.y = entity.y / SCALE;
        if (entity.angle) {
            bodyDef.angle = entity.angle * Math.PI / 180;
        }
        var body = world.CreateBody(bodyDef);
        body.SetUserData(entity);

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;

        fixtureDef.shape = new b2PolygonShape;

        var points = gameObject.createRectFixturePointsByArray([0,0,5,entity.height]);
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        // points = gameObject.createRectFixturePointsByArray([0, entity.height-5, entity.width, 30]);
        points = [
            new b2Vec2(0/SCALE           ,(entity.height-50)/SCALE),
            new b2Vec2(entity.width/SCALE,(entity.height-5)/SCALE),
            new b2Vec2(entity.width/SCALE,(entity.height)/SCALE),
            new b2Vec2(0/SCALE           ,(entity.height)/SCALE),
        ];
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = gameObject.createRectFixturePointsByArray([50, 0, 30, entity.height-70]);
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);

        points = gameObject.createRectFixturePointsByArray([50, entity.height-80, 50,15]);
        fixtureDef.shape.SetAsArray(points,points.length);
        body.CreateFixture(fixtureDef);
        
        return body;
    },
    createRectFixturePointsByArray:function(rPts){
        return [
            new b2Vec2(rPts[0]/SCALE          ,rPts[1]/SCALE),
            new b2Vec2((rPts[0]+rPts[2])/SCALE,rPts[1]/SCALE),
            new b2Vec2((rPts[0]+rPts[2])/SCALE,(rPts[1]+rPts[3])/SCALE),
            new b2Vec2(rPts[0]/SCALE          ,(rPts[1]+rPts[3])/SCALE),
        ];
    }

};

function PulleyJoint(entity1, entity2, anchor1, anchor2) {
      this.entity1 = entity1;
      this.entity2 = entity2;
      this.anchor1 = anchor1;
      this.anchor2 = anchor2;
}
    
PulleyJoint.prototype.draw = function(ctx) {
  this.drawLine(ctx, this.entity1.GetWorldCenter(), this.anchor1);
  this.drawLine(ctx, this.entity2.GetWorldCenter(), this.anchor2);
}

PulleyJoint.prototype.drawLine = function(ctx, entity, anchor) {
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.moveTo(entity.x * SCALE, entity.y * SCALE);
  ctx.lineTo(anchor.x * SCALE, anchor.y * SCALE);
  ctx.closePath();
  ctx.stroke();
}
