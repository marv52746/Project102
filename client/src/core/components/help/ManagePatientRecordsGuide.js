import React from "react";
import { Clock, User, ExternalLink } from "lucide-react";
import GuideSteps from "./GuideSteps";

const ManagePatientRecordsGuide = () => {
  const steps = [
    {
      title: "Go to Your Personal Dashboard",
      description:
        "Start by accessing your personal dashboard from the main navigation panel. This is where you can view your recent activities, appointments, and patients.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/d984bbb9-e4fc-4f89-a364-318e3b99e32b/980d4a43-3aa1-488d-bd47-1b1182378353.png",
    },
    {
      title: "Click on 'Recent Patients'",
      description:
        "From your dashboard, select **Recent Patients** to quickly access your latest patient interactions.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/3399537f-0cb5-4140-a391-dd4d3bfbe968/de017fc2-0ec1-4d20-88e1-cd575e13a9d0.png",
    },
    {
      title: "Open a Patient Profile",
      description:
        "Click on any patient from the list to open their personal dashboard. This page contains their complete medical history and activity records.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/1553fdc0-f146-4c32-a6bb-b424165501b4/83c5f3ff-4ca5-4ace-bdab-5e9167803377.png",
    },
    {
      title: "Explore the Patient Dashboard",
      description:
        "The patient dashboard displays key information such as recent vitals, upcoming appointments, and printable patient summaries.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/82dcc954-4eb5-4000-a439-8c66ae663770/5c831e77-2958-446a-993f-a71b1d489e0b.png",
    },
    {
      title: "Access Clinical Records",
      description:
        "Go to the **Clinical Records** tab to view the patient’s diagnosis, medications, pregnancy history, ultrasounds, lab requests, allergies, surgeries, and vitals.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/6fc07d94-ef41-4bfd-88b3-9e9773b2b7b1/a813cf76-834b-4bef-9790-6add4c7a9ca2.png",
    },
    {
      title: "View Appointments in Calendar Mode",
      description:
        "Switch to the **Calendar** tab to see all patient appointments organized by date for better schedule tracking.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/9059cf39-8e9e-4d38-83b2-bdb2c1dafbac/f2057d63-4eeb-49d8-bbe7-4e57be80a1c0.png",
    },
    {
      title: "Check Appointment History",
      description:
        "The **Appointment History** tab lists all past appointments, including completed and canceled sessions.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/eb0cdc07-af4b-491b-8e4d-70048d38ddab/7e978b02-d2d5-44c4-a841-d04f1b88a593.png",
    },
    {
      title: "Edit Clinical Records",
      description:
        "Within the Clinical Records tab, doctors can click on a record to view, update, or delete clinical data.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/91e781b3-bbdf-4329-aba3-736bfc4baad2/a5578a15-e49d-4d66-8c76-c18fb1edf3b2.png",
    },
    {
      title: "Use the Clinical Record Form",
      description:
        "A modal form will pop up, allowing you to modify or remove clinical information as needed.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/1bb5a9b3-011e-4a24-82a4-8a9c917de50e/43e0c350-98b9-4397-8c32-0503d45cf548.png",
    },
    {
      title: "Print the Patient Record",
      description:
        "Click **Print Patient Record** to generate a comprehensive printable summary of the patient’s medical history.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/3d861f2c-e10f-46bd-a906-08eb9d074a3a/53917c7a-4388-4c5c-b1eb-663beb2489a5.png",
    },
    {
      title: "Access More Options",
      description:
        "Click the **three dots** on the top-right corner of the dashboard to reveal actions like editing or deleting patient data.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/c96d79b5-f6aa-4a3e-a1d8-dc26c1053c6b/90796a80-ddf4-40c2-8653-b474a4305657.png",
    },
    {
      title: "Edit Patient Information",
      description:
        "Selecting **Edit** will redirect you to the User Form, where you can update patient details securely.",
      img: "https://images.tango.us/workflows/4e074e68-e446-4cce-baad-5a002b88fdb5/steps/58110f71-86c6-4ebb-bf43-4fac549f80d6/f5a12b8b-0b63-4dcc-8897-7f39253e2d82.png",
    },
  ];

  return (
    <GuideSteps
      title="Managing Patient Records"
      date="Oct 28, 2025"
      author="Marvin Las Piñas"
      steps={steps}
    />
  );
};

export default ManagePatientRecordsGuide;
