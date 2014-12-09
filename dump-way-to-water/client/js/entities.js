var entity = {
    /////////////////////player tools/////////////////////////////////
    board001 : {
        type:"board",
        name:"board001",
        isStatic: 0,
        isTool:true,
        playerName:"",
        angle:10,
        x:200,
        y:500,
        width:250,
        height:49,
        half_width:125,
        half_height:25,
        sprite: loader.loadImage("image/wood1.png")
    },
    board002 : {
        type:"board",
        name:"board002",
        isStatic: 0,
        isTool:true,
        playerName:"",
        angle:90,
        x:550,
        y:600,
        width:220,
        height:50,
        half_width:110,
        half_height:25,
        sprite: loader.loadImage("image/wood2.png")
    },
    box001 : {
        type:"box",
        name:"box001",
        isStatic: 0,
        isTool:false,
        angle:0,
        x:730,
        y:500,
        width:160,
        height:300,
        half_width:80,
        half_height:150,
        // sprite: loader.loadImage("image/board-02-02.jpg")
    },
    box002 : {
        type:"box",
        name:"box002",
        isStatic: 0,
        isTool:true,
        playerName:"",
        angle:0,
        x:900,
        y:800,
        width:80,
        height:80,
        half_width:40,
        half_height:40,
        // sprite: loader.loadImage("image/board-02-02.jpg")
    },
    box003 : {
        type:"box",
        name:"box003",
        isStatic: 0,
        isTool:true,
        playerName:"",
        angle:0,
        x:500,
        y:350,
        width:80,
        height:80,
        half_width:40,
        half_height:40,
        // sprite: loader.loadImage("image/board-02-02.jpg")
    },
    box004 : {
        type:"box",
        name:"box004",
        isStatic: 0,
        isTool:false,
        angle:0,
        x:1445,
        y:35,
        width:400,
        height:30,
        half_width:200,
        half_height:15,
        // sprite: loader.loadImage("image/board-02-02.jpg")
    },

    /////////////////////createFeedContainer/////////////////////////////////

    glass:{
        type: "glass",
        name: "glass",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1450,
        y: 600,
        width: 300,
        height: 50,
        half_width: 150,
        half_height: 25,
        sprite: loader.loadImage("image/glass.png"),
        life: 300,
    },

    goalContainer:{
        type: "goal",
        name: "goalContainer",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1325,
        // x: 100,
        y: 900,
        width: 250,
        height: 100,
        shift_x: -40,
        shift_y: 0,
        sprite: loader.loadImage("image/bath.png"),
        life: 200,
    },

    beauty : {
        type:"beauty",
        name:"beauty",
        isStatic: 0,
        isTool:false,
        angle:0,//
        x:1500,
        y:850,
        width:100,
        height:500,
        shift_x:-150,
        shift_y:-300,
        sprite: loader.loadImage("image/girl.png"),
    },

    /////////////////////createWaterContainer/////////////////////////////////

    pipeOut:{
        type: "pipe",
        name: "pipeOut",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: -50,
        y: 20,
        width: 150,
        height: 300,
        shift_x:5,
        shift_y:205,
        sprite: loader.loadImage("image/input.png"),
        move: {x:0,y:2,max:30,min:-50,offset:0}
    },

    /////////////////////createRoom/////////////////////////////////
    floor: {
        type: "room",
        name: "floor001",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: canvas.width / 2,
        y: canvas.height-30,
        width: canvas.width,
        height: 50,
        // half_width: canvas.width/2,
        // half_height: 20,
    },
    wallR: {
        type: "room",
        name: "wallR",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: canvas.width,
        y: canvas.height / 2,
        width: 50,
        height: canvas.height,
        // half_width: 25,
        // half_height: canvas.height / 2,
    },
    wallL: {
        type: "room",
        name: "wallL",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 0,
        y: canvas.height * 4 / 5,
        width: 50,
        height: canvas.height / 2,
        // half_width: 25,
        // half_height: canvas.height * 4 / 5,
    },
    
    /////////////////////Obstacles/////////////////////////////////

    wheel001: {
        type:"wheel",
        name:"wheel001",
        isStatic: 0,
        isTool:false,
        angle:0,
        x:300,
        y:250,
        width:254,
        height:50,
        half_width:227,
        half_height:25,
        sprite: loader.loadImage("image/rotate.png")
    },

    wheel002 : {
        type:"wheel",
        name:"wheel002",
        isStatic: 0,
        isTool:false,
        angle:0,
        x:340,
        y:380,
        width:254,
        height:50,
        half_width:227,
        half_height:25,
        sprite: loader.loadImage("image/rotate.png")
    },

    wheel003 : {
        type:"wheel",
        name:"wheel003",
        isStatic: 0,
        isTool:false,
        angle:0,
        x:300,
        y:900,
        width:254,
        height:50,
        half_width:227,
        half_height:25,
        sprite: loader.loadImage("image/rotate.png")
    },


    
};

var level02SperateBoards = {
    wall001:{
        type: "wall",
        name: "wall001",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 365,
        y: 100,
        width: 30,
        height: 200,
        half_width:15,
        half_height:100,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall002:{
        type: "wall",
        name: "wall002",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 365,
        y: 650,
        width: 30,
        height: 400,
        half_width:15,
        half_height:200,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00201:{
        type: "wall",
        name: "wall00201",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 630,
        y: 300,
        width: 30,
        height: 600,
        half_width:15,
        half_height:300,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00202:{
        type: "wall",
        name: "wall00202",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 730,
        y: 1000,
        width: 100,
        height: 300,
        half_width:50,
        half_height:150,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00203:{
        type: "wall",
        name: "wall00203",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 830,
        y: 300,
        width: 30,
        height: 600,
        half_width:15,
        half_height:300,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00204:{
        type: "wall",
        name: "wall00204",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1250,
        y: 650,
        width: 30,
        height: 600,
        half_width:15,
        half_height:300,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00205:{
        type: "wall",
        name: "wall00205",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1290,
        y: -280,
        width: 30,
        height: 600,
        half_width:15,
        half_height:300,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00206:{
        type: "wall",
        name: "wall00206",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1600,
        y: -280,
        width: 30,
        height: 600,
        half_width:15,
        half_height:300,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00207:{
        type: "wall",
        name: "wall00207",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1290,
        y: 65,
        width: 30,
        height: 30,
        half_width:15,
        half_height:15,
        // sprite: loader.loadImage("image/.jpg")
    },
    wall00208:{
        type: "wall",
        name: "wall00208",
        isStatic: !0,
        isTool: false,
        angle: 0,
        x: 1600,
        y: 65,
        width: 30,
        height: 30,
        half_width:15,
        half_height:15,
        // sprite: loader.loadImage("image/.jpg")
    },

};

var definition = {
    density: 5.0,
    friction: 0.5,
    restitution: 0.3
};
