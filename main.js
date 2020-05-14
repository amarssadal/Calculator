//////////////////|DATA CALCULATOR
let dataCalculator = (function (){
    let calcsHolder;
    
    //::::::::::::|IMPORT DOMSTRINGS 
    let GVals = function () {
        return UIController.GVals();
    }
    
    //::::::::::::|REGEX FOR VALIDATE EACH NUMBER ENTERED
    let digitsRegx = /^([-*|.|\+*|\d+]|[\d]*)\d*?\.{0,1}?(\d+)$/g;
    let operRegx = /^[*%+-\/]$/g;

    //::::::::::::|FINAL CALCULATOR
    function finalCalculator () {
        let results = 0;
        let mathMaker;
        let arr = [...calcsHolder];
        let currPos = 1;
        
        //========|DEFINING THE MATHS CALCULATIONS
        mathMaker = {
            '%': function (x, y) { return parseFloat(x /100) },
            '*': function (x, y) { return parseFloat(x * y) },
            '/': function (x, y) { return parseFloat(x / y) },
            '+': function (x, y) { return parseFloat(x) + parseFloat(y) },
            '-': function (x, y) { return parseFloat(x - y) }
        }
        
        //========|IF POSITION COUNTER INSIDE RECUSION SHOULD PROCEED OR NOT
        let proceed = true;
        
        //========|FIRST RECURSIVE TO CONVERT %
        function firstPass(thisarr) {
            //----|TO HOLD TEMP ANS
            let ans = 0;
            //----|ESCAPE CLAUSE
            if (thisarr.indexOf('%') === -1) {
                return;
            }
            //----|CHECK AND PERFORM RELEVANT MATH AT CURRENT POSITION
            if (thisarr[currPos] === '%') {
                ans = mathMaker['%'](thisarr[currPos - 1]);
                thisarr.splice(currPos - 1, 2, ans, '*');
                proceed = false;
            } else {
                proceed = true;
            }
            //----|CHECK - PROCEED ONLY IF ARRAY HAS NOT CHANGED
            (proceed === true) ?currPos += 2 : currPos = 1;
            proceed = true;
            //----|RECURSIVE CALL
            firstPass(thisarr);
        }
        
        //========|CALL FIRST RECURSOR THEN RESET VARIABLES
        firstPass(arr);
        proceed = true, currPos = 1;
        console.log("POST FIRST PASS", arr);
        
        
        //========|SECOND RECURSIVE TO DO ALL * and /
        function secondPass(thisarr) {
            //----|TO HOLD TEMP ANS
            let ans = 0;
            //----|ESCAPE CLAUSE
            if (thisarr.indexOf('*') === -1 && thisarr.indexOf('/') === -1) {
                return;
            }
            //----|CHECK AND PERFORM RELEVANT MATH AT CURRENT POSITION
            if (thisarr[currPos] === '*' || thisarr[currPos] === '/') {
                if (thisarr[currPos] === '*') {
                    ans = mathMaker['*'](thisarr[currPos - 1], thisarr[currPos + 1]);
                    thisarr.splice(currPos - 1, 3, ans);
                    proceed = false;
                } else if(thisarr[currPos] === '/') {
                    ans = mathMaker['/'](thisarr[currPos - 1], thisarr[currPos + 1]);
                    thisarr.splice(currPos - 1, 3, ans);
                    proceed = false;
                } else {
                    proceed = true;
                }
            }
            //----|CHECK - PROCEED ONLY IF ARRAY HAS NOT CHANGED
            (proceed === true) ?currPos += 2 : currPos = 1;
            proceed = true;
            //----|RECURSIVE CALL
            secondPass(thisarr);
        }
        
        //========|CALL SECOND RECURSOR THEN RESET VARIABLES
        secondPass(arr);
        proceed = true, currPos = 1;
        console.log("POST SECOND PASS", arr);
        
        
        //========|THIRD RECURSIVE TO DO ALL + and -
        function thirdPass(thisarr) {
            //----|TO HOLD TEMP ANS
            let ans = 0;
            //----|ESCAPE CLAUSE
            if (thisarr.indexOf('+') === -1 && thisarr.indexOf('-') === -1) {
                return;
            }
            //----|CHECK AND PERFORM RELEVANT MATH AT CURRENT POSITION
            if (thisarr[currPos] === '+' || thisarr[currPos] === '-') {
                if (thisarr[currPos] === '+') {
                    ans = mathMaker['+'](thisarr[currPos - 1], thisarr[currPos + 1]);
                    thisarr.splice(currPos - 1, 3, ans);
                    proceed = false;
                } else if(thisarr[currPos] === '-') {
                    ans = mathMaker['-'](thisarr[currPos - 1], thisarr[currPos + 1]);
                    thisarr.splice(currPos - 1, 3, ans);
                    proceed = false;
                } else {
                    proceed = true;
                }
            }
            //----|CHECK - PROCEED ONLY IF ARRAY HAS NOT CHANGED
            (proceed === true) ?currPos += 2 : currPos = 1;
            proceed = true;
            //----|RECURSIVE CALL
            thirdPass(thisarr);
        }
        
        //========|CALL THIRD RECURSOR THEN RESET VARIABLES
        thirdPass(arr);
        console.log("POST THIRD PASS", arr);
        
        results = arr[0];
        if (results % 1 !== 0) {
            results = results.toFixed(2);
        }
        console.log(results);
        UIController.updateResults(results);
    }
    
    return {
        //========|UPDATE INTERNAL DATA HOLDER
        updateHold: function (calcs) {
            if(calcs.length === 1) {
                calcsHolder = calcs;
            } else if (calcs.length > 1) {
                calcsHolder = calcs.split('x');
            }
        },
        //========|UPDATE INTERNAL DATA HOLDER
        calculateFinal: function () {
            //----|ITERATE THROUGH THE INPUT ARRAY AND MAKE SURE NUMBERS ARE VALID
            for (let x = 0; x < calcsHolder.length; x++) {
                if (x % 2 === 0) {
                    let temp = calcsHolder[x].match(digitsRegx);
                    if (!temp) {
                        UIController.updateResults('INVALID');
                        return;
                    }
                } else {
                    let temp = calcsHolder[x].match(operRegx);
                    if (!temp) {
                        UIController.updateResults('INVALID');
                        return;
                    }
                }
            }
            //----|PROCEED TO CALCULATE THE FINAL OUTPUT
            finalCalculator();
        },

    }
    
})();


//////////////////|UI CONTROLLER
let UIController = (function () {
    let currentDisp, tempHolder = [];
    
    //::::::::::::|DOM STRINGS
    const DOMStrings = {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        0: '0',
        disp: '.disp',
        res: '.results'
    }
    
    
    //::::::::::::|VALID KEY PRESS VALUES
    const valOper = [ '%', '*', '/', '+', '-' ];
    const valKeys = [ '7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
    valCode = [27, 8];
    
    
    //::::::::::::|CURRENT DISPLAY VALUES
    currentRes = 0;
    currentDisp = [];
    
    return {
        //========|SEND STRINGS TO OTHERS
        GVals: function () {
            return { DOMStrings, valKeys, valCode, valOper, currentDisp };
        },
        //========|UPDATE DISPLAY
        updateDisplay: function (keyPress) {
            if (currentDisp.length < 28) {
                if (valKeys.indexOf(keyPress.key) !== -1 || keyPress.key === '.') {
                    tempHolder.push(keyPress.key);
                    currentDisp.push(keyPress.key);
                    console.log(tempHolder, currentDisp);
                } else if (valOper.indexOf(keyPress.key) !== -1) {
                    tempHolder.push('x');
                    tempHolder.push(keyPress.key);
                    tempHolder.push('x');
                    currentDisp.push(keyPress.key);
                    console.log(tempHolder, currentDisp);
                } else if (keyPress.key === "Backspace") {
                    if (tempHolder[tempHolder.length-1] === "x") {
                        currentDisp.pop();
                        tempHolder.pop();
                        tempHolder.pop();
                        tempHolder.pop();
                        console.log(tempHolder, currentDisp);
                    } else {
                        currentDisp.pop();
                        tempHolder.pop();
                        console.log(tempHolder, currentDisp);
                    }
                }
                document.querySelector(DOMStrings.disp).innerHTML = currentDisp.join('');
                dataCalculator.updateHold(tempHolder.join(''));
            }
        },
        //::::::::::::|UPDATE RESULTS
        updateResults: function updateResults (results) {
            document.querySelector(DOMStrings.res).innerHTML = results;
        },
        reInitialize: function () {
            document.querySelector(DOMStrings.disp).innerHTML = 0;
            UIController.updateResults(0);
            currentDisp = [];
            tempHolder = [];
        }
    }
    
})();


//////////////////|MAIN CONTROLLER
let mainController = (function(dataCalc, UICtrlr) {
    
    
    //::::::::::::|IMPORT STRINGS 
    let GVals = function () {
        return UICtrlr.GVals();
    }
    
    
    //::::::::::::|EVENT LISTENERS 
    var eventListeners = function () {
        let tempOper = 0, tempDec = 0, currpos = 0;
        //========|KEY PRESS DETECTION
        document.addEventListener("keydown", e => {
            if (GVals().valKeys.indexOf(e.key) !== -1) {
                tempOper = 0;
                currpos += 1;
                updateFirst(e);
            } else if (GVals().valOper.indexOf(e.key) !== -1 && tempOper === 0) {
                tempOper += 1, tempDec = 0;
                currpos += 1;
                updateFirst(e);
            } else if (e.key === '.' && tempDec === 0) {
                tempDec += 1;
                currpos += 1;
                updateFirst(e);
            } else if (e.keyCode === 13) { // ENTER KEY
                tempOper = 0;
                updateSecond();
            } else if (e.key === "Escape") { // ESCAPE KEY
                tempOper = 0, tempDec = 0;
                re_initialise();
                console.log("Esc");
            } else if (e.key === "Backspace") { // BACKSPACE KEY
                updateFirst(e);
                console.log("Backspace");
            }
        });        
    }
    
    
    //::::::::::::|UPDATE DISPLAY ONLY & DATA STRUCTURE
    function updateFirst (keyPress) {
        UICtrlr.updateDisplay(keyPress);
    }
    
    
    //::::::::::::|UPDATE RESULT ONLY & DATA STRUCTURE << IF ENTER IS PRESSED
     function updateSecond (keyPress) {
         dataCalc.calculateFinal();
    }
    
    
    //::::::::::::|INITIALISE APP 
    function initialise() {
        eventListeners();
    }
    
    
    //::::::::::::|RE-INITIALISE APP 
    function re_initialise() {
        UICtrlr.reInitialize();
        dataCalc.updateHold(0);        
    }
    
    
    return {
        
        //========|RETURN INIT TO BE CALLED FROM PAGE
        init: function () {
            GVals();
            initialise();
            console.log("App Initialised");
        }
    }
    
})(dataCalculator, UIController);

mainController.init();