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

let displayValue = '0';

const WAIT_NUM1 = 'waitNum1';
const WAIT_NUM2 = 'waitNum2';
const IDLE = 'idle';

let mode = WAIT_NUM1;

const display = document.getElementById('display');
const numberButtons = Array.from(document.getElementsByClassName('number'));
const operatorButtons = Array.from(document.getElementsByClassName('operator'));
const equalsButton = document.getElementById('equals-btn');

numberButtons.forEach(numberButton => {
  numberButton.addEventListener('click', () => {
    if (mode !== IDLE) {
      displayValue += `${numberButton.getAttribute('data-number')}`;
      display.textContent = displayValue;
    }
  })
})

operatorButtons.forEach(operatorButton => {
  operatorButton.addEventListener('click', () => {
    switch (mode) {
      case WAIT_NUM1:
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

      case IDLE:
        break;

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

// we either wait for number1 or number2 or show result
// so there are 3 modes: user enters number1, user enters number2, idle

// pressing number button adds number to display content
// pressing operator button saves display content as number1 or number2
// if number 2 then call operate and save result to number1
// pressing equals button calls operate