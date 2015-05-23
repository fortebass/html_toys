var Utility = {
    swap : function(things, keys){
        var t = things[keys[0]];
        things[keys[0]] = things[keys[1]];
        things[keys[1]] = t;
    },
    compareTime : function(tbA, tbB){
        var deltaSec = (tbA.min - tbB.min)*60 + tbA.sec - tbB.sec;
        return (deltaSec == 0) ? 0 : (deltaSec > 0 ? 1 : -1);
    },
    subtractTime : function(t1, t2){
        return {min:t1.min-t2.min, sec:t1.sec-t2.sec};
    },
    subtractPoint : function(p1, p2){
        return {x:p1.x-p2.x, y:p1.y-p2.y};
    },
    shiftToDestinationByDelta : function (original, destination, delta) {//start, destination, delta, dir
        var dir    = (destination == original) ? 0 : ((destination > original)? 1 : -1),
            check = original + dir*delta;
        if(dir * (destination - check) > 0){
            original += dir*delta;
        }
        else{
            original = destination;
        }
        return original;
    },
    shiftByEaseFunction : function (t, original, destination) {
        return this.easeOutElastic(t, original, destination-original, 70);
    },
    // https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
    // t: current time, b: begInnIng value, c: change In value, d: duration
    // easeOutBack: function (t, b, c, d, s) {// ???? bug
    //     if (s == undefined) s = 1.70158;
    //     return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    // },
    // easeOutBounce: function (t, b, c, d) {// d:30
    //     if ((t/=d) < (1/2.75)) {
    //         return c*(7.5625*t*t) + b;
    //     } else if (t < (2/2.75)) {
    //         return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    //     } else if (t < (2.5/2.75)) {
    //         return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    //     } else {
    //         return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    //     }
    // },
    easeOutElastic: function (t, b, c, d) {// d:90
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
};