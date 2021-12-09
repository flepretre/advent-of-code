const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const read = util.promisify(fs.readFile);

const lengths = [2, 4, 3, 7];
const dictionary = {
  5: ["cdfbe"],
  2: ["gcdfa"],
  3: ["fbcad"],
  9: ["cefabd"],
  6: ["cdfgeb"],
  0: ["cagedb"],
};

const matcher = (trash, line) => {
  const data = line.split(" ");
  const dic = {
    1: false,
    4: false,
    7: false,
    8: false,
  };

  const completeSequence = [...trash.split(" "), ...data];
  completeSequence.forEach((v) => {
    if (v.length === 2) dic[1] = v;
    if (v.length === 4) dic[4] = v;
    if (v.length === 3) dic[7] = v;
    if (v.length === 7) dic[8] = v;
  });
  let a, b, c, d, e, f;
  for (let i = 0; i < 3; i++) if (!dic[1].includes(dic[7][i])) a = dic[7][i];

  completeSequence.forEach((v) => {
    // 6 ou 9 ou 0
    if (v.length === 6) {
    }
  });
  if (!(dic[1] && dic[4] && dic[7] && dic[8])) console.log("missing one", dic);
};

const process = (values, debug = false) => {
  let count = 0;
  values.forEach((line) => {
    let digits = "";
    const [trash, data] = line.split(" | ");
    matcher(trash, data);

    count += parseInt(digits);
  });

  return count;
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
