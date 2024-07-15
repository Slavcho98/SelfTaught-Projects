'use strict';
const playBtn = document.querySelector('.check');
const resetBtn = document.querySelector('.again');
let messageParagraph = document.querySelector('.message');
const inputGuess = document.querySelector('.guess');
const labelScore = document.querySelector('.label-score .score');
const labelHighscore = document.querySelector('.label-highscore .highscore');
const revealNumber = document.querySelector('.number');

let score = Number(labelScore.textContent);
let highscore = 0;
let correctNumber = Math.floor(Math.random() * 20) + 1;

function checkNumber() {
  const inputValue = Number(inputGuess.value);
  if (inputValue === '') {
    alert('Please enter a value');
    return;
  }

  if (!inputValue) {
    alert('enter a valid number');
  } else if (inputValue === correctNumber) {
    messageParagraph.textContent = `Correct! The answer is ${correctNumber}`;
    revealNumber.textContent = correctNumber;
    document.body.style.backgroundColor = 'green';
    playBtn.disabled = true;

    if (score > highscore) {
      highscore = score;
      labelHighscore.textContent = highscore;
    }
  } else if (inputValue !== correctNumber) {
    if (score > 1) {
      messageParagraph.textContent =
        inputValue > correctNumber ? 'Too high' : 'Too low';
    }
    score--;
  }

  if (score === 0) {
    messageParagraph.textContent = 'Game over';
    playBtn.disabled = true;
  }

  labelScore.textContent = score;
}

const resetGame = function () {
  score = 20;
  labelScore.textContent = score;
  messageParagraph.textContent = 'Start guessing...';
  document.body.style.backgroundColor = '';
  revealNumber.textContent = '?';
  playBtn.disabled = false;
  inputGuess.value = '';
  correctNumber = Math.floor(Math.random() * 20) + 1;

  console.log(correctNumber);
};

playBtn.addEventListener('click', () => {
  checkNumber();
});

resetBtn.addEventListener('click', () => {
  resetGame();
});
