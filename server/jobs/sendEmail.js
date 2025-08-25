const createTransporter = require("./mailer");

async function sendEmail(notification) {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from:
        notification.from || `"Clinic Reminder" <${process.env.EMAIL_USER}>`,
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

module.exports = sendEmail;
