import React from "react";
import GuideSteps from "./GuideSteps";

export default function ManageConsultationsGuide() {
  const steps = [
    {
      title: "Login as Doctor",
      description:
        "Access the Bislig Premier Birthing Home portal using your doctor account credentials. This ensures you have permission to manage patient consultations.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/409b155a-0144-49eb-b1c2-a72e83ad5189/8172e0c2-3cc9-4ae9-af86-32f244c0af15.png",
    },
    {
      title: "Go to Your Personal Dashboard",
      description:
        "After logging in, click your profile picture at the bottom-left corner to open your personal dashboard. This is where you can access your ongoing and completed consultations.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/77526798-23a7-4993-ba26-f21366b5156b/b184ef9b-db9d-4aaa-879e-c529395a5b5d.png",
    },
    {
      title: "Open Ongoing Checkups",
      description:
        "Select ‘Ongoing Checkups’ to view a list of your patients who are currently under consultation. This is where you’ll manage active appointments.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/d0c9207c-f4ae-4f9e-921c-dd10721dca36/d8e9b10a-1232-4b25-9ef4-12799b2cc7f6.png",
    },
    {
      title: "View Appointment Details",
      description:
        "Inside an appointment, you’ll see quick action buttons such as Prescription, Diagnosis, Laboratory Request, Ultrasound, Surgery, and Allergy. These allow you to record medical details for each patient.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/6fed8431-5031-45af-9a62-d0744d682ae0/88879d07-1341-4659-a107-d868af51bfab.png",
    },
    {
      title: "Create a Prescription",
      description:
        "Click the 'Prescription' button to start adding prescribed medications. You can enter drug names, dosages, and instructions for the patient.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/497cf1b4-7b8f-4296-a3ea-d2a79eb66d62/68b21f36-b6b0-4f72-96cb-de70242a1718.png",
    },
    {
      title: "Fill Out Prescription Fields",
      description:
        "Enter all necessary medication details, including quantity and dosage. Use the ‘Add More’ button to include multiple prescriptions for the same patient.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/f50150c2-775b-413c-84c6-b19cf9e47637/84ab6dc6-9cc9-4302-8e72-16b43f3fb996.png",
    },
    {
      title: "Save All Prescriptions",
      description:
        "Click ‘Save All’ once you’ve added every required medication. This securely stores your prescription data in the patient’s record.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/aeb565f1-ca3c-4d1c-a1d0-cd6f52c7f62d/f703849e-79ec-4e13-8d18-a5539c3a9fb9.png",
    },
    {
      title: "Print the Prescription",
      description:
        "After saving, a print button will appear. Click it to generate and print the patient’s prescription for physical handover or filing.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/59c3e4f8-b904-4048-9f5c-fa9d8b3c371a/a6c0cc14-88a5-45c7-a1f9-ccd36f78e35b.png",
    },
    {
      title: "Add Consultation Fee",
      description:
        "Click the Consultation Fee edit button to enter the service charge for this appointment. This ensures proper billing and tracking of daily income.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/ed47efe4-3291-49f3-860f-c20d47f80668/268b742f-7edb-40b0-85de-01085fecaf1a.png",
    },
    {
      title: "Add Patient Diagnosis",
      description:
        "Click on ‘Diagnosis’ to record your findings and clinical notes. This helps document the patient’s condition and progress.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/7b62eb98-3ef0-4b84-a5e3-aa4bc73420c2/9856f53b-4567-4e7f-ace5-2c5c05232b85.png",
    },
    {
      title: "Save Diagnosis Details",
      description:
        "Add your diagnosis information and any relevant notes. Click ‘Save’ to attach it to the appointment record. Once saved, you can generate a Medical Certificate if needed.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/021b238a-3472-41df-a77b-94ff9cfcc024/7b9fa1ac-7bba-4a06-94de-4df244e66764.png",
    },
    {
      title: "Review Completed Actions",
      description:
        "Actions such as Diagnosis and Prescription will be marked as completed with a check mark. The appointment will now display all added medical details, and print options like the Medical Certificate will appear.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/0258198a-de78-402d-82a8-28b435aeaf35/b20a6c65-958c-447c-9c4f-fe303064f07c.png",
    },
    {
      title: "Mark the Appointment as Complete",
      description:
        "Once all actions are filled in, click ‘Mark as Complete’. This will finalize the consultation and move it to your completed appointments list.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/0cb8a308-5d0c-496b-ad8c-5f2d173b00d6/9b9417b9-6ea7-4594-8358-4d62791f7788.png",
    },
    {
      title: "View Updated Consultation Totals",
      description:
        "After completing the consultation, the fee is automatically added to the 'Total Consultation Fees (Today)' section on your Personal Dashboard for daily tracking.",
      img: "https://images.tango.us/workflows/9522b5f3-8a4f-4615-8028-f85b89499ec1/steps/b4266494-8463-41f2-9282-fe2cfa26ea5c/11b122b1-440e-42e5-9159-103f7aa11a44.png",
    },
  ];

  return (
    <GuideSteps
      title="Manage Patient Consultations"
      author="Marvin Las Piñas"
      date="Oct 28, 2025"
      link="https://app.tango.us/app/workflow/9522b5f3-8a4f-4615-8028-f85b89499ec1"
      steps={steps}
    />
  );
}
