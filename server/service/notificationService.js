const { NotificationDb } = require("../model/notifications/Notification");

function baseEmailTemplate({
  title,
  message,
  clinicName = "Your Clinic",
  logoUrl,
}) {
  return `
  <table align="center" cellpadding="0" cellspacing="0" width="100%" 
    style="max-width:600px;margin:auto;background:#ffffff;
           border-radius:8px;overflow:hidden;
           box-shadow:0 2px 8px rgba(0,0,0,0.1);font-family:Arial,sans-serif;">
    <tr>
      <td style="background:#1976d2;color:#ffffff;padding:20px;text-align:center;">
        ${
          logoUrl
            ? `<img src="${logoUrl}" alt="${clinicName}" style="max-height:40px;margin-bottom:5px;display:block;margin:auto;" />`
            : ""
        }
        <div style="font-size:20px;font-weight:bold;margin:0;">${clinicName}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;font-size:16px;line-height:1.5;color:#333;">
        <h2 style="margin:0 0 10px;font-size:18px;color:#1976d2;">${title}</h2>
        <div style="margin:0;">${message}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:15px;background:#f9f9f9;text-align:center;font-size:12px;color:#777;">
        &copy; ${new Date().getFullYear()} ${clinicName}. All rights reserved.
      </td>
    </tr>
  </table>`;
}

function formatTimeToAMPM(timeStr) {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Dynamic templates for different notification types
const notificationTemplates = {
  patient: {
    create: (data) => {
      return {
        subject: "Clinic - Appointment Created",
        html: baseEmailTemplate({
          title: "Appointment Created",
          message: `Hello ${
            data.patient.name || "Patient"
          }! Your appointment has been created.
                    <br><br><strong>Date:</strong> ${new Date(
                      data.date
                    ).toDateString()}
                    <br><strong>Time:</strong> ${formatTimeToAMPM(data.time)}
                    <br><strong>Doctor:</strong> ${data.doctor.name}
                    <br><strong>Reason:</strong> ${data.reason}`,
        }),
      };
    },
    appointmentReminder: (data) => {
      return {
        subject: "Clinic - Appointment Reminder",
        html: baseEmailTemplate({
          title: "Appointment Reminder",
          message: `Hello ${data.patient.name || "Patient"},<br>
                    This is a friendly reminder of your appointment:
                    <br><br><strong>Date:</strong> ${new Date(
                      data.date
                    ).toDateString()}
                    <br><strong>Time:</strong> ${formatTimeToAMPM(data.time)}
                    <br><strong>Doctor:</strong> ${data.doctor.name}
                    <br><strong>Reason:</strong> ${data.reason}
                    <br><br>Please arrive 10–15 minutes early.`,
        }),
      };
    },
  },
  staff: {
    stockAlerts: (data) => ({
      subject: "Clinic - Stock Alert",
      html: baseEmailTemplate({
        title: "Stock Alert",
        message: `Low stock detected:
                  <br><strong>Name:</strong> ${data.name}
                  <br><strong>Category:</strong> ${data.category}
                  <br><strong>Quantity:</strong> ${data.quantity}
                  <br><strong>Unit:</strong> ${data.unit}`,
      }),
    }),
  },
  emergency: {
    alert: (data) => ({
      subject: "Clinic - 🚨 Emergency Alert",
      html: baseEmailTemplate({
        title: "🚨 Emergency Alert",
        message: `${data.message}`,
      }),
    }),
  },
};

async function createNotificationService({
  category,
  type,
  data = {},
  recipients = [],
  cc = [],
  bcc = [],
  status = "pending",
}) {
  try {
    console.log("createNotificationService");
    // ✅ Resolve template
    const template = notificationTemplates?.[category]?.[type]?.(data) || {
      subject: "Notification",
      text: "You have a new notification.",
    };

    // // ✅ Create notifications for each recipient
    // const notifications = recipients.map((email) => ({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: template.subject,
    //   text: template.text,
    //   status,
    //   sendAt: new Date(),
    // }));
    // console.log(template);

    // ✅ Build notification with CC and BCC
    const notification = {
      from: process.env.EMAIL_USER,
      to: recipients.join(","), // multiple recipients
      cc: cc.length ? cc.join(",") : undefined, // add only if provided
      bcc: bcc.length ? bcc.join(",") : undefined,
      subject: template.subject,
      html: template.html,
      // html: template.html,
      status,
      sendAt: data.date || new Date(),
    };

    console.log(notification);

    // Save to DB
    const saved = await NotificationDb.create(notification);

    // Auto-send if immediate
    if (status === "immediate") {
      const sendEmail = require("../jobs/sendEmail");
      await sendEmail(saved); // no need for loop
    }

    return saved;
  } catch (err) {
    console.error("❌ Error creating notification:", err.message);
    throw err;
  }
}

module.exports = { createNotificationService };
