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
  const n1Str = n1.toString();
  const n2Str = n2.toString();
  const decimalLength1 = (n1Str.includes('.')) ? n1Str.slice(n1Str.indexOf('.')+1).length : 0;
  const decimalLength2 = (n2Str.includes('.')) ? n2Str.slice(n2Str.indexOf('.')+1).length : 0;
  const maxDecimalLength = 0; //TODO
  switch (operator) {
    case '+':
      result = add(n1, n2);
      break;

    case '-':
      result = subtract(n1, n2);
      break;

    case '*':
      result = multiply(n1, n2);
      break;

    case '/':
      result = divide(n1, n2);
      break;

    default:
  }
}

function getDecimalLength(numStr) {
  return (numStr.includes('.')) ? numStr.slice(numStr.indexOf('.')+1).length : 0;
}

let displayValue = '0';

const WAIT_NUM1 = 'waitNum1';
const WAIT_NUM2 = 'waitNum2';
const IDLE = 'idle';

let mode = WAIT_NUM1;

const display = document.getElementById('display');
const numberButtons = Array.from(document.getElementsByClassName('number'));
const pointButton = document.getElementById('point-btn');
const operatorButtons = Array.from(document.getElementsByClassName('operator'));
const equalsButton = document.getElementById('equals-btn');
const clearButton = document.getElementById('clear-btn');

numberButtons.forEach(numberButton => {
  numberButton.addEventListener('click', () => {
    displayValue += `${numberButton.getAttribute('data-number')}`;
    display.textContent = displayValue;
  })
})

// point: if displayValue = '', add '0.'
// TODO: - fix operations result inaccuracy with double args
// - deprecate IDLE
// - max number restriction
// - how display works
// - delete button
pointButton.addEventListener('click', () => {
  if (displayValue === '') {
    displayValue += '0';
  }
  if (!displayValue.includes('.')) {
    displayValue += '.';
  }
  
  display.textContent = displayValue;
})


operatorButtons.forEach(operatorButton => {
  operatorButton.addEventListener('click', () => {
    switch (mode) {
      case WAIT_NUM1:
      case IDLE:
        number1 = +displayValue;
        displayValue = '';
        operator = operatorButton.getAttribute('data-operator');
        mode = WAIT_NUM2;
        break;

      case WAIT_NUM2:
        if (displayValue === '') {
          operator = operatorButton.getAttribute('data-operator');
        }
        else {
          number2 = +displayValue;
          operate(number1, number2, operator);
          number1 = result;
          number2 = null;
          displayValue = '';
          operator = operatorButton.getAttribute('data-operator');
        }
        break;

      // case IDLE:
      //   number1 = +displayValue;
      //   displayValue = '';
      //   operator = operatorButton.getAttribute('data-operator');
      //   mode = WAIT_NUM2;
      //   break;

        default:
    }
  })
})

equalsButton.addEventListener('click', () => {
  if (mode == WAIT_NUM2 && displayValue !== '') {
    number2 = +displayValue;
    operate(number1, number2, operator);
    displayValue = result;
    display.textContent = displayValue;
    mode = IDLE;
  }
})

clearButton.addEventListener('click', () => {
  displayValue = '0';
  display.textContent = displayValue;
  mode = WAIT_NUM1;
})


// we either wait for number1 or number2 or show result
// so there are 3 modes: user enters number1, user enters number2, idle

// pressing number button adds number to display content
// pressing operator button saves display content as number1 or number2
// if number 2 then call operate and save result to number1
// pressing equals button calls operate