import React from "react";
import { Clock, User } from "lucide-react";
import GuideSteps from "./GuideSteps";

const steps = [
  {
    title: "Access the Inventory Dashboard",
    description:
      "From the main navigation bar, click the **Inventory** tab. This will take you to the central dashboard where all inventory activities are managed.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/9d54373b-45fa-4204-8bae-9359b66ad382/b51768ab-0c96-422d-93b4-7ceb059fe789.png",
  },
  {
    title: "Explore the Inventory Dashboard Overview",
    description:
      "The dashboard displays key information to help you monitor inventory status:\n\n" +
      "- **Total Items:** Shows all items currently stored in the inventory.\n" +
      "- **Low Stock:** Lists items with quantities below the reorder threshold.\n" +
      "- **Soon to Expire:** Highlights items expiring within 30 days.\n" +
      "- **Transactions:** Displays this month’s recorded inventory activities.\n" +
      "- **Generate Report:** Allows you to download a PDF report for the current month.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/2fae4888-3e09-446a-a053-691e332e6155/b8df4466-f954-465f-a163-3ecfb9bdf983.png",
  },
  {
    title: "View Stock by Category Chart",
    description:
      "The **Stock by Category** graph provides a visual breakdown of inventory items per category.\n\n" +
      "- Each bar represents a category and is **interactive** — click to view detailed items under that category.\n" +
      "- You can expand or collapse categories to explore individual items.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/b76fa473-022f-4e08-8b7e-27e09c8a55b3/ddea8bdd-edfb-4025-b168-4564b0bf49b9.png",
  },
  {
    title: "Analyze Monthly Item Transactions",
    description:
      "The **Monthly Transactions** graph summarizes all inventory movements for the current month.\n\n" +
      "- You can filter by **Transaction Type** (e.g., Stock in, stock out).\n" +
      "- You can also filter by **Item Category** for deeper insights into specific supply groups.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/babc3d1a-5f45-47f6-b543-205c427ce3ec/5a72eb62-78fb-465b-b677-cca8b6701028.png",
  },
  {
    title: "Open the Transaction List",
    description:
      "You can use the filters to narrow down by item, date, or transaction type for easy tracking.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/a8cd5c66-8294-4f24-961e-510e97903f9f/a33f8b2f-b527-4ee5-9f43-c260b95bd49b.png",
  },
  {
    title: "Edit or Delete Inventory Records",
    description:
      "Click on any specific record to view its full details.\n\n" +
      "Authorized users (such as admin or doctors) can **edit** or **delete** existing records as needed.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/d76d1a41-577f-4da9-bd6f-6afbe2a1db0a/f32996fc-8961-4b5b-bf05-39c0d99f8b1c.png",
  },
  {
    title: "Confirm Updates in Inventory Logs",
    description:
      "After updating or deleting a record, check the **Inventory Logs** section to confirm that the action was successfully recorded.\n\n" +
      "A success notification will also appear to confirm the update.",
    img: "https://images.tango.us/workflows/715f5d85-8017-4889-b66a-d89d338976ce/steps/e7b33844-7354-4e74-8b18-2c1a0b977040/015ef152-7952-4f57-910c-5386285c81fc.png",
  },
];

export default function ManageInventoryDashboardGuide() {
  return (
    <GuideSteps
      title="Manage Inventory"
      date="Oct 28, 2025"
      author="Marvin Las Piñas"
      steps={steps}
    />
  );
}
