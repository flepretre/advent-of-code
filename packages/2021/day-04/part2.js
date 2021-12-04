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

  let gridResult = grids.map((v, i) => ({
    x: [0, 0, 0, 0, 0],
    y: [0, 0, 0, 0, 0],
    index: i,
    winOrder: null,
    winningNumber: null,
  }));

  let winOrder = 0;
  numbers.forEach((n) => {
    grids.forEach((grid, gi) => {
      if (typeof grid[n] !== "undefined") {
        const { x, y } = grid[n];
        console.log(gi, x, y);
        const result = gridResult[gi];
        if (result.winOrder !== null) return;

        grid[n].marked = true;
        result.x[x]++;
        result.y[y]++;
        if (result.x[x] > 4) {
          console.log("winner grid", gi, "with colum", x, "and number", n);
          result.winOrder = winOrder++;
          result.winningNumber = n;
          return;
        }
        if (result.y[y] > 4) {
          console.log("winner grid", gi, "with line", y, "and number", n);
          result.winOrder = winOrder++;
          result.winningNumber = n;
          return;
        }
      }
    });
  });

  gridResult = gridResult.sort(({ winOrder: a }, { winOrder: b }) => b - a);
  let { index, winningNumber } = _.first(gridResult);
  let winningGrid = grids[index];
  const result = _.reduce(
    winningGrid,
    (acc, { value, marked }) => (marked ? acc : acc + value),
    0
  );

  return result * winningNumber;
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
