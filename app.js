const Game = (function createGame() {
  const Gameboard = (function createGameboard() {
    const _cells = [];

    function initCells() {
      for (let i = 0; i < 3; i++) {
        _cells.push([]);
        for (let j = 0; j < 3; j++) {
          // -1: no mark yet, 0: player0, 1: player1;
          _cells[i].push(-1);
        }
      }
    }

    function placeMark(cellCoordTuple, playerIdx) {
      [i, j] = cellCoordTuple;
      _cells[i][j] = playerIdx;
    }

    function removeMark(cellCoordTuple) {
      [i, j] = cellCoordTuple;
      _cells[i][j] = -1;
    }

    function resetALlCells() {
      _cells.map((row) => row.map((entry) => -1));
    }

    return {
      initCells,
    };
  })();

  console.log(gameboard.cells);

  function createPlayer() {
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

  return {
    GameManager,
    GameManager,
  };
})();
