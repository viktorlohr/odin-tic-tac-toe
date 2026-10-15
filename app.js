const Gameboard = (function createGameboard() {
  const cells = [];

  for (let i = 0; i < 3; i++) {
    cells.push([]);
    for (let j = 0; j < 3; j++) {
      cells[i].push(-1);
    }
  }

  return {
    cells,
  };
})();

console.log(gameboard.cells);

const Player = (function createPlayer() {
  let score = 0;

  function getScore() {
    return score;
  }

  function increaseScore() {
    score++;
  }

  return {
    getScore,
    increaseScore,
  };
})();

const GameManager = (function createGameManager(board, players) {
  const players = [createPlayer(), createPlayer()];
  let currentPlayerIdx = 0;

  function togglePlayerTurn() {
    if (currentPlayerIdx === 0) {
      currentPlayerIdx = 1;
    } else {
      currentPlayerIdx = 0;
    }
  }

  return {
    players,
    togglePlayerTurn,
  };
})(Gameboard);
