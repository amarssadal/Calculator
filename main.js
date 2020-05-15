//////////////////|DATA CALCULATOR
let dataCalculator = (function (){
    let calcsHolder;
    
    //::::::::::::|IMPORT DOMSTRINGS 
    let GVals = function () {
        return UIController.GVals();
    }
    
    //::::::::::::|REGEX FOR VALIDATING EACH SET OF NUMBER ENTERED
    let digitsRegx = /^([-*|.|\+*|\d+]|[\d]*)\d*?\.{0,1}?(\d+)$/g;
    let operRegx = /^[*%+-\/]$/g;

    //::::::::::::|ADD PUNCTUATIONS
    function addPunc(num) {
        //========|IF CONVERT TO STRING IF NOT SO
        if (typeof num !== 'string') { num = num.toString() };

        let dotPos, partA, partB, res = [], str;
        //========|CHECK IF DECIMAL EXISTS
        dotPos = num.indexOf('.');
        
        //========|IF DECIMAL EXISTS BREAKDOWN INTO TWO
        if (dotPos !== -1) {
            partA = num.slice(0, dotPos);
            partB = num.slice(dotPos+1, num.length);
            str = partA.split('');
        } else {
            str = num.split('');
        }
    
        //========|IF PRE DECIMAL LENGTH IS LESS THAN THREE RETURN AS IS
        if (str.length <= 3) { return num; }
        console.log("happening");
        let count = 0;
        for (let n = str.length-1; n > -1; n--) {
            if (count === 3) {
                if (n === 0 & str[0] === '-') {
                    res.unshift(str[n]);
                    count = 0;
                } else {
                    res.unshift(',');
                    res.unshift(str[n]);
                    count = 0;
                }
            } else {
                res.unshift(str[n]);
            }
            count += 1;
        }
        if (dotPos !== -1) {
            return res.join('').concat('.').concat(partB);
        }
        return (res.join(''));
    }

    //::::::::::::|FINAL CALCULATOR
    function finalCalculator () {
        if (calcsHolder.length === 2) {
            if (calcsHolder[0] === '-') {
                return calcsHolder.join('');
            }
        }
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
        UIController.updateResults(addPunc(results));
    }
    
    return {
        //========|UPDATE INTERNAL DATA HOLDER
        updateHold: function (calcs) {
            console.log(calcs);
            if(calcs.length === 1) {
                calcsHolder = calcs;
            } else if (calcs.length > 1) {
                calcsHolder = calcs.split('x');
            }
        },
        //========|UPDATE INTERNAL DATA HOLDER
        calculateFinal: function () {
            //----|ITERATE THROUGH THE INPUT ARRAY AND MAKE SURE NUMBERS ARE VALID
            if (!calcsHolder) { return; }
            for (let x = 0; x < calcsHolder.length; x++) {
                if (x % 2 === 0) {
                    let temp = calcsHolder[x].match(digitsRegx);
                    console.log(temp);
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
    
    
    //::::::::::::|CURRENT DISPLAY VALUES
    currentRes = 0;
    currentDisp = [];
    
    return {
        //========|SEND STRINGS TO OTHERS
        GVals: function () {
            return { DOMStrings, valKeys, valOper, currentDisp };
        },
        //========|UPDATE DISPLAY
        updateDisplay: function (keyPress) {
            if (currentDisp.length < 16) {
                if (valKeys.indexOf(keyPress) !== -1 || keyPress === '.') {
                    tempHolder.push(keyPress);
                    currentDisp.push(keyPress);
                } else if (valOper.indexOf(keyPress) !== -1) {
                    console.log("tehmpholder", tempHolder);
                    if (tempHolder.length === 0 && keyPress === '-') {
                            tempHolder.push(keyPress);
                            currentDisp.push(keyPress);
                    } else if (tempHolder.length >= 1) {
                        tempHolder.push('x');
                        tempHolder.push(keyPress);
                        tempHolder.push('x');
                        currentDisp.push(keyPress);
                    }
                } else if (keyPress === "Backspace") {
                    if (tempHolder[tempHolder.length-1] === "x") {
                        currentDisp.pop();
                        tempHolder.pop();
                        tempHolder.pop();
                        tempHolder.pop();
                    } else {
                        currentDisp.pop();
                        tempHolder.pop();
                    }
                } else {
                    currentDisp = 0;
                    tempHolder = [];
                }
            } else {
                if (keyPress === "Backspace") {
                    if (tempHolder[tempHolder.length-1] === "x") {
                        currentDisp.pop();
                        tempHolder.pop();
                        tempHolder.pop();
                        tempHolder.pop();
                    } else {
                        currentDisp.pop();
                        tempHolder.pop();
                    }
                }
            }
            if (currentDisp === 0) {
                document.querySelector(DOMStrings.disp).innerHTML = 0;
                dataCalculator.updateHold(tempHolder);
            } else {
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
        let tempOper = 0, tempDec = 0, currpos = 0; currKey = 0;
        //========|KEY PRESS DETECTION
        document.addEventListener("keydown", e => {
            currKey = e.key;
            if (GVals().valKeys.indexOf(currKey) !== -1) {
                tempOper = 0;
                currpos += 1;
                updateFirst(currKey);
            } else if (GVals().valOper.indexOf(currKey) !== -1 && tempOper === 0) {
                tempOper += 1, tempDec = 0;
                currpos += 1;
                updateFirst(currKey);
            } else if (currKey === '.' && tempDec === 0) {
                tempDec += 1;
                currpos += 1;
                updateFirst(currKey);
            } else if (currKey === 'Enter') { // ENTER KEY
                tempOper = 0;
                updateSecond();
            } else if (currKey === "Escape") { // ESCAPE KEY
                tempOper = 0, tempDec = 0;
                re_initialise();
            } else if (currKey === "Backspace") { // BACKSPACE KEY
                updateFirst(currKey);
            }
        })
        
        document.querySelector('.one').addEventListener('click', () => updateFirst('1'));
        document.querySelector('.two').addEventListener('click', () => updateFirst('2'));
        document.querySelector('.three').addEventListener('click', () => updateFirst('3'));
        document.querySelector('.four').addEventListener('click', () => updateFirst('4'));
        document.querySelector('.five').addEventListener('click', () => updateFirst('5'));
        document.querySelector('.six').addEventListener('click', () => updateFirst('6'));
        document.querySelector('.seven').addEventListener('click', () => updateFirst('7'));
        document.querySelector('.eight').addEventListener('click', () => updateFirst('8'));
        document.querySelector('.nine').addEventListener('click', () => updateFirst('9'));
        document.querySelector('.zero').addEventListener('click', () => updateFirst('0'));
        document.querySelector('.perc').addEventListener('click', () => updateFirst('%'));
        document.querySelector('.divi').addEventListener('click', () => updateFirst('/'));
        document.querySelector('.mult').addEventListener('click', () => updateFirst('*'));
        document.querySelector('.minu').addEventListener('click', () => updateFirst('-'));
        document.querySelector('.plus').addEventListener('click', () => updateFirst('+'));
        document.querySelector('.ente').addEventListener('click', () => updateSecond());
        document.querySelector('.esca').addEventListener('click', () => re_initialise());
        document.querySelector('.back').addEventListener('click', () => updateFirst('Backspace'));
    }
    
    function buttonBlinkers(affector, blinkMake) {
        document.querySelector(affector).classList.add(blinkMake);
        setTimeout(function () {
            document.querySelector(affector).classList.remove(blinkMake);
        }, 100)
    }

    //::::::::::::|UPDATE DISPLAY ONLY & DATA STRUCTURE
    function updateFirst (keyPress) {
        //FOR BLINK EFFECT
        let affector, blinkMake;
        switch (keyPress) {
            case '1':
                affector = '.one';
                blinkMake = 'blinkNumber';
                break;
            case '2':
                affector = '.two';
                blinkMake = 'blinkNumber';
                break;
            case '3':
                affector = '.three';
                blinkMake = 'blinkNumber';
                break;
            case '4':
                affector = '.four';
                blinkMake = 'blinkNumber';
                break;
            case '5':
                affector = '.five';
                blinkMake = 'blinkNumber';
                break;
            case '6':
                affector = '.six';
                blinkMake = 'blinkNumber';
                break;
            case '7':
                affector = '.seven';
                blinkMake = 'blinkNumber';
                break;
            case '8':
                affector = '.eight';
                blinkMake = 'blinkNumber';
                break;
            case '9':
                affector = '.nine';
                blinkMake = 'blinkNumber';
                break;
            case '0':
                affector = '.zero';
                blinkMake = 'blinkNumber';
                break;
            case '%':
                affector = '.perc';
                blinkMake = 'blinkOperator';
                break;
            case '/':
                affector = '.divi';
                blinkMake = 'blinkOperator';
                break;
            case '*':
                affector = '.mult';
                blinkMake = 'blinkOperator';
                break;
            case '-':
                affector = '.minu';
                blinkMake = 'blinkOperator';
                break;
            case '+':
                affector = '.plus';
                blinkMake = 'blinkOperator';
                break;
            case 'Backspace':
                affector = '.back';
                blinkMake = 'blinkOperator';
                break;
            case '.':
                affector = '.deci';
                blinkMake = 'blinkOperator';
                break;
        }

        buttonBlinkers(affector, blinkMake);
        UICtrlr.updateDisplay(keyPress);
    }
    
    
    //::::::::::::|UPDATE RESULT ONLY & DATA STRUCTURE << IF ENTER IS PRESSED
     function updateSecond (keyPress) {
         buttonBlinkers('.ente', 'blinkOperator');
         dataCalc.calculateFinal();
    }
    
    
    //::::::::::::|INITIALISE APP
    function initialise() {
        eventListeners();
    }
    
    
    //::::::::::::|RE-INITIALISE APP 
    function re_initialise() {
        buttonBlinkers('.esca', 'blinkOperator');
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