const Game = (function createGame() {
  "use strict";
  const Gameboard = (function createGameboard() {
    const _cells = [];

    (function _initCells() {
      for (let i = 0; i < 3; i++) {
        _cells.push([]);
        for (let j = 0; j < 3; j++) {
          // -1: no mark yet, 0: player0, 1: player1;
          _cells[i].push(-1);
        }
      }
    })();

    function placeMark(cellCoordTuple, playerIdx) {
      const [i, j] = cellCoordTuple;
      _cells[i][j] = playerIdx;
    }

    function removeMark(cellCoordTuple) {
      const [i, j] = cellCoordTuple;
      _cells[i][j] = -1;
    }

    function resetAllCells() {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          _cells[i][j] = -1;
        }
      }
    }

    return {
      placeMark,
      removeMark,
      resetAllCells,
    };
  })();

  function _createPlayer() {
    let _score = 0;

    function getScore() {
      return _score;
    }

    function increaseScore() {
      _score++;
    }

    return {
      getScore,
      increaseScore,
    };
  }

  const GameManager = (function createGameManager(board) {
    const players = [_createPlayer(), _createPlayer()];
    let currentPlayerIdx = 0;

    function initGame() {}

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

  return {
    GameManager,
  };
})();

console.log;
