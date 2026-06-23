require("dotenv").config();

const runScheduler = require("./scheduler");

async function start() {
  await runScheduler();
}

start();