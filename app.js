const gameboard = (function createGameboard() {
  const cells = [];

  for (let i = 0; i < 3; i++) {
    cells.push([]);
    for (let j = 0; j < 3; j++) {
      cells[i].push(0);
    }
  }

  return {
    cells,
  };
})();

console.log(gameboard.cells);
