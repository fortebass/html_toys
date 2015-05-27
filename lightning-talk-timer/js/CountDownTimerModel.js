function CountDownTimerModel(){
    this.timeAlerts = null;
    this.restTime = null;
    this.currentColors = null;  
    this.currentBellOn = null;
    this.dataBase = null;
}
CountDownTimerModel.prototype = {
    loadData : function(func){
        if(this.dataBase){
            var that = this;
            var transaction = this.dataBase.transaction("timerSettings", "readonly");
            var store = transaction.objectStore("timerSettings");
            var request = store.get(1);
            request.onsuccess = function(e) {
                that.timeAlerts = e.target.result.data;
                if(func)
                    func(that.timeAlerts);
            };
            request.onerror = function(e){
                // console.log('Error get: '+e);
            };
        }
    },
    saveData : function(){
        if(this.dataBase){
            var trans = this.dataBase.transaction("timerSettings", "readwrite"),
                store = trans.objectStore("timerSettings"),
                request = store.get(1),
                cacheTimeCardsData = this.timeAlerts.slice(0);// copy alerts

            request.onsuccess = function(e){
                /* var requestResult = e.target.result; */
                e.target.result.data = cacheTimeCardsData;
                var request = store.put(e.target.result);
                /* console.log('Timer settings save!!'); */
            };
            request.onerror = function(e){
                /* console.log('Error adding: '+e);*/
            };
        }
    },
    getTimeCardItems : function(){
        return this.timeAlerts;
    },
    setAlerts : function(tAlerts) {
        var totalTime = tAlerts[0].time;
        this.restTime = { min :totalTime.min,
                          sec :totalTime.sec };
        this.timeAlerts = tAlerts;
    },
    getRestTime : function() {
        return this.restTime;//{min:0,sec:0}
    },
    countDown : function() {
        var time = this.restTime;
        if(time.sec>0)
            --time.sec;
        else if(time.min>0){
            --time.min;
            time.sec = 59;
        }else{
            time.min = 0;
            time.sec = 0;
        }
        return time;
    },
    isAlertRing : function() {
        var checkTime = this.restTime,
            alertItem,
            alertTimePoint;
        
        if(this.timeAlerts.length > 0){
            alertItem = this.timeAlerts[0];
            alertTimePoint = alertItem.time;
            if(checkTime.min == alertTimePoint.min &&
               checkTime.sec == alertTimePoint.sec){
                this.currentColors = alertItem.color;
                this.currentBellOn = alertItem.time.ringOn;
                this.timeAlerts.splice(0, 1);
                return true;
            }
        }
        return false;
    },
    islastOneMinute : function() {
        return this.restTime.min == 0;
    },
    isTimesUp : function() {
        return this.restTime.min == 0 && this.restTime.sec == 0;
    },
};
