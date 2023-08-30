const operatorSigns = {
  '+': '+',
  '-': '&minus;',
  '*': '&#215;',
  '/': '&#247;',
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
      result = divide(n1, n2);
      break;

    default:
  }

  if (getDecimalLength(result.toString()) > 3) {
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
    if (displayValue === '0') {
      displayValue = '';
    }
    displayValue += `${numberButton.getAttribute('data-number')}`;
    updateDisplay();
  })
})

// point: if displayValue = '', add '0.'
pointButton.addEventListener('click', () => {
  if (displayValue === '') {
    displayValue += '0';
  }
  if (!displayValue.includes('.')) {
    displayValue += '.';
  }
  
  updateDisplay();
})


operatorButtons.forEach(operatorButton => {
  operatorButton.addEventListener('click', () => {
    switch (mode) {
      case WAIT_NUM1:
        number1 = +displayValue;
        operator = operatorButton.getAttribute('data-operator');
        updateOperationInfo();
        displayValue = '';
        updateDisplay();
        mode = WAIT_NUM2;
        break;

      case WAIT_NUM2:
        if (displayValue === '') {
          operator = operatorButton.getAttribute('data-operator');
          updateOperationInfo();
        }
        else {
          number2 = +displayValue;
          operate(number1, number2, operator);

          number1 = result;
          number2 = null;
          operator = operatorButton.getAttribute('data-operator');
          result = null;
          updateOperationInfo();
          displayValue = '';
          updateDisplay();
        }
        break;

      default:
    }
  })
})

equalsButton.addEventListener('click', () => {
  if (mode == WAIT_NUM2 && displayValue !== '') {
    number2 = +displayValue;
    operate(number1, number2, operator);
    displayValue = result.toString();
    updateOperationInfo();
    updateDisplay();
    
    number1 = null;
    number2 = null;
    operator = null;
    result = null;
    mode = WAIT_NUM1;
  }
})

clearButton.addEventListener('click', () => {
  number1 = null;
  number2 = null;
  operator = null;
  // result is null in any case
  updateOperationInfo();
  displayValue = '0';
  updateDisplay();
  mode = WAIT_NUM1;
})

deleteButton.addEventListener('click', () => {
  if (displayValue) {
    displayValue = displayValue.slice(0, -1);
  }
  updateDisplay();
})

function updateDisplay() {
  display.textContent = displayValue;
}

function updateOperationInfo() {
  currentNumber1Span.textContent = (number1 !== null && number1 !== undefined) ? number1 : '';
  currentOperatorSpan.textContent = (operator) ? operator : '';
  currentNumber2Span.textContent = (number2 !== null && number2 !== undefined) ? number2 : '';
  equalsSpan.textContent = (result !== null && result !== undefined) ? '=' : '';
}


// TODO:
// - max number restriction
// - delete button


// we either wait for number1 or number2 or show result
// so there are 3 modes: user enters number1, user enters number2, idle

// pressing number button adds number to display content
// pressing operator button saves display content as number1 or number2
// if number 2 then call operate and save result to number1
// pressing equals button calls operate