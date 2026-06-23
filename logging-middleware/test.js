const Log = require("./logger");

async function test() {

  const result = await Log(
    "backend",
    "info",
    "service",
    "Logging middleware initialized"
  );

  console.log(result);

}

test();