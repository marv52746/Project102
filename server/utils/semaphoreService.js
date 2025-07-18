// /utils/semaphoreService.js
const axios = require("axios");

const API_KEY = process.env.SEMAPHORE_API_KEY;
// const API_KEY = ""; // Replace with your Semaphore API key
const SENDER_NAME = "Clinic"; // Must be registered in Semaphore

async function sendSMS(number, message) {
  try {
    const response = await axios.post(
      "https://api.semaphore.co/api/v4/messages",
      {
        apikey: API_KEY,
        number,
        message,
        sendername: SENDER_NAME,
      }
    );
    console.log("SMS sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendSMS };
