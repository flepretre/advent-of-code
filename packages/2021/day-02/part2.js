const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const stepOne = (values) => {
  const match = /^(?<direction>[a-z]*) (?<value>.*)$/;
  let x = 0;
  let y = 0;
  let aim = 0;

  values.forEach((v) => {
    const {
      groups: { direction, value },
    } = match.exec(v);

    let amount = parseInt(value);
    switch (direction) {
      case "up":
        aim -= amount;
        break;
      case "down":
        aim += amount;
        break;
      case "forward":
        x += amount;
        y += aim * amount;
        break;
      default:
        break;
    }

    console.log(`x: ${x} ; y: ${y}`);
  });

  return { x, y };
};

const run = async () => {
  const values = await read("./data.txt", "utf8").then((data) =>
    data.split("\n")
  );

  const { x, y } = stepOne(values);
  console.log(`result = `, x * y);
};

run();
