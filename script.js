const operatorSigns = {
  '+': '+',
  '-': '\u2212',
  '*': '\u00D7',
  '/': '\u00F7',
};

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

let number1;
let number2;
let operator;
let result;

function operate(n1, n2, operator) {
  // n1 = m + a * 10^(-x)  35.244
  // n2 = n + b * 10^(-y)  2.00000000005
  // find max(x, y)
  // (a*x + b*x)/x = a + b
  // (a*x * b*x)/x*x = a * b
  // a - b = (a*x - b*x)/x
  // a / b = a*x / b*x
  const decimalLength1 = getDecimalLength(n1.toString());
  const decimalLength2 = getDecimalLength(n2.toString());
  const maxDecimalLength = Math.max(decimalLength1, decimalLength2);
  let multiplier = Math.pow(10, maxDecimalLength); // 1, if max = 0
  n1 *= multiplier;
  n2 *= multiplier;

  switch (operator) {
    case '+':
      result = add(n1, n2) / multiplier;
      break;

    case '-':
      result = subtract(n1, n2) / multiplier;
      break;

    case '*':
      result = multiply(n1, n2) / multiplier**2;
      break;

    case '/':
      if (n2 === 0) {
        alert('You cannot divide by zero!');
      }
      else {
        result = divide(n1, n2);
      }
      break;

    default:
  }

  if (result && getDecimalLength(result.toString())> 3) {
    result = +(result.toFixed(3));
  }
}

function getDecimalLength(numStr) {
  return (numStr.includes('.')) ? numStr.slice(numStr.indexOf('.')+1).length : 0;
}

let displayValue = '0';

const WAIT_NUM1 = 'waitNum1';
const WAIT_NUM2 = 'waitNum2';
// const IDLE = 'idle';

let mode = WAIT_NUM1;

const display = document.getElementById('display');
const currentNumber1Span = document.getElementById('current-number1-span');
const currentOperatorSpan = document.getElementById('current-operator-span');
const currentNumber2Span = document.getElementById('current-number2-span');
const equalsSpan = document.getElementById('equals-span');

const numberButtons = Array.from(document.getElementsByClassName('number'));
const pointButton = document.getElementById('point-btn');
const operatorButtons = Array.from(document.getElementsByClassName('operator'));
const equalsButton = document.getElementById('equals-btn');

const clearButton = document.getElementById('clear-btn');
const deleteButton = document.getElementById('delete-btn');

numberButtons.forEach(numberButton => {
  numberButton.addEventListener('click', () => {
    addNumberToDisplay(numberButton.getAttribute('data-number'));
  });
})

function addNumberToDisplay(number) {
  if (displayValue === '0') {
    displayValue = '';
  }
  displayValue += `${number}`;
  updateDisplay();
}

// point: if displayValue = '', add '0.'
pointButton.addEventListener('click', addPointToDisplay);

function addPointToDisplay() {
  if (displayValue === '') {
    displayValue += '0';
  }
  if (!displayValue.includes('.')) {
    displayValue += '.';
  }
  
  updateDisplay();
}


operatorButtons.forEach(operatorButton => {
  operatorButton.addEventListener('click', () => {
    handleOperator(operatorButton.getAttribute('data-operator'));
  });
})

function handleOperator(operatorKey) {
  switch (mode) {
    case WAIT_NUM1:
      number1 = +displayValue;
      operator = operatorKey;
      updateOperationInfo();
      displayValue = '';
      updateDisplay();
      mode = WAIT_NUM2;
      break;

    case WAIT_NUM2:
      if (displayValue === '') {
        operator = operatorKey;
        updateOperationInfo();
      }
      else {
        number2 = +displayValue;
        operate(number1, number2, operator);
        if (result !== null && result !== undefined) {
          number1 = result;
          number2 = null;
          operator = operatorKey;
          result = null;
          updateOperationInfo();
          displayValue = '';
          updateDisplay();
        }
        else {
          number2 = null;
          displayValue = '';
          updateDisplay();
        }
      }
      break;

    default:
  }
}

equalsButton.addEventListener('click', handleEquals);

function handleEquals() {
  if (mode == WAIT_NUM2 && displayValue !== '') {
    number2 = +displayValue;
    operate(number1, number2, operator);
    if (result !== null && result !== undefined) {
      displayValue = result.toString();
      updateOperationInfo();
      updateDisplay();
      
      number1 = null;
      number2 = null;
      operator = null;
      result = null;
      mode = WAIT_NUM1;
    }
    else {
      number2 = null;
      displayValue = '';
      updateDisplay();
    }
  }
}

clearButton.addEventListener('click', () => {
  number1 = null;
  number2 = null;
  operator = null;
  // result is null in any case
  updateOperationInfo();
  displayValue = '0';
  updateDisplay();
  mode = WAIT_NUM1;
});

deleteButton.addEventListener('click', deleteLastSymbol);

function deleteLastSymbol() {
  if (displayValue) {
    displayValue = displayValue.slice(0, -1);
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = displayValue;
}

function updateOperationInfo() {
  currentNumber1Span.textContent = (number1 !== null && number1 !== undefined) ? number1 : '';
  currentOperatorSpan.textContent = (operator) ? operatorSigns[operator] : '';
  currentNumber2Span.textContent = (number2 !== null && number2 !== undefined) ? number2 : '';
  equalsSpan.textContent = (result !== null && result !== undefined) ? '=' : '';
}


window.addEventListener('keydown', e => {
  const key = e.key;
  switch (key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      addNumberToDisplay(key);
      break;

    case '.':
      addPointToDisplay();
      break;

    case '/':
    case '*':
    case '-':
    case '+':
      handleOperator(key);
      break;

    case '=':
      handleEquals();
      break;

    case 'Backspace':
      deleteLastSymbol();
      break;

    default:
  }
});

const buttons = Array.from(document.getElementsByTagName('button'));
buttons.forEach(button => {
  button.addEventListener('click', () => {
    button.blur();
  });
})

// TODO:


// we either wait for number1 or number2 or show result
// so there are 3 modes: user enters number1, user enters number2, idle

// pressing number button adds number to display content
// pressing operator button saves display content as number1 or number2
// if number 2 then call operate and save result to number1
// pressing equals button calls operate