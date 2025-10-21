require("dotenv").config();
const createTransporter = require("./mailer");

async function sendEmail(notification) {
  console.log("🧾 sendEmail() called with:", notification._id);
  try {
    console.log("ENV CHECK:", {
      CLIENT_ID: !!process.env.CLIENT_ID,
      CLIENT_SECRET: !!process.env.CLIENT_SECRET,
      REFRESH_TOKEN: !!process.env.REFRESH_TOKEN,
      CLINIC_EMAIL: process.env.CLINIC_EMAIL,
    });

    if (!notification.to) {
      console.error("❌ No recipient email provided");
      return;
    }

    const transporter = await createTransporter();
    const mailOptions = {
      from:
        notification.from || `"Clinic Reminder" <${process.env.CLINIC_EMAIL}>`,
      to: notification.to,
      cc: notification.cc || undefined,
      bcc: notification.bcc || undefined,
      subject: notification.subject,
      html: notification.html,
      replyTo: notification.replyTo || process.env.CLINIC_EMAIL,
      // html: "<h1>Welcome</h1><p>That was easy!</p>",
      // text: notification.text || "Your email client does not support HTML.", // fallback
      attachments: [
        {
          filename: "logo.png",
          path: "assets/images/Logo.png", // absolute or relative path to your logo
          cid: "clinicLogo", // same as used in html <img src="cid:clinicLogo" />
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    notification.status = "sent";
    await notification.save();
    console.log(`✅ Email sent to ${notification.to}`);
  } catch (err) {
    console.error(
      `❌ Failed to send email to ${notification.to}:`,
      err.message
    );
    notification.status = "failed";
    await notification.save();
  }
}

module.exports = sendEmail;
