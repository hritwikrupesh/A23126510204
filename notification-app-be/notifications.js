require("dotenv").config();

const axios = require("axios");

async function getNotifications() {

  const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    }
  );

  return response.data.notifications;

}

module.exports = getNotifications;