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

const filter = (values, value, i) =>
  values.filter((v) => {
    console.log("v[0]", v[i], v);
    return v[i] == value;
  });

const process = (values, compute) => {
  let filtered = values;
  let i = 0;
  while (filtered.length > 1 && i < filtered[0].length) {
    const ordered = reorder(filtered);
    // console.log(ordered);
    let v = compute(ordered, i);
    filtered = filter(filtered, v, i);
    i++;
  }

  // console.log(filtered);
  return filtered;
};

const example = async () => {
  const values = await read("./example.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const a = process(values, (ordered, i) =>
    ordered[i]["0"] <= ordered[i]["1"] ? "1" : "0"
  );
  const b = process(values, (ordered, i) =>
    ordered[i]["0"] <= ordered[i]["1"] ? "0" : "1"
  );
  console.log("example result =", a, b);
  return parseInt(a, 2) * parseInt(b, 2);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const a = process(values, (ordered, i) =>
    ordered[i]["0"] <= ordered[i]["1"] ? "1" : "0"
  );
  const b = process(values, (ordered, i) =>
    ordered[i]["0"] <= ordered[i]["1"] ? "0" : "1"
  );
  console.log("example result =", a, b, parseInt(a, 2) * parseInt(b, 2));
  return parseInt(a, 2) * parseInt(b, 2);
};

example();
run();
