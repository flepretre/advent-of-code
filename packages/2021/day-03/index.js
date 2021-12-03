const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const reorder = (values) =>
  values.reduce((acc, v) => {
    for (let i = 0; i < v.length; i++) {
      const c = parseInt(v[i]);
      if (typeof acc[i] === "undefined") {
        acc[i] = {
          0: 0,
          1: 0,
        };
      }
      acc[i][c]++;
    }
    return acc;
  }, []);

const stepOne = (values) => {
  const { gama, epsilon } = values.reduce(
    (acc, v) => ({
      gama: acc.gama + (v["0"] > v["1"] ? "0" : "1"),
      epsilon: acc.epsilon + (v["0"] > v["1"] ? "1" : "0"),
    }),
    { gama: "", epsilon: "" }
  );
  console.log(gama, epsilon);

  return parseInt(gama, 2) * parseInt(epsilon, 2);
};

const example = async () => {
  const values = await read("./example.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = stepOne(reorder(values));
  console.log("example result =", result);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const result = stepOne(reorder(values));
  console.log(`result =`, result);
};

example();
run();
