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

    function getCells() {
      return _cells;
    }

    function _areCoordsValid(cellCoordTuple) {
      const areValid = cellCoordTuple.every((x) => 0 <= x && x < 3);
      if (!areValid) {
        console.error("Invalid coordinates");
      }
      return areValid;
    }

    function _placeMark(cellCoordTuple, playerIdx) {
      if (!_areCoordsValid(cellCoordTuple)) {
        return false;
      }

      const [i, j] = cellCoordTuple;

      if (_cells[i][j] !== -1) {
        console.error("Cell already has a mark");
        return false;
      }

      _cells[i][j] = playerIdx;

      console.table(_cells);
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
      _placeMark,
      removeMark,
      resetAllCells,
      getCells,
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

    function _togglePlayerTurn() {
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
    function _placeMark(cellCoordTuple) {
      gameboard._placeMark(cellCoordTuple, _currentPlayerIdx);
    }

    function playRound(CellCoordUserInput) {
      _placeMark(CellCoordUserInput);
      const hasWon = _hasPlayerWon();

      
      _togglePlayerTurn();

      return hasWon;
    }

    function _hasPlayerWon() {
      // check horizontally

      const cells = gameboard.getCells();

      if (
        cells.some((row) => row.every((mark) => mark === _currentPlayerIdx))
      ) {
        return true;
      }

      // Check vertically

      const hasVerticalWin = [0, 1, 2].some((columnIdx) =>
        cells.every((row) => row[columnIdx] === _currentPlayerIdx),
      );
      if (hasVerticalWin) {
        return true;
      }

      // Check diagonally
      if ([0, 1, 2].every((idx) => cells[idx][idx] === _currentPlayerIdx)) {
        return true;
      }
      if ([0, 1, 2].every((idx) => cells[2 - idx][idx] === _currentPlayerIdx)) {
        return true;
      }

      return false;
    }

    return {
      _placeMark,
      playRound,
      getCurrentPlayerIdx,
    };
  })(Gameboard);

  return {
    GameManager,
  };
})();

// --- TEST ---

function testMarkPlacement() {
  Game.GameManager._placeMark([1, 1]);
  console.assert(!Game.GameManager._placeMark([-1, 1]));
  console.assert(!Game.GameManager._placeMark([1, 1]));
}
// testMarkPlacement();

const WinLogicTest = (function () {
  const vertCoords = [
    [0, 0],
    [1, 0],
    [2, 0],
  ];
  const horizontalCoords = [
    [0, 0],
    [0, 1],
    [0, 2],
  ];
  const diagCoords = [
    [0, 0],
    [1, 1],
    [2, 2],
  ];

  const altDiagCoords = [
    [2, 0],
    [1, 1],
    [0, 2],
  ];

  const noWinCoords = [
    [0, 0],
    [0, 1],
    [1, 1],
  ];

  function test(coords) {
    coords.forEach((coord) => Game.GameManager._placeMark(coord));
    console.log(Game.GameManager.hasPlayerWon());
  }

  return {
    horizontalCoords,
    diagCoords,
    vertCoords,
    noWinCoords,
    altDiagCoords,
    test,
  };
})();

const PlayRoundTest = (function () {
  const coords = [
    [1, 1],
    [0, 0],
    [0, 1],
    [2, 1],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
    [0, 2],
  ];

  function test() {
    coords.forEach((coord) => console.log(Game.GameManager.playRound(coord)));
  }

  return {
    test,
  };
})();

// WinLogicTest.test(WinLogicTest.altDiagCoords);

PlayRoundTest.test();
