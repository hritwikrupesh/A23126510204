
require("dotenv").config();

const fs = require("fs");
const getNotifications = require("./notifications");

async function main() {

  const notifications =
    await getNotifications();

  const priority = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  const sorted =
    notifications.sort((a, b) => {

      const scoreA =
        priority[a.Type] || 0;

      const scoreB =
        priority[b.Type] || 0;

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      return new Date(b.Timestamp)
        - new Date(a.Timestamp);

    });

  const top10 =
    sorted.slice(0, 10);

  fs.writeFileSync(
    "top10-notifications.json",
    JSON.stringify(top10, null, 2)
  );

  console.log("\nTOP 10 PRIORITY NOTIFICATIONS\n");

  top10.forEach((n, index) => {

    console.log(
      `${index + 1}. ${n.Type} | ${n.Message} | ${n.Timestamp}`
    );

  });

  console.log(
    "\nResults saved to top10-notifications.json"
  );

}

main();

