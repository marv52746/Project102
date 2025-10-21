const createTransporter = require("./jobs/mailer");

(async () => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"Clinic" <${process.env.CLINIC_EMAIL}>`,
      to: "marvin.duane2022@gmail.com",
      subject: "Test Email",
      text: "This is a test from VPS",
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
})();
