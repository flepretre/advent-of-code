const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

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

run();
