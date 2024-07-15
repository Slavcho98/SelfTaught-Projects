'use strict';
const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');
const diceEl = document.querySelector('.dice');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');
const name0El = document.getElementById('name--1');
const name1El = document.getElementById('name--2');
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const resetBtn = document.querySelector('.btn--new');

let scores, currentScore, activePlayer, playing;

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};
init();

const changePlayer = () => {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
};

btnRoll.addEventListener('click', () => {
  if (playing) {
    const dice = Math.floor(Math.random() * 6) + 1;

    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      changePlayer();
    }
  }
});

btnHold.addEventListener('click', () => {
  if (playing) {
    scores[activePlayer] += currentScore;
    let totalScores = document.getElementById(`score--${activePlayer}`);
    totalScores.textContent = scores[activePlayer];

    if (scores[activePlayer] >= 10) {
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      changePlayer();
    }
  }
});

resetBtn.addEventListener('click', init);
