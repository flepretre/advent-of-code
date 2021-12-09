const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const lengths = [2, 4, 3, 7];

const process = (values) => {
  let count = 0;
  values.forEach((line) => {
    const [trash, data] = line.split(" | ");
    data.split(" ").forEach((v) => {
      if (lengths.includes(v.length)) count++;
    });
  });

  return count;
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
