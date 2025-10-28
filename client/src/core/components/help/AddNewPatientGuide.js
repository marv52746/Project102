import React from "react";
import GuideSteps from "./GuideSteps";

export default function AddNewPatientGuide() {
  const steps = [
    {
      title: "Sign in to your account",
      description:
        "Go to the Bislig Premier Birthing Home login page and enter your username and password. This ensures that only authorized staff can access the system. Once logged in, you’ll be redirected to your dashboard.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/3ee9d1fd-1d47-402a-a0f8-b64c92ac96db/2ed6ad9e-055c-4161-8b87-6ec7d01f7c1e.png",
    },
    {
      title: "Open your sidebar profile",
      description:
        "On the left-hand side of the screen, you’ll see the sidebar menu. Click on your profile or the icon showing your user picture. This will open your dashboard, quick actions are visible including the 'New Patient' button.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/bc0f1ef7-c07f-4643-b79e-8c8a4884bf4a/7b7438fc-6b1c-46a1-b3b6-1eb78dca730b.png",
    },
    {
      title: "Click on 'New Patient'",
      description:
        "Click the 'New Patient' button. This will open a registration form where you can input all the patient’s details.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/d42d20d7-d6b1-4964-aad3-9d1a63dd9ab2/e7aa99a5-6f97-4041-9195-4f9ea5e37554.png",
    },
    {
      title: "Fill out the patient information form",
      description:
        "Enter all the required details such as full name, birthday, contact number, address, and other relevant information. Make sure the details are accurate — this information will appear on all patient records.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/8a870ca9-1fea-436e-bb13-4bd6eac11bdf/e825954b-b52e-45d9-9b77-5ce8553dd4f3.png",
    },
    {
      title: "Upload a profile photo (optional but recommended)",
      description:
        "Click on the 'Choose File' button to upload the patient’s profile picture. This helps easily identify the patient in the system. Use a clear and recent photo if available.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/bafc03c6-80c5-4314-ba51-d99f67215697/eabc7812-8d0d-4f7f-87ff-c8afb5c7bc22.png",
    },
    {
      title: "Click 'Submit' to save the patient record",
      description:
        "After filling out all required fields, click the 'Submit' button at the bottom of the form. The system will automatically save the new patient record and notify you once it’s successful.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/60593c00-2e81-4a1b-913a-7fbd4593a18e/83763485-68e0-42d8-8852-daa56000e580.png",
    },
    {
      title: "Go to the 'Patients' page",
      description:
        "Once the patient is successfully added, open the 'Patients' menu from the sidebar. This section lists all existing patient records in the system.",
      img: "",
    },
    {
      title: "Verify the newly created patient record",
      description:
        "Look for the patient’s name in the list to confirm that the registration was successful. You can use the search bar at the top of the Patients page to find them quickly.",
      img: "https://images.tango.us/workflows/89fff177-28ff-4318-bacb-adb5d3496597/steps/9f0240f7-231d-4de5-88a4-c6f6de40c00b/88623669-ce0f-4503-822e-146f1e33f4e5.png",
    },
  ];

  return (
    <GuideSteps
      title="How to Add a New Patient"
      date="Oct 28, 2025"
      author="Marvin Las Piñas"
      steps={steps}
    />
  );
}
