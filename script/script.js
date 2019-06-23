"use-strict"

const calcDisplay = document.querySelector("div.display");          // Calculator Display
const calcInput =   document.querySelector("input.input");          // Calculator Input
const calcKeypad =  document.querySelector("div.keypad");           // Calculator Controls/Keypad
const buttons =     document.querySelectorAll("div.keypad button"); // Calculator Keypad Buttons
const calcLog =     document.getElementById("calcLog");             // Calculator Log 
const calcLogList = document.querySelector("div#calcLog ol");       // Calculator Log Ordered List

window.addEventListener("keydown", (e) => { 
    e.preventDefault(); // prevent non-numeric input
    if ( e.code === "Space" && e.target.nodeName === "BUTTON" ) return;
    else if ( !isNaN(e.key) )     calcInput.value += e.key; // Allow the input of numbers 
    else if ( e.key === "Enter" ) operate(calcInput.value); // Run the Evaluation Function when the "Enter" key is pressed
    else if ( e.code === "KeyR" ) {                         // Reset the Calculator Displays
        calcDisplay.textContent = 0;
        calcInput.value = "";
    }
    else if ( e.code === "KeyC" )                         clearCalcLog(); // Clears the Calculator Log
    else if ( e.code === "KeyP" )               previousEvaluation(math);
    else if ( e.code === "KeyN" )                   nextEvaluation(math);              
    else if ( e.key  === "Backspace" )  removeCharacter(calcInput.value);
    else if ( e.key  === "/" )                  calcInput.value += " / ";
    else if ( e.key  === "x" || e.key === "*" ) calcInput.value += " x ";
    else if ( e.key  === "-" )                  calcInput.value += " - ";
    else if ( e.key  === "+" )                  calcInput.value += " + ";
    else if ( e.key  === "." )                  calcInput.value +=   ".";
});

document.body.addEventListener("click", (e) => {
    if ( e.target.nodeName === "BUTTON" && !isNaN(e.target.textContent) ) calcInput.value += e.target.textContent;
    else if ( e.target.nodeName === "BUTTON" && isNaN(e.target) ) buttonFunctionality(e);
});

function buttonFunctionality(e) {
    if ( e.target.classList.value === "upper reset" ) { // Reset Button, resets the Calculator
        calcDisplay.textContent = 0;
        calcInput.value = "";
    }
    else if ( e.target.classList.value === "upper select" ) {
        selectEvaluation(); // gives the user the ability to select a specific previous evaluation
    }
    else if ( e.target.classList.value === "upper previous" ) {
        previousEvaluation(math); // re-inserts the previous evaluation into the displays
    }
    else if ( e.target.classList.value === "upper next" ) {
        nextEvaluation(math); // re-inserts the next evaluation into the displays
    }
    else if ( e.target.classList.value === "result" && calcDisplay.textContent !== "0" && !isNaN(calcDisplay.textContent)) {
        insertResult(calcDisplay.textContent); // inserts the Result into the input field for further evaluation
    }    
    else if ( e.target.classList.value === "pow" )               mathPow(calcInput.value);
    else if ( e.target.classList.value === "sqrt" )           squareRoot(calcInput.value);
    else if ( e.target.classList.value === "division operator" )         calcInput.value += " / ";
    else if ( e.target.classList.value === "multiplication operator" )   calcInput.value += " x ";
    else if ( e.target.classList.value === "subtraction operator" )      calcInput.value += " - ";
    else if ( e.target.classList.value === "addition operator" )         calcInput.value += " + ";
    else if ( e.target.classList.value === "decimal" )                   calcInput.value +=   ".";
    else if ( e.target.classList.value === "evaluation" )        operate(calcInput.value);
    else if ( e.target.classList.value === "backspace" ) removeCharacter(calcInput.value); 
    else if ( e.target.classList.value === "clearLog" )                    clearCalcLog(); // Clears the Calculator Log
};

function insertResult(result) {
    calcDisplay.textContent = 0;
    return calcInput.value = Number(result); 
};

function removeCharacter(input) { // removes the last character when the "<=" Button is clicked
    let digitRemoved = input.slice(0, input.length - 1);
    calcInput.value = digitRemoved;
};

let math = [];
let mathIndex = 0;
function previousEvaluation(evaluation) {
    if ( calcLogList.childElementCount >= 2 ) { 
        if ( calcInput.value === "" && calcDisplay.textContent === "0" ) mathIndex = 0;
        else if ( mathIndex < math.length - 1 ) mathIndex++;
    }
    else if ( calcLogList.childElementCount < 1 ) {
        calcDisplay.textContent = "No Evaluations found";
        setTimeout( () => calcDisplay.textContent = 0 ,2000);
        return;
    }
    calcInput.value =         evaluation[mathIndex].evaluation;
    calcDisplay.textContent = evaluation[mathIndex].result;
};

function nextEvaluation(evaluation) {
    if ( mathIndex > 0 && math.length >= 1 ) mathIndex--;
    else if ( calcLogList.childElementCount < 1 ) {
        calcDisplay.textContent = "No Evaluations found";
        setTimeout( () => calcDisplay.textContent = 0 ,2000);
        return;
    }
    calcInput.value =         evaluation[mathIndex].evaluation;
    calcDisplay.textContent = evaluation[mathIndex].result;
};

function selectEvaluation() {
    if ( calcLogList.childElementCount < 1 ) {
        calcDisplay.textContent = "No Evaluations found";
        setTimeout( () => calcDisplay.textContent = 0 ,2000);
        return;
    }
    let index = +prompt(`Please select a valid Index ( 1 - ${calcLogList.childElementCount} ) from the Log below the Calculator`, 1);
    if ( !isNaN(index) && index > 0 && index <= calcLogList.childElementCount ) {
        let eval = calcLogList.children[index - 1].textContent;
        calcInput.value = eval.slice(eval.lastIndexOf(":") + 2, eval.indexOf("=") - 1);
        calcDisplay.textContent = eval.slice(eval.indexOf("=") + 1);
        mathIndex = calcLogList.childElementCount - index;
    } else return alert("Please select a valid index from 1 - " + calcLogList.childElementCount);
};

/* Mathematic Evaluation Functions */

function squareRoot(input) {
    if (calcInput.value === "" || isNaN(calcInput.value) ) {
        calcDisplay.textContent = "Please input a single Number";
        calcDisplay.style.fontSize = "18px";
        setTimeout( () => calcDisplay.textContent = 0 ,2000);
    }
    else if ( !isNaN(calcInput.value) ) {
        calcDisplay.textContent = `Math.sqrt(${input})`;
        return calcInput.value = Math.sqrt(input);
    }
};

function mathPow(input) {
    if ( calcInput.value === "" || isNaN(calcInput.value) ) {
        calcDisplay.textContent = "Please input a single Number";
        calcDisplay.style.fontSize = "18px";
        setTimeout( () => calcDisplay.textContent = 0 ,2000);
    }
    else if ( !isNaN(calcInput.value) ) {
        let base = Number(input);
        let exponent = +prompt(`Your base is : ${base}. Please input your exponent below:`, Number());
        if ( !isNaN(exponent) && exponent >= 1 ) {
            calcDisplay.textContent = `pow(${base}, ${exponent})`;
            return calcInput.value = Math.pow(base, exponent);
        }
    }
};

function divide(first, next) {
    calcDisplay.textContent = Number(first) / Number(next);
    return Number(first) / Number(next);
};

function multiplicate(first, next) {
    calcDisplay.textContent = Number(first) * Number(next);
    return Number(first) * Number(next);
};

function subtract(first, next) {
    calcDisplay.textContent = Number(first) - Number(next);
    return Number(first) - Number(next);
};

function add(first, next) {
    calcDisplay.textContent = Number(first) + Number(next);
    return Number(first) + Number(next);
};

function operate(input) {
    calcInput.placeholder = "0";
    if ( input.includes(".") && input.match(/[.]/g).length >= 2 && !input.includes(" ") ) {
        calcDisplay.textContent = "Error Not a valid Number";
        setTimeout( () => calcDisplay.textContent = 0 ,2000); 
    }
    let inputSplit = input.split(" ");
    let evaluation= [];
    inputSplit.forEach( element => { if ( element !== "" ) evaluation.push(element) });
    let results = [];
    for ( let i = 0; i < evaluation.length; i++ ) {
        if ( evaluation[i].includes("/") ) {
            if ( results.length > 0 ) {
                results.unshift( {evaluation: calcInput.value, result: divide(results[0].result, evaluation[i + 1])} );
            }
            else {
                results.unshift( {evaluation: calcInput.value, result: divide(evaluation[i - 1], evaluation[i + 1])} );
            }
        }
        else if ( evaluation[i].includes("x") ) {
            if ( results.length > 0 ) {
                results.unshift( {evaluation: calcInput.value, result: multiplicate(results[0].result, evaluation[i + 1])} );
            } 
            else {
                results.unshift( {evaluation: calcInput.value, result: multiplicate(evaluation[i - 1], evaluation[i + 1])} );
            }
        }
        else if ( evaluation[i].includes("-") ) {
            if ( results.length > 0 ) {
                results.unshift( {evaluation: calcInput.value, result: subtract(results[0].result, evaluation[i + 1])} );
            }
            else {
                results.unshift( {evaluation: calcInput.value, result: subtract(evaluation[i - 1], evaluation[i + 1])} );
            }
        }
        else if ( evaluation[i].includes("+") ) {
            if ( results.length > 0 ) {
                results.unshift( {evaluation: calcInput.value, result: add(results[0].result, evaluation[i + 1])} );
            }
            else {
                results.unshift( {evaluation: calcInput.value, result: add(evaluation[i - 1], evaluation[i + 1])} );
            } 
        }
    }
    if ( calcDisplay.textContent === "NaN" || results[0] === undefined ) return calcDisplay.textContent = "Error";
    else if ( results[0].result === Infinity )         return calcDisplay.textContent = "To Infinity and beyond!";
    calcInput.value.length > 28 ? calcInput.style.fontSize = "18px" : calcInput.style.fontSize = "20px"; // prevent CalcInput overflow
    calcDisplay.textContent.length > 20 ? calcDisplay.style.fontSize = "20px" : calcDisplay.style.fontSize = "22px";
    return populateLog(results[0].evaluation, results[0].result);
};

function populateLog(evaluation, result) { // Populate the Calculator Log with the most recent Evaluation
    if ( isNaN(result) ) return; // Don't show Evaluations that resolve to NaN
    let index = calcLogList.childElementCount + 1;
    let list = document.createElement("li");
    if ( ( calcLogList.childElementCount === 0 || !calcLogList.lastElementChild.textContent.includes(evaluation) ) ) {
        list.textContent = "Index " + index + " : " + "Evaluation: " + evaluation + " = " + result;
        calcLogList.appendChild(list);
        math.unshift({evaluation, result});
    }
    return calcLog.style.visibility = "visible";
};

function clearCalcLog() { // Clear the Calculator Log
    calcLogList.innerHTML = ""; 
    calcLog.style.visibility = "hidden";
    math = [];
    mathIndex = 0;
};