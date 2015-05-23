


var models      = ["Hero_Idle", "Hero_Walk", "Hero_Run", "Hero_Jump_start"],
    modelColors = [0x0AE86E, 0xFF740E, 0xE83BC7, 0x00AAFF],
    currentModelIndex = 0,
    cacheGeometries = {},
    pathFragments = ["obj/hero/",".js"];

var camera, scene, animation;
var webglRenderer;

var cacheMesh;

var cameraDelta=0, prevTime = Date.now();

function initalizeWebgl(container) {
    var SCREEN_WIDTH = 300,//window.innerWidth
        SCREEN_HEIGHT = 300;//window.innerHeight

    camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000 );
    camera.position.z = 180;
    camera.position.y = 90;

    scene = new THREE.Scene();

    // LIGHTS

    var ambient = new THREE.AmbientLight( 0x221100 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set(0, 1, 1);
    scene.add( directionalLight );

    // RENDERER

    try {
        webglRenderer = new THREE.WebGLRenderer({ alpha: true });
        webglRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        webglRenderer.setClearColor( 0x000000, 0);
        webglRenderer.domElement.style.position = "relative";
        // webglRenderer.domElement.style.position = "absolute";

        webglRenderer.domElement.addEventListener("DOMMouseScroll", webglMouseWheelHandler);//FireFox
        webglRenderer.domElement.addEventListener("mousewheel", webglMouseWheelHandler);//Chrome
        webglRenderer.domElement.addEventListener("click", webglMouseClickHandler);
        container.appendChild( webglRenderer.domElement );
    }
    catch (e) {
    }

    for (var i = models.length - 1; i >= 0; i--) {
        loadModel(i);
    }

    //"Hero_Idle", "Hero_Walk", "Hero_Run", "Hero_Jump_start"
    reloadModel(currentModelIndex);

}

function loadModel (modelIndex) {
    var path = pathFragments[0].concat( models[modelIndex], pathFragments[1] );
    var loader = new THREE.JSONLoader( true );
    loader.load( path, function( geometry ) {
        cacheGeometries[modelIndex] = geometry;
    } ); 
}

function reloadModel (modelIndex) {
    if(cacheMesh)
        scene.remove(cacheMesh);

    var geometry = cacheGeometries[modelIndex];
    if (geometry) {
        cacheMesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: modelColors[modelIndex], morphTargets: true } ) );
        cacheMesh.scale.set( 10, 10, 10 );
        cacheMesh.position.y = -10;
        scene.add( cacheMesh );
        animation = new THREE.MorphAnimation( cacheMesh );
        animation.play();
    }
    else{
        var path = pathFragments[0].concat (models[modelIndex], pathFragments[1] );
        var loader = new THREE.JSONLoader( true );
        loader.load( path, function( geometry ) {
            cacheMesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: modelColors[modelIndex], morphTargets: true } ) );
            cacheMesh.scale.set( 10, 10, 10 );
            cacheMesh.position.y = -10;

            cacheMesh 
            scene.add( cacheMesh );

            animation = new THREE.MorphAnimation( cacheMesh );
            animation.play();

            cacheGeometries[modelIndex] = geometry;
        });   
    }

    // if(cacheMesh)
    //     scene.remove(cacheMesh);

    // var path = pathFragments[0].concat(models[modelIndex], pathFragments[1]);
    // var loader = new THREE.JSONLoader( true );
    // loader.load( path, function( geometry ) {

    //     var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xE83BC7, morphTargets: true } ) );
    //     mesh.scale.set( 10, 10, 10 );
    //     mesh.position.y = -10;
    //     scene.add( mesh );
    //     cacheMesh = mesh;

    //     animation = new THREE.MorphAnimation( mesh );
    //     animation.play();

    // } );
}

function webglMouseClickHandler (e) {
    currentModelIndex++;
    currentModelIndex = currentModelIndex % models.length;
    reloadModel(currentModelIndex);
}

function webglMouseWheelHandler (e) {
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    cameraDelta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    camera.position.x += cameraDelta;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    if(camera.position.x<=-200){ camera.position.x =-200; }
    else if(camera.position.x>= 200){ camera.position.x = 200; }
    else{ camera.position.x += cameraDelta*3; }

    camera.lookAt( scene.position );

    if ( animation ) {
        var time = Date.now();
        animation.update( time - prevTime );
        prevTime = time;
    }

    webglRenderer.render( scene, camera );
}

function initalizeGenie () {
    var genieContainerElement = document.getElementById( 'genie_container' );
    genieContainerElement.className = "genie_idle";
    initalizeWebgl(genieContainerElement);
}

initalizeGenie();

animate();
