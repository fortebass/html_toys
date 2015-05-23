var resultViewElement = document.getElementById("resultView"),
    previousRecordElement = document.getElementById("previousRecord"),
    resultViewInsertIndex = 0,
    calCollection = [],
    resultCollection = [],
    resultString = "",
    calState = {
        input : "input",
        operator : "operator",
        clear : "clear",
        calResult : "calResult",
        error : "error"
    },
    state = status.clear,
    operatorSymbol = {
        "/":"÷",
        "*":"×",
        "+":"+",
        "-":"-"
    };

var initial = function (){
    var numbers = document.getElementsByClassName("num"),
        zeros = document.getElementsByClassName("zero"),
        operators = document.getElementsByClassName("operator"),
        fpoints = document.getElementsByClassName("fpoint"),
        clears = document.getElementsByClassName("clear"),
        cleanChars = document.getElementsByClassName("cleanChar"),
        calResults = document.getElementsByClassName("calResult");

    for (var i = 0; i < numbers.length; i++) {
        numbers[i].onclick = function(e){
            var resultBlock;

            if(state == calState.calResult || state == calState.error){
                cleanResultView();
            }

            resultBlock = getResultBlockByInsertIndex(resultViewInsertIndex, calCollection, resultString);

            if(isInsertAfterZero(resultBlock.block, resultBlock.innerBlockIndex)){
                clearNumberofChar(1, resultViewInsertIndex);
            }
            insertResultValue(this.value, resultViewInsertIndex);

            updateResultView(calCollection);
            state = calState.input;
        };
    }

    zeros[0].onclick = function(e){
        var resultBlock,
            currentBlockValue;

        if(state == calState.calResult || state == calState.error){
            cleanResultView();
        }

        resultBlock = getResultBlockByInsertIndex(resultViewInsertIndex, calCollection, resultString);
        // currentBlockValue = resultBlock.block;
        
        if(canInputZero(resultBlock.block, resultBlock.innerBlockIndex)){
            insertResultValue(this.value, resultViewInsertIndex);
        }

        updateResultView(calCollection);
        state = calState.input;
    };

    for (var i = 0; i < operators.length; i++) {
        operators[i].onclick = function(e){
            if(state == calState.clear || state == calState.error)
                return ;

            if(state == calState.calResult){
                var cache = resultString;
                cleanResultView();
                resultString = cache;
                calCollection = splitAndDecorate(cache);
                // state = "input";
            }

            if(!canInsertOpertor(resultString, resultViewInsertIndex))
                clearNumberofChar(1, resultViewInsertIndex);
            
            insertResultValue(this.value, resultViewInsertIndex);
            
            updateResultView(calCollection);
            state = calState.operator;
        };
    }

    fpoints[0].onclick = function(e){
        var resultBlock,
            currentBlockValue;

        if(state == calState.calResult || state == calState.error){
            cleanResultView();
        }

        resultBlock = getResultBlockByInsertIndex(resultViewInsertIndex, calCollection, resultString);
        currentBlockValue = resultBlock.block;
        if(currentBlockValue.length == 0 || currentBlockValue in operatorSymbol){
            var generateFloatNumber = "0" + this.value;
            insertResultValue(generateFloatNumber, resultViewInsertIndex);
        }
        else if(!isContainFloat(currentBlockValue)){
            insertResultValue(this.value, resultViewInsertIndex);
        }
        
        updateResultView(calCollection);
        state = calState.input;
    };

    cleanChars[0].onclick = function(e){
        /*remove float point*/
        if(state == calState.error)
            return;

        if(state == calState.calResult){
            cleanResultRender(resultViewElement,previousRecordElement);
        }
        clearNumberofChar(1, resultViewInsertIndex);
        if(resultString.length == 0){
            updateResultView([]);
            state = calState.clear;
        }
        else{
            updateResultView(calCollection);
            state = calState.input;
        }
    };

    clears[0].onclick = function(e){
        cleanResultView();
    };

    calResults[0].onclick = function(e){
        if(resultString.length == 0){
            updateResultView([]);
            state = calState.clear;
            return ;
        }
        if(state == calState.error)
            return;

        // if(state == "input"){
        var previousString = resultString;
        var calResult;
        try{
            calResult = Function("", "return " + resultString + ";");
            resultString = "" + calResult();
            calCollection = splitAndDecorate(resultString);
            previousRecordElement.innerHTML = splitAndDecorate(previousString).join("");
            
            updateResultView(calCollection);
            addResultRender(resultViewElement, previousRecordElement);
            resultViewInsertIndex = 0;
            state = calState.calResult;
        }
        catch(e){
            resultString = "FORMAT ERROR";
            calCollection.length = 0;
            calCollection.push(resultString);
            previousRecordElement.innerHTML = resultString;

            updateResultView(calCollection);
            addResultRender(resultViewElement, previousRecordElement);
            resultViewInsertIndex = 0;
            state = calState.error;
            return ;
        }
        // }
        // else{
        //     cleanResultRender(resultViewElement,previousRecordElement);
        //     updateResultView(calCollection);

        //     resultViewInsertIndex = 0;
        //     state = "calResult";
        // }
    };

    resultViewElement.onclick = function(e){
        var caretPos;
        if(state == calState.error)
            return;

        caretPos = doGetCaretPosition(this);
        setResultViewInsertIndex(caretPos, resultString);
        state = calState.input;
    };
};

var canInputZero = function(numStr, strIdx){
    if(numStr.length > 0 && strIdx == 0)
        return false;
    
    if(isInsertAfterZero(numStr, strIdx))
        return false;

    return true;
};

var isInsertAfterZero = function(numStr, strIdx){
    return strIdx == 1 && numStr.charAt(0) == "0";
};

var getResultBlockByInsertIndex = function(insertIdx, calColl, resultStr){
    var blockIdx,
        indexCount = 0,
        caretIdx = resultStr.length - insertIdx,
        innerBlockIdx,
        currentBlock = "";

    for (blockIdx = 0; blockIdx < calColl.length; blockIdx++) {
        currentBlock = calColl[blockIdx];
        indexCount += currentBlock.length;
        if(indexCount >= caretIdx){
            innerBlockIdx = caretIdx - (indexCount - currentBlock.length);
            break;
        }
    };
    return {
                block : currentBlock,
                index : blockIdx,
                innerBlockIndex : innerBlockIdx
            };
};

var canInsertOpertor = function(resultString, resultViewInsertIndex){
    var checkChar, strIndex;
    if(resultString.length == 0)
        return false;

    strIndex = resultString.length - resultViewInsertIndex;
    checkChar = resultString.charAt(strIndex-1);
    if(checkChar in operatorSymbol || checkChar == ".")
        return false;

    return true;
};

var setResultViewInsertIndex = function(caretIdx, resultStr){
    var str = calCollection.join("").substr(0, caretIdx);
    var countComma = str.split(",").length - 1;
    resultViewInsertIndex = resultStr.length - (caretIdx - countComma);
};

var doGetCaretPosition = function(oField){
    var iCaretPos = 0;

    if (document.selection){
        // IE Support
        // Set focus on the element
        oField.focus ();
        // To get cursor position, get empty selection range
        var oSel = document.selection.createRange ();
        // Move selection start to 0 position
        oSel.moveStart ('character', -oField.value.length);
        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }
    else if (oField.selectionStart || oField.selectionStart == '0'){
        // Firefox support
        iCaretPos = oField.selectionStart;
    }
    // Return results
    return (iCaretPos);
};

var insertResultValue = function(inputValue, insertIndex){
    var currentPos = resultString.length - insertIndex;
    resultString = resultString.substr(0, currentPos) + inputValue + resultString.substr(currentPos, resultString.length);
    calCollection = splitAndDecorate(resultString);
};

var updateResultView = function(calCollection){
    resultViewElement.value =  calCollection.join("");
};

var clearNumberofChar = function(num, insertIndex){
    // resultString = resultString.slice(0,-1*num);
    var currentPos = resultString.length - insertIndex;
    resultString = resultString.substr(0, currentPos - num) + resultString.substr(currentPos, resultString.length);
    calCollection = splitAndDecorate(resultString);
};

var cleanResultView = function(){
    resultString = "";
    calCollection.length = 0;
    updateResultView(calCollection);
    
    cleanResultRender(resultViewElement,previousRecordElement);
    resultViewInsertIndex = 0;
    state = calState.clean; 
};

var cleanResultRender = function(view, preView){
    view.classList.remove('showResultState');
    view.classList.remove('slideFromBottom');

    preView.classList.remove('slideInvisibleFromBottom');
};

var addResultRender = function(view, preView){
    view.classList.add('showResultState');
    view.classList.add('slideFromBottom');

    preView.classList.add('slideInvisibleFromBottom');
    
};

var numberToString = function(num){
    var strTemp = '' + num;
    var strArr = strTemp.split('.');
    var intStr = strArr[0];
    var floatStr = strArr.length > 1 ? '.' + strArr[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(intStr)) {
       intStr = intStr.replace(rgx, '$1' + ',' + '$2');
    }
    return intStr + floatStr;
};

var splitAndDecorate = function (resultString){
    var collection = resultString.split(/([\d.]+)/),
        newCollection = [];
    for (var i = 0; i < collection.length; i++) {
        if(collection[i] == ""){

        }
        else if(collection[i].match(/([\d.]+)/)){
            collection[i] = numberToString(collection[i]);
        }
        else{
            var replaceStr = collection[i];
            var symbolChar;
            for (var strIdx = 0; strIdx < replaceStr.length; strIdx++) {
                symbolChar = replaceStr.charAt(strIdx);
                replaceStr = replaceStr.replace(symbolChar, operatorSymbol[symbolChar]);
            }
            collection[i] = replaceStr;
        }
    }
    for (var i = 0; i < collection.length; i++) {
        if(collection[i]!="")
            newCollection.push(collection[i]);
    };
    return newCollection;
};

var isContainFloat = function (checkStr) {
    var rgx = /([\d]*[.][\d]*)/;
    return rgx.test(checkStr);
};

initial();