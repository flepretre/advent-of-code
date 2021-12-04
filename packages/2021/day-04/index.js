const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const process = (values) => {
  let [numbers, ...grids] = values;
  numbers = numbers.split(",").map((v) => parseInt(v));
  grids = grids
    .reduce((acc, line) => {
      if (line === "") {
        acc.push({ currentLine: 0 });
        return acc;
      }

      const currentGrid = acc[acc.length - 1];
      line
        .split(" ")
        .filter((v) => v)
        .reduce((acc, v, i) => {
          acc[v] = { value: parseInt(v), x: i, y: currentGrid.currentLine };
          return acc;
        }, currentGrid);
      currentGrid.currentLine++;
      return acc;
    }, [])
    .map((g) => {
      delete g.currentLine;
      return g;
    });

  const gridResult = grids.map(() => ({
    x: [0, 0, 0, 0, 0],
    y: [0, 0, 0, 0, 0],
  }));

  let winner = false;
  numbers.forEach((n) => {
    if (winner) return;
    grids.forEach((grid, gi) => {
      if (winner) return;
      if (typeof grid[n] !== "undefined") {
        const { x, y } = grid[n];
        grid[n].marked = true;
        console.log(gi, x, y);
        const result = gridResult[gi];
        result.x[x]++;
        result.y[y]++;
        if (result.x[x] > 4) {
          console.log("winner grid", gi, "with colum", x, "and number", n);
          winner = { grid: gi, number: n };
          return;
        }
        if (result.y[y] > 4) {
          console.log("winner grid", gi, "with line", y, "and number", n);
          winner = { grid: gi, number: n };
          return;
        }
      }
    });
  });

  let winningGrid = grids[winner.grid];
  console.log(winner, winningGrid);
  const result = _.reduce(
    winningGrid,
    (acc, { value, marked }) => (marked ? acc : acc + value),
    0
  );

  return result * winner.number;
};

const example = async () => {
  const values = await read("./example.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = process(values);
  console.log("example result =", result);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = process(values);
  console.log(`result =`, result);
};

example();
run();
