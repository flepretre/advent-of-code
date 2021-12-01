const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const setOne = (values) => {
  let previousValue = null;
  let increaseNb = 0;
  values.forEach((value) => {
    const current = parseInt(value);
    if (previousValue) {
      if (parseInt(current) > previousValue) {
        increaseNb++;
        console.log(
          `${current} (increased) ${increaseNb} (${current} > ${previousValue})`
        );
      } else if (parseInt(current) === previousValue) {
        console.log(
          `${current} (same) ${increaseNb} (${current} > ${previousValue})`
        );
      } else {
        console.log(
          `${current} (decreased) ${increaseNb} (${current} <= ${previousValue})`
        );
      }
    } else {
      console.log("(N/A - no previous measurement)");
    }
    previousValue = current;
  });
  console.log(`total of ${increaseNb} increased`);
};

const setTwo = (values) => {
  let a, b, c, previousSum;
  let increaseNb = 0;
  values.forEach((value) => {
    const current = parseInt(value);
    c = b;
    b = a;
    a = current;

    if (a && b && c) {
      const currentSum = a + b + c;
      if (previousSum) {
        if (currentSum > previousSum) {
          increaseNb++;
          console.log(`${currentSum} (increased) (${previousSum})`);
        } else if (currentSum === previousSum) {
          console.log(`${currentSum} (no change) (${previousSum})`);
        } else {
          console.log(`${currentSum} (decreased) (${previousSum})`);
        }
      } else {
        console.log("(N/A - no previous sum)");
      }
      previousSum = currentSum;
    }
  });
  console.log(`total of ${increaseNb} increased`);
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  setTwo(values);
};

run();
