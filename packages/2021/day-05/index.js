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

const process = (values) => {
  const data = preprocess(values);
  const matrix = {};
  let result = 0;
  data.forEach(({ x0, x1, y0, y1 }) => {
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
  });

  return result;
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
