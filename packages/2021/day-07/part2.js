const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const process = (values) => {
  const data = values[0].split(",").map((v) => parseInt(v));
  const nb = data.length;
  let sum = data.reduce((acc, v) => acc + v, 0);
  const mean = Math.round(sum / nb);
  let min = data[0];
  let max = data[0];
  data.forEach((v) => {
    if (min > v) min = v;
    if (max < v) max = v;
  });
  let result = data.reduce((acc, v) => acc + Math.abs(mean - v), 0);
  for (let i = min; i <= max; i++) {
    const fuel = data.reduce((acc, v) => acc + Math.abs(i - v), 0);
    if (fuel < result) result = fuel;
  }

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
