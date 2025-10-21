require("dotenv").config();
const { NotificationDb } = require("../model/notifications/Notification");

const DEFAULT_CLINIC_NAME = "Bislig Premier Birthing Home";

function baseEmailTemplate({
  title,
  message,
  data,
  clinicName = DEFAULT_CLINIC_NAME,
  button,
}) {
  return `
 <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      font-family: Arial, sans-serif;
    "
  >
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
    >
      <tr>
        <td align="center" style="padding: 30px 15px">
          <!-- Card Container -->
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="
              max-width: 600px;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="background: #ffffff; padding: 20px; text-align: center"
              >
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  align="center"
                  style="margin: 0 auto"
                >
                  <tr>
                    <td style="padding-right: 10px">
                      <img
                        src="cid:clinicLogo"
                        alt="${clinicName}"
                        style="
                          max-height: 40px;
                          display: block;
                          background: #fff;
                        "
                      />
                    </td>
                    <td style="text-align: left; vertical-align: middle">
                      <h1
                        style="
                          margin: 0;
                          font-size: 22px;
                          font-weight: bold;
                          line-height: 1.2;
                          color: #ec4899;
                        "
                      >
                        ${clinicName}
                      </h1>
                      <p
                        style="margin: 4px 0 0; font-size: 13px; color: #6b7280"
                      >
                        Women’s wellness and motherhood, nurtured with care
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0">
                <hr
                  style="border: none; border-top: 1px solid #e5e7eb; margin: 0"
                />
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                style="
                  padding: 30px 25px;
                  color: #333333;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                <h2 style="margin: 0 0 15px; font-size: 20px; color: #ec4899">
                  ${title}
                </h2>
                <p style="margin: 0 0 20px">
                  Hello ${data.greetingName || "there"},
                </p>

                <p style="margin: 0 0 20px">
                ${message.appointmentScheduled}
                </p>

                <!-- Appointment Details Card -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    background: #f9fafb;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                  "
                >
                  ${message.details}
                </table>

                ${
                  button
                    ? `
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${button.url}" 
                     style="
                      display: inline-block;
                      background-color: #ec4899;
                      color: #fff;
                      text-decoration: none;
                      font-weight: bold;
                      border-radius: 6px;
                      padding: 12px 20px;
                    ">
                    ${button.label}
                  </a>
                </div>
                `
                    : ""
                }

                <p style="margin: 20px 0 0">
                ${message.pleaseArrive}
                </p>

                <p style="margin: 20px 0 0">
                ${message.lookForward}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background: #f9fafb;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #6b7280;
                "
              >
                &copy; ${new Date().getFullYear()} ${clinicName}. All rights
                reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
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
        subject: "Birthing Home - Appointment Created",
        html: baseEmailTemplate({
          title: "Appointment Confirmed",
          data: {
            ...data,
            greetingName: data.patient.first_name,
          },
          message: {
            appointmentScheduled:
              "Your appointment has been successfully scheduled. Here are the details:",
            lookForward: "We look forward to seeing you! 💖",
            pleaseArrive: `Please arrive 10–15 minutes early to allow time for
                  check-in.<br />If you need to reschedule, kindly contact us at
                  least 24 hours in advance.`,
            details: `<tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      📅 <strong>Date:</strong> ${new Date(
                        data.date
                      ).toDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      ⏰ <strong>Time:</strong> ${formatTimeToAMPM(data.time)}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      👩‍⚕️ <strong>Doctor:</strong> ${data.doctor.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      📝 <strong>Reason:</strong> ${data.reason}
                    </td>
                  </tr>`,
          },
        }),
      };
    },
    appointmentReminder: (data) => {
      return {
        subject: "Birthing Home - Appointment Reminder (Today)",
        html: baseEmailTemplate({
          title: "Appointment Reminder",
          data: {
            ...data,
            greetingName: data.patient.first_name,
          },
          message: {
            appointmentScheduled:
              "This is a reminder that your appointment is scheduled for today. Here are the details:",
            lookForward: "We look forward to seeing you! 💖",
            pleaseArrive: `Please arrive 10–15 minutes early to allow time for
                  check-in.<br />If you need to reschedule, kindly contact us at
                  least 24 hours in advance.`,
            details: `<tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      📅 <strong>Date:</strong> ${new Date(
                        data.date
                      ).toDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      ⏰ <strong>Time:</strong> ${formatTimeToAMPM(data.time)}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      👩‍⚕️ <strong>Doctor:</strong> ${data.doctor.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px; padding: 5px 0">
                      📝 <strong>Reason:</strong> ${data.reason}
                    </td>
                  </tr>`,
          },
        }),
      };
    },
  },
  staff: {
    stockAlerts: (data) => ({
      subject: "Birthing Home - Stock Alert",
      html: baseEmailTemplate({
        title: "Stock Alert",
        data: {
          ...data,
          greetingName: "Team",
        },
        message: {
          appointmentScheduled: "A stock item has reached a low quantity:",
          details: `
          <tr>
            <td style="font-size: 15px; padding: 5px 0">
              📦 <strong>Name:</strong> ${data.name}
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px; padding: 5px 0">
              🗂 <strong>Category:</strong> ${data.category}
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px; padding: 5px 0">
              🔢 <strong>Quantity:</strong> ${data.quantity}
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px; padding: 5px 0">
              ⚖️ <strong>Unit:</strong> ${data.unit}
            </td>
          </tr>`,
          pleaseArrive: "",
          lookForward: "",
        },
      }),
    }),
  },
  emergency: {
    alert: (data) => ({
      subject: "Birthing Home - 🚨 Emergency Alert",
      html: baseEmailTemplate({
        title: "🚨 Emergency Alert",
        data: {
          ...data,
          greetingName: "All",
        },
        message: {
          appointmentScheduled: "An emergency alert has been issued:",
          details: `
          <tr>
            <td style="font-size: 15px; padding: 5px 0; color: #dc2626;">
              ⚠️ ${data.message}
            </td>
          </tr>`,
          pleaseArrive: "",
          lookForward: "",
        },
      }),
    }),
  },
  contact: {
    message: (data) => {
      return {
        subject: `Birthing Home - New Contact Message from ${
          data.name || "Someone"
        }`,
        html: baseEmailTemplate({
          title: "New Contact Message",
          data: {
            ...data,
            greetingName: "Team",
          },
          message: {
            appointmentScheduled:
              "You have received a new inquiry via the contact form:",
            details: `
            <tr>
              <td style="font-size: 15px; padding: 5px 0">
                👤 <strong>Name:</strong> ${data.name || "N/A"}
              </td>
            </tr>
            <tr>
              <td style="font-size: 15px; padding: 5px 0">
                📧 <strong>Email:</strong> ${data.email || "N/A"}
              </td>
            </tr>
            <tr>
              <td style="font-size: 15px; padding: 5px 0">
                💬 <strong>Message:</strong><br>${data.message || ""}
              </td>
            </tr>`,
            pleaseArrive: "",
            lookForward: "",
          },
        }),
      };
    },
  },
  user_password: {
    create: (data) => ({
      subject: "Birthing Home - Your Account Details",
      html: baseEmailTemplate({
        title: "Your Account Has Been Created",
        data: {
          ...data,
          greetingName: data.user?.first_name || "there",
        },
        button: {
          label: "Log In to Your Account",
          url: `${process.env.FRONTEND_URL}/login`,
        },
        message: {
          appointmentScheduled: `An account has been created for you at ${DEFAULT_CLINIC_NAME}. 
            Below is your login information:`,
          details: `
          <tr>
            <td style="font-size: 15px; padding: 8px 0">
              📧 <strong>Email:</strong> ${data.user?.email}
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px; padding: 8px 0">
              🔑 <strong>Temporary Password:</strong> 
              <span style="font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">
                ${data.password}
              </span>
            </td>
          </tr>
        `,

          pleaseArrive: `For security, please log in and change your password as soon as possible.`,
          lookForward: "We look forward to supporting your wellness journey 💖",
        },
      }),
    }),
  },
  forgot_password: {
    create: (data) => ({
      subject: "Birthing Home - Temporary Password",
      html: baseEmailTemplate({
        title: "Password Reset Request",
        data: {
          ...data,
          greetingName: data.user?.first_name || "there",
        },
        button: {
          label: "Log In to Your Account",
          url: `${process.env.FRONTEND_URL}/login`,
        },
        message: {
          appointmentScheduled: `We have generated a new temporary password for your account at ${DEFAULT_CLINIC_NAME}.`,
          details: `
            <tr>
              <td style="font-size: 15px; padding: 8px 0">
                📧 <strong>Email:</strong> ${data.user?.email}
              </td>
            </tr>
            <tr>
              <td style="font-size: 15px; padding: 8px 0">
                🔑 <strong>Temporary Password:</strong> 
                <span style="font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">
                  ${data.password}
                </span>
              </td>
            </tr>
          `,
          pleaseArrive: `For security reasons, you must log in with this temporary password and change it immediately.`,
          lookForward: "Thank you for being with us 💖",
        },
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
    console.log("ENV CHECK:", {
      CLIENT_ID: !!process.env.CLIENT_ID,
      CLIENT_SECRET: !!process.env.CLIENT_SECRET,
      REFRESH_TOKEN: !!process.env.REFRESH_TOKEN,
      CLINIC_EMAIL: process.env.CLINIC_EMAIL,
    });
    console.log("createNotificationService");
    // ✅ Resolve template
    const template = notificationTemplates?.[category]?.[type]?.(data) || {
      subject: "Notification",
      text: "You have a new notification.",
    };

    // ✅ Build notification with CC and BCC
    const notification = {
      from: process.env.CLINIC_EMAIL, // default clinic email
      replyTo: category === "contact" && data.email ? data.email : undefined,
      to: recipients.join(","), // multiple recipients
      cc: cc.length ? cc.join(",") : undefined, // add only if provided
      bcc: bcc.length ? bcc.join(",") : undefined,
      subject: template.subject,
      html: template.html,
      // html: template.html,
      status,
      sendAt: data.date || new Date(),
    };

    // console.log(notification);

    // Save to DB
    const saved = await NotificationDb.create(notification);
    const freshNotification = await NotificationDb.findById(saved._id);
    // Auto-send if immediate
    if (status === "immediate") {
      const sendEmail = require("../jobs/sendEmail");
      await sendEmail(freshNotification); // no need for loop
    }

    return saved;
  } catch (err) {
    console.error("❌ Error creating notification:", err.message);
    throw err;
  }
}

module.exports = { createNotificationService };
