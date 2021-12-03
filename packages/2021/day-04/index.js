const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const process = (values) => {};

const example = async () => {
  const values = await read("./example.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = process();
  console.log("example result =", result);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = process();
  console.log(`result =`, result);
};

example();
run();
