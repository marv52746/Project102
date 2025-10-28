import React from "react";
import GuideSteps from "./GuideSteps";

export default function ScheduleAndManageAppointmentsGuide() {
  const steps = [
    {
      title: "Go to Your Personal Dashboard",
      description:
        "After signing in to your account, look at the sidebar menu on the left side of your screen. Click on your profile or the icon showing your user picture to open your personal workspace. This is where you can view your upcoming appointments, patient list, and quick actions.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/d6176ad9-62be-421d-b800-5fb7f795c9c3/e2a28519-02a4-419f-8c4b-7a2dd6f47f38.png",
    },
    {
      title: "Click on 'New Appointment'",
      description:
        "To create a new appointment, click the **New Appointment** button at the top beside New Patient button. This will open the appointment creation form where you can register a new session for a patient.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/d0031096-9e36-4a0b-9702-7b7368cd2fd3/62d9d8e0-912f-4bc5-ba32-17355e3808a3.png",
    },
    {
      title: "Fill Out the Appointment Details",
      description:
        "In the appointment form, fill out all the required information:\n\n- **Patient Name:** Select the existing patient from the list.\n- **Doctor:** Choose the attending doctor for this appointment.\n- **Date:** Set the correct schedule for the appointment.\n- **Session:** Choose whether the appointment will take place in the **Morning** or **Afternoon** slot.\n- **Appointment Reason:** Provide a short note describing the patient's concern or the purpose of the visit.\n\nDouble-check all entries before submitting to ensure accuracy and avoid scheduling conflicts.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/bd8deb0e-e5a7-447b-b5e6-eb15bf298c20/5b8c05d4-7e6e-49fc-bad5-0655dc9598a9.png",
    },

    {
      title: "Click 'Submit' to Save the Appointment",
      description:
        "Once all fields are filled out correctly, click the **Submit** button. This action will save the appointment record in the system and automatically place it under **Appointments Scheduled Today** if it’s for the current date.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/8ac30e2f-a075-4195-b9b6-403b3a52ffe5/8c6ff086-b289-43ad-b126-db00b4e0d184.png",
    },
    {
      title: "Review 'Appointments Scheduled Today'",
      description:
        "After submission, go to the **Appointments Scheduled Today** tab on your dashboard. You’ll see the new appointment added to the list. This helps staff track which patients are expected to arrive on the same day.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/47837a99-d667-4f4d-9b7e-fa2bb5a72d8f/0c32a12f-378c-474d-8dc7-7cb8366f951a.png",
    },
    {
      title: "Click on an Appointment to View Details",
      description:
        "To check appointment information or update its status, click on the appointment entry in the list. This will open the detailed view page where all information about the appointment can be reviewed or modified.",
      img: "",
    },
    {
      title: "Review the Appointment Details Page",
      description:
        "In this view, you’ll find complete appointment details including:\n\n- Patient and Doctor Information\n- Date and Session\n- Consultation Fee and Status\n- Diagnosis and Notes (if available)",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/0ca4f5dd-a1c0-49c2-a6c8-a253d3e63524/7c1d333b-a41f-47df-8bfa-84215990c754.png",
    },
    {
      title: "Record the Patient’s Vitals",
      description:
        "Click on the **Vitals** tab to input the patient’s vital signs before the doctor’s consultation. Include measurements such as blood pressure, temperature, heart rate, weight, and height. When finished, click **Save**.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/d26484a6-75c5-4660-be27-dfbd443b3137/0c9b5610-03bb-4e64-9a57-6c6010728d85.png",
    },
    {
      title: "Mark the Appointment as 'Ready'",
      description:
        "Once the patient’s vitals are recorded, click **Mark as Ready**. This moves the appointment to the **Lobby** section, meaning the patient is now ready to be seen by the doctor.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/e3129d9c-422d-45d3-adc5-08f7fbab3ad8/acfe86f5-9766-477d-971e-e437faafb2e0.png",
    },
    {
      title: "Understand the Lobby and Ongoing Flow",
      description:
        "Patients in the **In Lobby** are waiting for their turn to be consulted. When the doctor begins the consultation, update the appointment status to **Ongoing**. Once completed, the doctor can mark it as **Completed**. This helps track patient progress throughout the day and maintain an organized workflow.",
      img: "https://images.tango.us/workflows/2dde86b5-d63f-488e-b0c0-e1c4b3426793/steps/910ea1b2-7bef-43f7-a10f-c9030645802c/efc60e4b-6bdc-4224-a99f-b43793bfb684.png",
    },
  ];

  return (
    <GuideSteps
      title="Schedule and Manage Appointments"
      date="Oct 28, 2025"
      author="Marvin Las Piñas"
      steps={steps}
    />
  );
}
