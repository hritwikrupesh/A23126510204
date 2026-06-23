require("dotenv").config();

const axios = require("axios");

const Log = async (stack, level, packageName, message) => {
  try {

    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    return response.data;

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

  }
};

module.exports = Log;