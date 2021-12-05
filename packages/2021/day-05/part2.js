const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const preprocess = (values) =>
  values.reduce((acc, v) => {
    acc.push(
      v.split(" -> ").reduce((sacc, sv, i) => {
        const [x, y] = sv.split(",");
        sacc[`x${i}`] = parseInt(x);
        sacc[`y${i}`] = parseInt(y);
        return sacc;
      }, {})
    );
    return acc;
  }, []);

const process = (values, displayMatrix = false) => {
  const data = preprocess(values);
  const matrix = {};
  let result = 0;
  data.forEach(({ x0, x1, y0, y1 }) => {
    // Horizontal
    if (x0 === x1) {
      const min = Math.min(y0, y1);
      const max = Math.max(y0, y1);
      for (let y = min; y <= max; y++) {
        if (matrix[`x${x0};y${y}`] === 1) result++;
        matrix[`x${x0};y${y}`] = matrix[`x${x0};y${y}`]
          ? matrix[`x${x0};y${y}`] + 1
          : 1;
      }
    }

    // Vetical
    if (y0 === y1) {
      const min = Math.min(x0, x1);
      const max = Math.max(x0, x1);
      for (let x = min; x <= max; x++) {
        if (matrix[`x${x};y${y0}`] === 1) result++;
        matrix[`x${x};y${y0}`] = matrix[`x${x};y${y0}`]
          ? matrix[`x${x};y${y0}`] + 1
          : 1;
      }
    }

    // Diagonal
    if (Math.abs(x0 - x1) === Math.abs(y1 - y0)) {
      let x = x0 < x1 ? x0 : x1;
      let y = x0 < x1 ? y0 : y1;
      const max = Math.max(x0, x1);

      if ((x0 < x1 && y0 < y1) || (x0 > x1 && y0 > y1)) {
        for (; x <= max; x++, y++) {
          if (matrix[`x${x};y${y}`] === 1) result++;
          matrix[`x${x};y${y}`] = matrix[`x${x};y${y}`]
            ? matrix[`x${x};y${y}`] + 1
            : 1;
        }
      } else {
        for (; x <= max; x++, y--) {
          if (matrix[`x${x};y${y}`] === 1) result++;
          matrix[`x${x};y${y}`] = matrix[`x${x};y${y}`]
            ? matrix[`x${x};y${y}`] + 1
            : 1;
        }
      }
    }
  });

  if (displayMatrix)
    for (let i = 0; i < 10; i++) {
      let line = "";
      for (let j = 0; j < 10; j++) {
        line = `${line} ${
          typeof matrix[`x${j};y${i}`] === "undefined"
            ? "."
            : matrix[`x${j};y${i}`]
        }`;
      }
      console.log(line);
    }

  return result;
};

const example = async () => {
  const values = await read("./example.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = process(values, true);
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
