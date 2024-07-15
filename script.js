'use strict';


// USE THESE FOR LOGIN IN: 
// user: js pin: 1111
// user: jd pin: 2222
// user: stw pin: 3333
// user: ss pin: 4444


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2024-05-10T08:15:42.123Z',
    '2023-09-22T17:30:00.000Z',
    '2024-01-05T12:45:59.876Z',
    '2023-07-14T23:59:59.999Z',
    '2024-03-30T06:20:15.387Z',
    '2023-11-18T21:31:17.178Z',
    '2024-02-29T03:45:30.500Z',
    '2024-04-01T00:00:00.000Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-08-03T10:20:30.500Z',
    '2023-04-15T15:45:00.000Z',
    '2024-10-20T07:12:59.876Z',
    '2023-12-01T18:30:45.123Z',
    '2024-06-28T23:59:59.999Z',
    '2023-08-12T12:34:56.789Z',
    '2024-02-14T01:02:03.004Z',
    '2023-11-29T20:00:00.000Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2023-10-07T04:55:32.111Z',
    '2024-05-25T11:20:00.000Z',
    '2023-08-18T23:59:59.999Z',
    '2024-03-12T14:35:45.678Z',
    '2023-12-29T06:45:30.987Z',
    '2024-01-01T00:00:00.000Z',
    '2023-06-10T19:28:17.234Z',
    '2024-09-15T08:00:00.000Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2024-04-20T13:30:40.999Z',
    '2023-02-08T16:00:00.000Z',
    '2024-07-05T09:10:20.345Z',
    '2023-11-01T21:47:53.210Z',
    '2024-01-31T02:59:59.999Z',
    '2023-08-25T11:11:11.111Z',
    '2024-06-06T06:06:06.066Z',
    '2023-12-12T12:12:12.122Z',
  ],
  currency: 'USD',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row"> 	
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 	
    <div class="movements__date">${displayDate}</div> 	
    <div class="movements__value">${formattedMov}</div> 	
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  const balanceFormat = formatCurr(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${balanceFormat}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const incomesFormat = formatCurr(incomes, acc.locale, acc.currency);
  labelSumIn.textContent = `${incomesFormat} `;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outFormat = formatCurr(Math.abs(out), acc.locale, acc.currency);
  labelSumOut.textContent = `${outFormat}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const interestFormat = formatCurr(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${interestFormat}`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(currentAccount);

  calcDisplaySummary(currentAccount);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };

  let time = 600;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    // create current date
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
