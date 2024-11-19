import React from "react";
import { ArrowDownCircle } from "lucide-react"; // Import Lucide React Icons
import ExportLinks from "./ExportLinks";

function PatientPaymentTransactions() {
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        Patient Payment Transactions
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Cost</th>
              <th className="p-2 text-left">Discount</th>
              <th className="p-2 text-left">Payment Type</th>
              <th className="p-2 text-left">Invoice</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows */}
            {[
              {
                date: "12-03-2018",
                cost: "$300",
                discount: "15%",
                type: "Check",
                status: "Pending",
              },
              {
                date: "12-03-2018",
                cost: "$130",
                discount: "5%",
                type: "Credit Card",
                status: "Completed",
              },
              {
                date: "12-03-2018",
                cost: "$30",
                discount: "5%",
                type: "Credit Card",
                status: "Cancelled",
              },
              {
                date: "12-03-2018",
                cost: "$30",
                discount: "5%",
                type: "Cash",
                status: "Completed",
              },
              {
                date: "12-03-2018",
                cost: "$30",
                discount: "5%",
                type: "Credit Card",
                status: "Completed",
              },
              {
                date: "12-03-2018",
                cost: "$30",
                discount: "5%",
                type: "Insurance",
                status: "Completed",
              },
              {
                date: "12-03-2018",
                cost: "$30",
                discount: "5%",
                type: "Credit Card",
                status: "Completed",
              },
            ].map((transaction, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{transaction.date}</td>
                <td className="p-2">{transaction.cost}</td>
                <td className="p-2">{transaction.discount}</td>
                <td className="p-2">{transaction.type}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    <span>Invoice</span>
                  </button>
                </td>
                <td className="p-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      transaction.status === "Completed"
                        ? "bg-green-500 text-white"
                        : transaction.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }  transition-opacity duration-200`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ExportLinks />
      </div>
    </div>
  );
}

export default PatientPaymentTransactions;
