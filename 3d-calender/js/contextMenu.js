// Demo by http://creative-punch.net
var genieYoHoReloadModel = reloadModel,//genieYoHo reloadModel function
    genieYoHoCamera = camera;
var genieContainerElement = document.getElementById( 'genie_container' ),
    geineMotionInterval;

var circularMenuElement = document.getElementById("circular_menu"),
    circleElement = document.getElementById("circle");

function registerCircleLinkItems () {
    var circleLinkItems = document.querySelectorAll('#circle a');

    for (var i = 0, l = 6; i < circleLinkItems.length; i++) {
        circleLinkItems[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
        circleLinkItems[i].style.top =  (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
    }

    circleLinkItems[0].addEventListener("click", (function (modelIdx) {
        return function (e){
            e.preventDefault();
            circleElement.classList.remove("open");

            if(geineMotionInterval){
                
                // genieYoHoCamera.position.x += cameraDelta*0.5;
                clearInterval(geineMotionInterval);
                geineMotionInterval = undefined;
            }
            
            genieContainerElement.classList.remove("genie_motion");
            cameraDelta = -1;
            genieYoHoCamera.position.x += cameraDelta*0.5;
            genieYoHoReloadModel(modelIdx);
        };
    })(0));

    circleLinkItems[1].addEventListener("click", (function (modelIdx) {
        return function (e){
            e.preventDefault();
            circleElement.classList.remove("open");

            if(geineMotionInterval){
                // genieContainerElement.classList.remove("genie_motion");
                clearInterval(geineMotionInterval);
                geineMotionInterval = undefined;
            }
            geineMotionInterval = setInterval(function(){
                genieContainerElement.classList.toggle("genie_motion");
                cameraDelta = (cameraDelta <= 0)?1:-1;
                genieYoHoCamera.position.x += (cameraDelta*0.5);
            }, 5000);
            
            genieContainerElement.classList.toggle("genie_motion");
            cameraDelta = (cameraDelta <= 0)?1:-1;
            genieYoHoCamera.position.x += (cameraDelta*0.5);
            genieYoHoReloadModel(modelIdx);
        };
    })(1));

     circleLinkItems[2].addEventListener("click", (function (modelIdx) {
        return function (e){
            e.preventDefault();
            circleElement.classList.remove("open");

            if(geineMotionInterval){
                // genieContainerElement.classList.remove("genie_motion");
                clearInterval(geineMotionInterval);
                geineMotionInterval = undefined;
            }
            geineMotionInterval = setInterval(function(){
                genieContainerElement.classList.toggle("genie_motion");
                cameraDelta = (cameraDelta <= 0)?1:-1;
                genieYoHoCamera.position.x += cameraDelta;
            }, 5000);
            
            genieContainerElement.classList.toggle("genie_motion");
            cameraDelta = (cameraDelta <= 0)?1:-1;
            genieYoHoCamera.position.x += cameraDelta;
            genieYoHoReloadModel(modelIdx);
        };
    })(2));
    
    circleLinkItems[3].addEventListener("click", (function (modelIdx) {
        return function (e){
            e.preventDefault();
            circleElement.classList.remove("open");

            if(geineMotionInterval){
                
                // genieYoHoCamera.position.x += cameraDelta*0.5;
                clearInterval(geineMotionInterval);
                geineMotionInterval = undefined;
            }
            
            genieContainerElement.classList.remove("genie_motion");
            cameraDelta = -1;
            genieYoHoCamera.position.x += cameraDelta*0.5;
            genieYoHoReloadModel(modelIdx);
        };
    })(3));

}

function overwriteContextMenu () {
    document.oncontextmenu = function (e) {
        if (e && e.stopPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }// else{ e = window.event; e.returnValue = false; e.cancelBubble = true; }

        circularMenuElement.style.top = (e.pageY - 125) + "px";
        circularMenuElement.style.left = (e.pageX - 125) + "px";
        circleElement.classList.remove("open");

        setTimeout(function(){circleElement.classList.add("open");}, 200);
    };
}

function initializeContextMenu () {
    overwriteContextMenu();
    registerCircleLinkItems();
}

initializeContextMenu();
