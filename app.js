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

    function placeMark(cellCoordTuple, playerIdx) {
      if (!_areCoordsValid(cellCoordTuple)) {
        return false;
      }

      const [i, j] = cellCoordTuple;

      if (_cells[i][j] !== -1) {
        console.error("Cell already has a mark");
        return false;
      }

      _cells[i][j] = playerIdx;

      // console.table(_cells);
      return true;
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
    let _winnerIdx = -1;

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

    function _placeMark(cellCoordTuple) {
      return gameboard.placeMark(cellCoordTuple, _currentPlayerIdx);
    }

    function playRound(CellCoordUserInput) {
      if (_winnerIdx !== -1) {
        return false;
      }

      const isPlacementValid = _placeMark(CellCoordUserInput);
      if (!isPlacementValid) return false;

      if (hasPlayerWon()) {
        _winnerIdx = _currentPlayerIdx;
        return true;
      }

      if (
        gameboard
          .getCells()
          .flat()
          .every((idx) => idx !== -1)
      ) {
        return true;
      }

      _togglePlayerTurn();
      return false;
    }

    function resetGame() {
      _currentPlayerIdx = 0;
      _winnerIdx = -1;

      gameboard.resetAllCells();
    }

    function hasPlayerWon() {
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

    function getWinnerIdx() {
      return _winnerIdx;
    }

    function getCells() {
      return gameboard.getCells();
    }

    return {
      playRound,
      getCurrentPlayerIdx,
      getWinnerIdx,
      hasPlayerWon,
      getCells,
      resetGame,
    };
  })(Gameboard);

  return {
    GameManager,
  };
})();

// --- TEST ---

function testMarkPlacement() {
  Game.GameManager.placeMark([1, 1]);
  console.assert(!Game.GameManager.placeMark([-1, 1]));
  console.assert(!Game.GameManager.placeMark([1, 1]));
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
    coords.forEach((coord) => Game.GameManager.placeMark(coord));
    // console.log(Game.GameManager.hasPlayerWon());
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

// PlayRoundTest.test();

// --- UI ---

const DisplayController = (function (gamemanager) {
  const gameboardEl = document.querySelector(".gameboard");
  const currentPlayerEl = document.querySelector(".current-player");
  const currentPlayerAnnouncementEl = document.querySelector(
    ".current-player-announcement",
  );
  const gameOverEl = document.querySelector(".game-over");
  const winnerEl = document.querySelector(".winner");

  const resetBtn = document.querySelector(".reset");
  resetBtn.addEventListener("click", () => {
    _resetGame();
  });

  _resetGame();

  function update() {
    _updateGameboard();
    _updateCurrentPlayer();
  }

  function _convertIdxToMark(idx) {
    switch (idx) {
      case -1:
        return "_";
      case 0:
        return "x";
      case 1:
        return "o";
      default:
        return "invalid index";
    }
  }

  function _convertIdxToPlayerName(idx) {
    switch (idx) {
      case -1:
        return "Noone. It was a tie!";
      case 0:
        return "Player 1";
      case 1:
        return "Player 2";
      default:
        return "invalid player index";
    }
  }

  function _updateGameboard() {
    gameboardEl.replaceChildren();

    const cells = gamemanager.getCells();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellEl = document.createElement("div");
        cellEl.classList.add("cell");
        cellEl.textContent = _convertIdxToMark(cells[i][j]);

        cellEl.addEventListener("click", () => {
          const isGameOver = gamemanager.playRound([i, j]);
          update();

          if (isGameOver) {
            _handleWin();
            return;
          }
        });

        gameboardEl.appendChild(cellEl);
      }
    }
  }

  function _updateCurrentPlayer() {
    currentPlayerEl.textContent = _convertIdxToPlayerName(
      gamemanager.getCurrentPlayerIdx(),
    );
  }

  function _handleWin() {
    // Why does this not toggle the display?
    currentPlayerAnnouncementEl.style.display = "none";

    winnerEl.textContent = _convertIdxToPlayerName(gamemanager.getWinnerIdx());
    gameOverEl.style.display = "flex";
  }

  function _resetGame() {
    gamemanager.resetGame();
    gameOverEl.style.display = "none";
    currentPlayerAnnouncementEl.style.display = "flex";
    update();
  }

  return {
    update,
  };
})(Game.GameManager);
