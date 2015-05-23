
function thermometer(goalAmount, progressAmount) {
    var thermo = document.getElementById("thermometer");
    var percentageAmount =  Math.min( Math.round(progressAmount / goalAmount * 1000) / 10, 100); //make sure we have 1 decimal point
    
    //let's set the progress indicator
    // Without animation
    var progress = document.getElementById("thermometer_progress");
    var btn = document.getElementById("thermometer_btn");
    if(progress && btn) {
        progress.style.height = percentageAmount + "%";
        if(percentageAmount>=80){
            progress.style.background = "#FA5882";
            btn.style.background = "#FA5882";
        }
        else if ((percentageAmount<80) && (percentageAmount>=50)){
            progress.style.background = "#DBA901";  
            btn.style.background = "#DBA901";  
        }
        else if ((percentageAmount<50) && (percentageAmount>=30)){
            progress.style.background = "#b1bb1e";
            btn.style.background = "#b1bb1e";    
        }    
        else{
            progress.style.background = "#81BEF7";
            btn.style.background = "#81BEF7";
        }
    }
}