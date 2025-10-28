import React from "react";
import { Clock, User } from "lucide-react";
import GuideSteps from "./GuideSteps";

const InventoryGuide = () => {
  const steps = [
    {
      title: "Open the Inventory Module",
      description:
        "Navigate to the **Inventory** section from the main menu. This is where all existing inventory items are displayed and managed.",
      img: "",
    },
    {
      title: "Click 'Create New' to Add an Item",
      description:
        "To add a new item, click the **Create New** button. This will open a form where you can enter item details such as name, category, and stock levels.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/59380bdd-fc79-4c55-be5f-6a76f6e52387/dc1846b5-3d69-4498-bc04-bb468ee18189.png",
    },
    {
      title: "Fill Out the Inventory Item Details",
      description:
        "Provide the following details carefully:\n\n- **Item Name:** Enter the full name of the product or supply.\n- **Category:** Choose the appropriate type (e.g., Medicine, Supply, Vaccine, etc.).\n- **Unit:** Specify the unit of measurement (e.g., box, bottle, piece).\n- **Reorder Level:** Set the minimum stock level that triggers a restock alert.\n- **Expiry Date:** Add the expiration date if applicable (for perishable or medical items).",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/c9ae6d4a-9405-47a7-97ec-fc506e1b24b8/94b5d605-7073-4e73-aa92-339298b0af76.png",
    },
    {
      title: "Save the New Inventory Item",
      description:
        "After filling out all required details, click **Submit** to create the new inventory record. The new item will appear in your inventory list.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/9d231fd5-3c19-4570-b155-4baf883ae89f/62af065a-d263-4337-b985-f520dfa6c1c2.png",
    },
    {
      title: "Log Inventory Transactions",
      description:
        "Go to your personal Personal Dashboard and click **Log Inventory** button. This allows you to record stock movements such as adding (Stock In) or removing (Stock Out) items.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/99f0510e-1f9d-479c-aef6-e5c356930bc3/e6ae9f3f-b417-4cc0-817a-c97759df6e65.png",
    },
    {
      title: "Use the Inventory Transaction Form",
      description:
        "In the transaction modal:\n\n- Select the **Item** to update.\n- Review the **Item Summary** on the right for stock details.\n- Choose the **Transaction Type** (Stock In or Stock Out).\n- Enter the **Quantity** and click **Add Transaction** to queue it for saving.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/5d82661e-628e-4bde-8a7f-a06cd07d5a1d/32185f0e-facc-4537-af18-5cb5950b5a43.png",
    },
    {
      title: "Review Added Transactions",
      description:
        "Your pending transactions will appear in the list below. You can continue adding multiple transactions before finalizing them.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/d0855d49-b64b-4d1f-bf06-936a9c66f673/2898805e-09a5-4076-b9f4-f506bee5116d.png",
    },
    {
      title: "Delete a Pending Transaction",
      description:
        "If you made a mistake or no longer need a transaction, click the **trash icon** beside it to delete before saving.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/08855a1d-c18e-47ed-9152-92db2fbf2fa7/e5902157-51fc-4719-a0aa-f888975cab71.png",
    },
    {
      title: "Save All Transactions",
      description:
        "Once all entries are correct, click **Save All Transactions**. A confirmation message will appear (e.g., “1 transaction recorded successfully!”). You can then close the modal safely.",
      img: "https://images.tango.us/workflows/9e9b7d0c-8acc-4b3e-87e8-ff79ef442d7b/steps/f8742e53-d08d-4a91-85b1-3372a56bc796/576b5db5-eb7c-466f-9677-e7a55c068fe0.png",
    },
  ];

  return (
    <GuideSteps
      title="Add and Manage Inventory in the System"
      date="Oct 28, 2025"
      author="Marvin Las Piñas"
      steps={steps}
    />
  );
};

export default InventoryGuide;
