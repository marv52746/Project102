require("dotenv").config();
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { NotificationDb } = require("../model/notifications/Notification");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// helper
async function sendNotificationEmail(notification) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.CLINIC_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from:
        notification.from || `"Clinic Reminder" <${process.env.CLINIC_EMAIL}>`,
      to: notification.to,
      subject: notification.subject,
      text: notification.text,
    };

    await transporter.sendMail(mailOptions);

    notification.status = "sent";
    await notification.save();
    console.log(`✅ Email sent to ${notification.to}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${notification.to}:`, err);
    notification.status = "failed";
    await notification.save();
  }
}

async function sendPendingEmailNotifications() {
  try {
    const pending = await NotificationDb.find({ status: "pending" });
    if (!pending.length) {
      console.log("ℹ️ No pending email notifications.");
      return;
    }

    console.log(`📧 Found ${pending.length} pending notifications.`);
    for (let notif of pending) {
      await sendNotificationEmail(notif);
    }
  } catch (err) {
    console.error("❌ Error processing pending notifications:", err);
  }
}

module.exports = sendPendingEmailNotifications;
