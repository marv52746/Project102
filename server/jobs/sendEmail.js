const createTransporter = require("./mailer");

async function sendEmail(notification) {
  try {
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
          path: "assets/images/logo.png", // absolute or relative path to your logo
          cid: "clinicLogo", // same as used in html <img src="cid:clinicLogo" />
        },
      ],
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
