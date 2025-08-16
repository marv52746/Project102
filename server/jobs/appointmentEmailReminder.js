const nodemailer = require("nodemailer");
const { google } = require("googleapis");

async function sendEmailReminders() {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // same redirect URI you used
    );

    // set your refresh token
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    // get fresh access token
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER, // your Gmail address
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token, // <— must use .token
      },
    });

    const mailOptions = {
      from: `"Clinic Reminder" <${process.env.EMAIL_USER}>`,
      to: "recipient@example.com", // can be dynamic from DB
      subject: "Daily Reminder",
      text: "This is your daily appointment reminder!",
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Daily reminder email sent!");
  } catch (err) {
    console.error("❌ Error sending reminder:", err);
  }
}

module.exports = sendEmailReminders;
