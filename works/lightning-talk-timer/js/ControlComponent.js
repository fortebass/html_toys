function ControlComponent(style, tController){
    this.timerController = tController;
    this.style = style;//suspend, stop, resume, countdown
    this.region = { x:40, y:40, r:40 };
    this.alpha = 1;//0.1
    this.drawCutShape = null;//function(ctx)
    this.animation = {
        initial : function(){}, //function()
        display : function(){}, //function()
        hidden  : function(){}  //function()
    };
    this.playAnim = this.animation.display;
    this.enable = true;
}
ControlComponent.prototype = {
    setRegion : function(reg){
        this.region = reg;
    },
    moveTo : function(dX, dY){
        this.region.x = dX;
        this.region.y = dY;
    },
    isInRegion : function(clickX, clickY){
        var distance = Math.sqrt(Math.pow((this.region.x-clickX), 2)+Math.pow((this.region.y-clickY), 2));
        // console.log(distance);
        return distance  < this.region.r;
    },
    triggerAction : function(){
        if(this.enable){
            this.timerController[this.style]();
            // console.log(this.style + " click :" + clickX +":"+ clickY);;
        }
    },    
    playDisplayAnim : function(){
        this.animation.initial();
        this.playAnim = this.animation.display;
    },
    playHiddenAnim : function(){
        this.playAnim = this.animation.hidden;
    },
    draw : function(ctx){
        ctx.fillStyle = "rgba(0, 0, 0, "+this.alpha+")";
        
        this.playAnim();

        ctx.beginPath();
        ctx.arc(this.region.x, this.region.y, this.region.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

       // ctx.globalCompositeOperation = "destination-out";
        this.drawCutShape(ctx);
       // ctx.globalCompositeOperation = "source-over";
    }
};