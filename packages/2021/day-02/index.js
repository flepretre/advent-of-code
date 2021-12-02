const fs = require("fs");
const util = require("util");

const read = util.promisify(fs.readFile);

const stepOne = (values) => {
  const match = /^(?<direction>[a-z]*) (?<value>.*)$/;
  let x = 0;
  let y = 0;

  values.forEach((v) => {
    const {
      groups: { direction, value },
    } = match.exec(v);

    switch (direction) {
      case "up":
        y -= parseInt(value);
        break;
      case "down":
        y += parseInt(value);
        break;
      case "forward":
        x += parseInt(value);
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
