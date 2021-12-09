const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const process = (values, debug) => {
  const points = [];

  for (let y = 0; y < values.length; y++) {
    for (let x = 0; x < values[y].length; x++) {
      const value = parseInt(values[y][x]);
      if (
        value < _.get(values, [y - 1, x], "9") &&
        value < _.get(values, [y + 1, x], "9") &&
        value < _.get(values, [y, x - 1], "9") &&
        value < _.get(values, [y, x + 1], "9")
      ) {
        points.push({ x, y, value });
      }
    }
  }

  return points.reduce((acc, { value }) => acc + parseInt(value) + 1, 0);
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
