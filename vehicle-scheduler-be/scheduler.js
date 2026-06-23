const fs = require("fs");
require("dotenv").config();

const axios = require("axios");
const Log = require("../logging-middleware/logger");

async function runScheduler() {

  const depotResponse = await axios.get(
    "http://4.224.186.213/evaluation-service/depots",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    }
  );

  const vehicleResponse = await axios.get(
    "http://4.224.186.213/evaluation-service/vehicles",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    }
  );

  const depots = depotResponse.data.depots;
  const vehicles = vehicleResponse.data.vehicles;

  let results = [];

  for (const depot of depots) {

    const capacity = depot.MechanicHours;

    const selectedTasks = knapsack(
      vehicles,
      capacity
    );

    console.log("\n====================");
    console.log(`Depot ${depot.ID}`);
    console.log(`Hours: ${capacity}`);
    console.log(
      `Selected Tasks: ${selectedTasks.length}`
    );

    let totalImpact = 0;
    let totalDuration = 0;

    selectedTasks.forEach(task => {
      totalImpact += task.Impact;
      totalDuration += task.Duration;
    });

    console.log("Total Duration:", totalDuration);
    console.log("Total Impact:", totalImpact);

    results.push({
      depotId: depot.ID,
      mechanicHours: capacity,
      totalDuration,
      totalImpact,
      selectedTasks: selectedTasks.map(
        task => task.TaskID
      )
    });

    await Log(
      "backend",
      "info",
      "service",
      `Depot ${depot.ID} scheduled successfully`
    );

  }

  fs.writeFileSync(
    "output.json",
    JSON.stringify(results, null, 2)
  );

  console.log("\nResults saved to output.json");

}

function knapsack(tasks, capacity) {

  const n = tasks.length;

  const dp = Array(n + 1)
    .fill()
    .map(() =>
      Array(capacity + 1).fill(0)
    );

  for (let i = 1; i <= n; i++) {

    const duration =
      tasks[i - 1].Duration;

    const impact =
      tasks[i - 1].Impact;

    for (let w = 0; w <= capacity; w++) {

      if (duration <= w) {

        dp[i][w] = Math.max(
          impact +
          dp[i - 1][w - duration],
          dp[i - 1][w]
        );

      } else {

        dp[i][w] = dp[i - 1][w];

      }

    }

  }

  let result = [];
  let w = capacity;

  for (let i = n; i > 0; i--) {

    if (
      dp[i][w] !== dp[i - 1][w]
    ) {

      result.push(tasks[i - 1]);

      w -= tasks[i - 1].Duration;

    }

  }

  return result;

}

module.exports = runScheduler;