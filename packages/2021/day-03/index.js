const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const stepOne = (values) => {};

const example = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = stepOne(values);
  console.log("example result =", result);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = stepOne(values);
  console.log(`result =`, result);
};

example();
run();
