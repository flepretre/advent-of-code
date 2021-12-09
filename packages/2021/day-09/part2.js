const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const lookAHead = (x, y, index, bassins, bassinsIndex) => {
  if (
    y > 0 &&
    !bassinsIndex[`y${y - 1}x${x}`] &&
    _.get(bassins, [y - 1, x], " ") !== " "
  ) {
    bassinsIndex[`y${y - 1}x${x}`] = index;
    lookAHead(x, y - 1, index, bassins, bassinsIndex);
  }

  if (
    y < bassins.length - 1 &&
    !bassinsIndex[`y${y + 1}x${x}`] &&
    _.get(bassins, [y + 1, x], " ") !== " "
  ) {
    bassinsIndex[`y${y + 1}x${x}`] = index;
    lookAHead(x, y + 1, index, bassins, bassinsIndex);
  }

  if (
    x > 0 &&
    !bassinsIndex[`y${y}x${x - 1}`] &&
    _.get(bassins, [y, x - 1], " ") !== " "
  ) {
    bassinsIndex[`y${y}x${x - 1}`] = index;
    lookAHead(x - 1, y, index, bassins, bassinsIndex);
  }

  if (
    x < bassins[y].length - 1 &&
    !bassinsIndex[`y${y}x${x + 1}`] &&
    _.get(bassins, [y, x + 1], " ") !== " "
  ) {
    bassinsIndex[`y${y}x${x + 1}`] = index;
    lookAHead(x + 1, y, index, bassins, bassinsIndex);
  }
};

const process = (values, debug) => {
  const points = [];
  const bassins = [];
  const bassinsIndex = {};

  for (let y = 0; y < values.length; y++) {
    for (let x = 0; x < values[y].length; x++) {
      const value = parseInt(values[y][x]);
      if (x === 0) {
        bassins.push([]);
      }
      bassins[y].push(" ");
      if (
        value < _.get(values, [y - 1, x], "9") ||
        value < _.get(values, [y + 1, x], "9") ||
        value < _.get(values, [y, x - 1], "9") ||
        value < _.get(values, [y, x + 1], "9")
      ) {
        points.push({ x, y, value });
        bassins[y][x] = value;
      }
    }
  }

  let index = 0;
  for (let y = 0; y < bassins.length; y++) {
    // console.log(...bassins[y]);

    for (let x = 0; x < bassins[y].length; x++) {
      if (bassinsIndex[`y${y}x${x}`]) {
        // skip
      } else if (_.get(bassins, [y, x], " ") !== " ") {
        index++;
        bassinsIndex[`y${y}x${x}`] = index;
        lookAHead(x, y, index, bassins, bassinsIndex);
      }
    }
  }

  // const csv = [];
  // for (let y = 0; y < bassins.length; y++) {
  //   let log = [];
  //   for (let x = 0; x < bassins[y].length; x++) {
  //     log.push(bassinsIndex[`y${y}x${x}`] || "");
  //   }
  //   csv.push(log);
  // }

  // fs.writeFileSync("result.csv", csv.join("\n"));

  const culsters = {};
  const sizes = _.reduce(
    bassinsIndex,
    (acc, v) => {
      if (v) {
        acc[v] = acc[v] ? acc[v] + 1 : 1;
      }
      culsters[v] = acc[v];
      return acc;
    },
    {}
  );
  console.log(
    "clusters",
    _.map(culsters, (v, k) => ({ k, v })).sort(({ v: a }, { v: b }) => b - a)
  );
  let sorted = _.map(sizes, (v) => v).sort((a, b) => b - a);
  console.log("sorted", sorted);

  let largest3 = sorted.slice(0, 3);

  console.log("largets3", largest3);

  return largest3.reduce((acc, v) => acc * v, 1);
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
