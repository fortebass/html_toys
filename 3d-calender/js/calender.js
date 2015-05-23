var theDayElement = document.getElementById("the_day"),
    theDayMonElement = document.getElementById("the_day_month"),
    theDayYearElement = document.getElementById("the_day_year"),
    currentMonthSelectionElement = document.getElementById("month_selection"),
    currentMonthContainerElement = document.getElementById("month_container"),
    prevoiusMonthSelectionElement = document.getElementById("prevoius_month_selection"),
    prevoiusMonthContainerElement = document.getElementById("prevoius_month_container"),
    nextMonthSelectionElement = document.getElementById("next_month_selection"),
    nextMonthContainerElement = document.getElementById("next_month_container"),
    theTaskContainerElement = document.getElementById("the_task_container"),
    theTaskDescElement = document.getElementById("the_task_desc"),
    normalTag = document.getElementById("normal_tag"),
    mediumTag = document.getElementById("medium_tag"),
    emergencyTag = document.getElementById("emergency_tag"),
    addTaskButton = document.getElementById("add_task_button"),
    theOtherDayElement = document.getElementById("the_other_days");

var currentDate = new Date(),
    currentEditTask = {
        dateStr:"",
        month:currentDate.getMonth(),
        day:currentDate.getDate(),
        id:0,
        level:1,
        desc:"ddddd"
    },
    thisYear = currentDate.getFullYear(),
    monthMap = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    taskLevel = ["normal_lv", "medium_lv","emergency_lv"],
    tasks = {
        "2014_7_11":[
            {id:"001",level:0,desc:"2014_7_11"},
            {id:"002",level:0,desc:"2014_7_11test2!!"},
            {id:"003",level:1,desc:"2014_7_11test3!!"},
            {id:"004",level:2,desc:"2014_7_11test4!!"},
        ],
        "2014_8_11":[
            {id:"001",level:0,desc:"2014_8_11test1!!"},
            {id:"003",level:0,desc:"2014_8_11test2!!"},
            {id:"002",level:1,desc:"2014_8_11test3!!"},
            {id:"004",level:2,desc:"2014_8_11test4!!"},
        ],
        "2014_8_25":[
            {id:"001",level:0,desc:"2014_8_13test1!!"},
            {id:"004",level:0,desc:"2014_8_13test2!!"},
            {id:"002",level:1,desc:"2014_8_13test3!!"},
            {id:"003",level:2,desc:"teamD 擔任高雄巴豆妖粉絲團一日版主"},
        ],
        "2014_8_26":[
            {id:"003",level:0,desc:"整合事件溫度計"},
            {id:"004",level:1,desc:"小豆變小編"},
            {id:"001",level:2,desc:"teamA 擔任高雄巴豆妖粉絲團一日版主"},
        ],
        "2014_8_27":[
            {id:"001",level:2,desc:"teamC 擔任高雄巴豆妖粉絲團一日版主"},
        ],
        "2014_8_29":[
            {id:"002",level:0,desc:"2014_8_29test1!!"},
            {id:"003",level:0,desc:"2014_8_29test2!!"},
            {id:"004",level:1,desc:"2014_8_29test3ss!!"},
            {id:"001",level:2,desc:"2014_8_29test4!!"},
        ],
        "2014_9_1":[
            {id:"001",level:0,desc:"2014_8_29test1!!"},
            {id:"002",level:0,desc:"2014_8_29test2!!"},
            {id:"003",level:1,desc:"2014_8_29test3ss!!"},
            {id:"004",level:2,desc:"系統死命整合"},
        ],
        "2014_9_2":[
            {id:"001",level:0,desc:"2014_9_13test1!!"},
            {id:"002",level:0,desc:"2014_9_13test2!!"},
            {id:"004",level:2,desc:"Demo 很恐怖不要問!!"},
        ],
    };
    

function updateMonth(monthNum){
    var previousMonthNum = monthNum-1;
    prevoiusMonthSelectionElement.setAttribute("data_month",monthMap[previousMonthNum]);
    prevoiusMonthContainerElement.innerHTML = "";

    currentMonthSelectionElement.setAttribute("data_month",monthMap[monthNum]);
    currentMonthContainerElement.innerHTML = "";

    var nextMonthNum = monthNum+1;
    nextMonthSelectionElement.setAttribute("data_month",monthMap[nextMonthNum]);
    nextMonthContainerElement.innerHTML = "";
    
    var prevoiusmonthDay = new Date(thisYear,previousMonthNum+1,0).getDate();
    for (var dayKey = 1; dayKey <= prevoiusmonthDay; dayKey++) {
        createDayTo(prevoiusMonthContainerElement, dayKey, previousMonthNum, thisYear);
    };

    var monthDay = new Date(thisYear,monthNum+1,0).getDate();
    for (var dayKey = 1; dayKey <= monthDay; dayKey++) {
        createDayTo(currentMonthContainerElement, dayKey, monthNum, thisYear);
    };

    var nextmonthDay = new Date(thisYear,nextMonthNum+1,0).getDate();
    for (var dayKey = 1; dayKey <= nextmonthDay; dayKey++) {
        createDayTo(nextMonthContainerElement, dayKey, nextMonthNum, thisYear);
    };

}

/*
  create div day class
 */
function createDayTo(monthElement, dayNum, monthNum, yearNum){
    var dayKey = yearNum+"_"+(monthNum+1)+"_"+dayNum,
        dayDiv = document.createElement("div");

    dayDiv.id = dayKey;

    if(currentDate.getMonth() == monthNum && currentDate.getDate() == dayNum){
        dayDiv.className = "day today";
    }
    else{
        dayDiv.className = "day";
    }

    // day_no
    var dayNoDiv = document.createElement("div");
    dayNoDiv.className = "day_no";
    dayNoDiv.appendChild(document.createTextNode(dayNum));
    dayDiv.appendChild(dayNoDiv);

    // day_container
    createTaskTo(dayDiv, dayKey);

    dayDiv.addEventListener("mouseover", function (e){
        var dayElement = this;
        var theDayTasks = tasks[dayElement.id];
        if(theDayTasks){
            var thermometerValue = 0;
            for (var i = theDayTasks.length - 1; i >= 0; i--) {
                thermometerValue += (theDayTasks[i].level*2+1);
            };
            thermometer(10, thermometerValue>=10?10:thermometerValue );
        }
        else{
            thermometer(10,0);
        }
    });

    dayDiv.addEventListener("click", function (e){
        var dayElement = this;
        updateTheDayTaskPage(dayElement.id);
    });

    monthElement.appendChild(dayDiv);

}

function createTaskTo(dayElement, dayKey){
    var dayContainer = document.createElement("div"),
        theDayTasks = tasks[dayKey];
    dayContainer.className = "day_container";
    if(theDayTasks){
        for (var i = 0; i < theDayTasks.length; i++) {
            var task = theDayTasks[i],
                taskDiv = document.createElement("span");
            taskDiv.className = "taskSign "+taskLevel[task.level];
            taskDiv.appendChild(document.createTextNode(""));
            dayContainer.appendChild(taskDiv);
        }
    }

    dayElement.appendChild(dayContainer);
}

function createOtherDayTo(theOtherDayElement, otherDayNum, monthNum, yearNum){
    var dayKey = yearNum+"_"+(monthNum+1)+"_"+otherDayNum,
        dayDiv = document.createElement("div");

    dayDiv.id = "otherday-"+dayKey;
    dayDiv.className = "day";

    // day_no
    var dayNoDiv = document.createElement("div");
    dayNoDiv.className = "day_no";
    dayNoDiv.appendChild(document.createTextNode(otherDayNum));
    dayDiv.appendChild(dayNoDiv);

    // day_container
    createTaskTo(dayDiv, dayKey);

    dayDiv.addEventListener("click",function(){
        var dayElement = this,
            taskKey = (dayElement.id).split("-");
        updateTheDayTaskPage(taskKey[1]);
    });

    theOtherDayElement.appendChild(dayDiv);
}

function updateTheDayTaskPage (dayIdStr) {
    theTaskContainerElement.innerHTML = "";
    theOtherDayElement.innerHTML = "";

    var dayInterval = 3;
    var dayData = dayIdStr.split("_"),
        day = parseInt(dayData[2]),
        dateMonth = parseInt(dayData[1])-1;
    theDayElement.textContent = day;
    theDayMonElement.textContent = monthMap[dateMonth];
    theDayYearElement.textContent = thisYear;

    currentEditTask.month = dateMonth;
    currentEditTask.day = day;
    currentEditTask.dateStr = dayIdStr;

    var theDayTasks = tasks[dayIdStr];
    if(theDayTasks){
        for (var idx = 0; idx < theDayTasks.length; idx++) {
            var task = theDayTasks[idx],
                taskDiv = document.createElement("div");
                // ,taskLevelDiv = document.createElement("div")
                // ,taskDescDiv = document.createElement("div");
            
            taskDiv.id = task.id;
            taskDiv.className = "task "+taskLevel[task.level];
            taskDiv.appendChild(document.createTextNode(task.desc));
            // taskDiv.className = "task";

            // taskLevelDiv.className = "taskSign "+taskLevel[task.level];
            // taskDescDiv.className ="task_list_desc";
            // taskDescDiv.appendChild(document.createTextNode(task.desc));

            // taskDiv.appendChild(taskLevelDiv);
            // taskDiv.appendChild(taskDescDiv);

            var check = document.createElement("a");
            check.appendChild(document.createTextNode("　"));
            check.setAttribute("class", "task_check");
            check.addEventListener("click", deleteTheTask);

            taskDiv.appendChild(check);
            taskDiv.addEventListener("click",updateTheDayTaskElement,false);
            taskDiv.addEventListener("mouseover", doneHover, false);
            taskDiv.addEventListener("mouseout", doneLoseHover, false);
            theTaskContainerElement.appendChild(taskDiv);
        }
    }

    var otherDay = day,
        otherMonth = dateMonth;
    for (var dayoffest = -dayInterval, otherDay = day-dayInterval; dayoffest < 0; dayoffest++, otherDay++) {
        var correctDate = new Date(thisYear,otherMonth,otherDay);
        createOtherDayTo(theOtherDayElement, correctDate.getDate(), correctDate.getMonth(), thisYear);
    };

    for (var dayoffest = 1, otherDay = day+1; dayoffest <= dayInterval; dayoffest++, otherDay++) {
        var correctDate = new Date(thisYear,otherMonth,otherDay);
        createOtherDayTo(theOtherDayElement, correctDate.getDate(), correctDate.getMonth(), thisYear);
    };
}

function deleteTheTask (e) {
    e.stopPropagation();
    var doneId = this.parentNode.id;
    
    var theDayTasks = tasks[currentEditTask.dateStr];
    if(theDayTasks){
        for (var idx = 0; idx < theDayTasks.length; idx++) {
            var task = theDayTasks[idx];
            if(task.id == doneId){
                theDayTasks.splice(idx, 1);

                updateMonth(currentEditTask.month);
                updateTheDayTaskPage(currentEditTask.dateStr);
                break;
            }
        }
    }
}

function doneLoseHover (e) {
    var check = this.getElementsByClassName("task_check")[0];
    check.setAttribute("class","task_check");
}

function doneHover (e) {
    var check = this.getElementsByClassName("task_check")[0];
    check.setAttribute("class","task_check hold_task_check");
}

function updateTheDayTaskElement(e){
    e.preventDefault();
    // save previous task info
    var previousTheDayTasks = tasks[currentEditTask.dateStr];
    if(previousTheDayTasks){
        for (var i = 0; i < previousTheDayTasks.length; i++) {
            var preTask = previousTheDayTasks[i];
            if(preTask.id == currentEditTask.id){
                preTask.level = currentEditTask.level;
                preTask.desc = theTaskDescElement.value;
                break;
            }
        };

        previousTheDayTasks.sort(function(a, b){
            if(a.level > b.level)
                return 1;
            else if(a.level < b.level)
                return -1;

            return 0;
        });

        updateMonth(currentEditTask.month);
        updateTheDayTaskPage(currentEditTask.dateStr);
    }

    // load select task info
    var taskElement = this;
    currentEditTask.id = taskElement.id;
    var theDayTasks = tasks[currentEditTask.dateStr];
    for (var i = 0; i < theDayTasks.length; i++) {
        var currTask = theDayTasks[i];
        if(currTask.id == taskElement.id){
            theTaskDescElement.value = currTask.desc;
            currentEditTask.level = currTask.level;
            currentEditTask.desc = currTask.desc;
            return;
        }
    };
}

function addTheDayTask () {
    var newID = (new Date()).valueOf().toString();
    currentEditTask.id=newID;
    currentEditTask.desc = theTaskDescElement.value;

    var theDayTasks = tasks[currentEditTask.dateStr];
    if(theDayTasks){
        theDayTasks.push({
            id:currentEditTask.id,
            level:currentEditTask.level,
            desc:currentEditTask.desc
        });

        theDayTasks.sort(function(a, b){
            if(a.level > b.level)
                return 1;
            else if(a.level < b.level)
                return -1;

            return 0;
        });
    }
    else{
        tasks[currentEditTask.dateStr] = [{
            id:currentEditTask.id,
            level:currentEditTask.level,
            desc:currentEditTask.desc
        }];
    }

    updateMonth(currentEditTask.month);
    updateTheDayTaskPage(currentEditTask.dateStr);
}

function initializeCalender (month) {
    updateMonth((month%12)-1);
    currentEditTask.month = currentDate.getMonth();
    currentEditTask.day = currentDate.getDate();

    addTaskButton.addEventListener("click", addTheDayTask);
    normalTag.addEventListener("click", function () { currentEditTask.level = 0; });
    mediumTag.addEventListener("click", function () { currentEditTask.level = 1; });
    emergencyTag.addEventListener("click", function () { currentEditTask.level = 2; });
    
}


initializeCalender(8);
