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

    function _areCoordsValid(cellCoordTuple) {
      const areValid = cellCoordTuple.every((x) => 0 <= x && x < 3);
      if (!areValid) {
        console.error("invalid coordinates");
      }
      return areValid;
    }

    function placeMark(cellCoordTuple, playerIdx) {
      if (!_areCoordsValid(cellCoordTuple)) {
        return false;
      }

      const [i, j] = cellCoordTuple;
      _cells[i][j] = playerIdx;
    }

    function removeMark(cellCoordTuple) {
      if (!_areCoordsValid(cellCoordTuple)) {
        return false;
      }

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

  const GameManager = (function createGameManager(gameboard) {
    const players = [_createPlayer(), _createPlayer()];
    let _currentPlayerIdx = 0;

    function initGame() {}

    function togglePlayerTurn() {
      if (_currentPlayerIdx === 0) {
        _currentPlayerIdx = 1;
      } else {
        _currentPlayerIdx = 0;
      }
    }

    function getCurrentPlayerIdx() {
      return _currentPlayerIdx;
    }

    // Is this normal? It is almost the exact same function as i have in my gameboard
    function placeMark(cellCoordTuple) {
      gameboard.placeMark(cellCoordTuple, _currentPlayerIdx);
    }

    return {
      players,
      togglePlayerTurn,
      placeMark,
    };
  })(Gameboard);

  return {
    GameManager,
  };
})();

console.log;
