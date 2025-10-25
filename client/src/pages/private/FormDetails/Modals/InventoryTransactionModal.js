import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  AlertTriangle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import apiService from "../../../../core/services/apiService";
import useSocket from "../../../../core/hooks/useSocket";

export default function InventoryTransactionModal({ onClose }) {
  const dispatch = useDispatch();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentTx, setCurrentTx] = useState({
    item: "",
    type: "Remove Stock",
    quantity: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Socket for inventory item updates
  useSocket({
    inventorytransaction_created: (data) => {
      const updatedItem = data.data;
      setInventoryItems((prev) =>
        prev.map((item) =>
          item._id === updatedItem._id ? { ...item, ...updatedItem } : item
        )
      );

      // Also update selectedItem if it's the same one
      setSelectedItem((prev) =>
        prev?._id === updatedItem._id ? { ...prev, ...updatedItem } : prev
      );
    },
  });

  // Fetch inventory items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiService.get(dispatch, "inventory");
        setInventoryItems(data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };
    fetchItems();
  }, [dispatch]);

  // Watch item change
  useEffect(() => {
    if (currentTx.item) {
      const found = inventoryItems.find((i) => i._id === currentTx.item);
      setSelectedItem(found);
    } else setSelectedItem(null);
  }, [currentTx.item, inventoryItems]);

  const handleAddTransaction = () => {
    setError("");
    const { item, type, quantity, reason } = currentTx;

    if (!item) return setError("Please select an item.");
    if (!quantity || quantity <= 0)
      return setError("Please enter a valid quantity.");
    if (type === "Remove Stock" && quantity > selectedItem?.quantity)
      return setError("Quantity exceeds available stock.");

    const newTx = {
      ...currentTx,
      unit: selectedItem?.unit,
      type: currentTx.type === "Add Stock" ? "Stock in" : "Stock out",
      timestamp: new Date(),
    };
    setTransactions([...transactions, newTx]);
    setCurrentTx({ item: "", type: "Remove Stock", quantity: "", reason: "" });
    setSelectedItem(null);
  };

  const handleRemove = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };

  const handleSubmitAll = async () => {
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setIsSubmitting(true);

    if (transactions.length === 0) {
      setIsSubmitting(false);
      return setError("Add at least one transaction before submitting.");
    }

    try {
      // Loop through transactions and submit individually
      for (const tx of transactions) {
        await apiService.post(dispatch, "inventoryLogs", tx);
      }

      setSuccess(true);
      setSuccessMessage(
        `${transactions.length} transaction(s) recorded successfully!`
      );
      setTransactions([]);

      // Auto-hide success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Error submitting transactions:", err);
      setError("Failed to save transactions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Options for react-select
  const selectOptions = inventoryItems.map((itm) => ({
    value: itm._id,
    label: itm.name,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-6xl p-6 relative overflow-y-auto max-h-[95vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="text-blue-600" />
            Inventory Transactions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-md p-2 text-sm"
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 bg-green-50 text-green-700 border border-green-200 rounded-md p-2 text-sm text-center"
          >
            Transactions saved successfully!
          </motion.div>
        )} */}

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT SIDE: Input Section */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Add Transaction
            </h3>

            {/* Select Item */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Select Item
              </label>
              {/* <select
                className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={currentTx.item}
                onChange={(e) =>
                  setCurrentTx((prev) => ({ ...prev, item: e.target.value }))
                }
              >
                <option value="">-- Select --</option>
                {inventoryItems.map((itm) => (
                  <option key={itm._id} value={itm._id}>
                    {itm.name}
                  </option>
                ))}
              </select> */}
              <Select
                className="mt-2"
                placeholder="Search or select an item..."
                options={selectOptions}
                value={
                  currentTx.item
                    ? selectOptions.find((opt) => opt.value === currentTx.item)
                    : null
                }
                onChange={(opt) =>
                  setCurrentTx((prev) => ({ ...prev, item: opt?.value || "" }))
                }
                isClearable
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <div className="flex gap-3 mt-2">
                {["Add Stock", "Remove Stock"].map((t) => {
                  const color =
                    t === "Add Stock"
                      ? "green"
                      : t === "Remove Stock"
                      ? "red"
                      : "amber";
                  const Icon =
                    t === "Add Stock"
                      ? ArrowDownCircle
                      : t === "Remove Stock"
                      ? ArrowUpCircle
                      : RefreshCcw;

                  const disabled =
                    t === "Remove Stock" && selectedItem?.quantity === 0;

                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() =>
                        !disabled &&
                        setCurrentTx((prev) => ({ ...prev, type: t }))
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition
                      ${
                        disabled
                          ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                          : currentTx.type === t
                          ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={currentTx.quantity}
                onChange={(e) =>
                  setCurrentTx((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                placeholder="Enter quantity"
                className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason
              </label>
              <textarea
                rows={3}
                value={currentTx.reason}
                onChange={(e) =>
                  setCurrentTx((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Optional note"
                className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleAddTransaction}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusCircle size={18} />
                Add Transaction
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Summary + Table */}
          <div className="space-y-2">
            {/* Item Summary */}
            <div className="bg-white border rounded-xl p-3">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                Item Summary
              </h3>
              {selectedItem ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedItem.name}
                  </p>
                  <p>
                    <strong>Unit:</strong> {selectedItem.unit}
                  </p>
                  <p>
                    <strong>Current Stock:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        selectedItem.quantity <= 10
                          ? "text-red-500"
                          : "text-blue-700"
                      }`}
                    >
                      {selectedItem.quantity}
                    </span>
                  </p>
                  {currentTx.quantity && (
                    <p>
                      <strong>Projected Stock:</strong>{" "}
                      <span className="text-green-700 font-medium">
                        {currentTx.type === "Add Stock"
                          ? selectedItem.quantity + Number(currentTx.quantity)
                          : selectedItem.quantity - Number(currentTx.quantity)}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Select an item to view details.
                </p>
              )}
            </div>

            {/* Pending Transactions */}
            <div className="bg-white border rounded-xl p-3">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Pending Transactions
              </h3>
              {transactions.length === 0 ? (
                <p className="text-gray-500 italic text-sm">
                  No transactions added yet.
                </p>
              ) : (
                <table className="w-full border text-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Qty</th>
                      <th className="p-2 text-left">Reason</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-2">
                          {inventoryItems.find((x) => x._id === tx.item)
                            ?.name || "Unknown"}
                        </td>
                        <td className="p-2">{tx.type}</td>
                        <td className="p-2">{tx.quantity}</td>
                        <td className="p-2">{tx.reason || "-"}</td>
                        <td className="p-2 text-right">
                          <button
                            onClick={() => handleRemove(i)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-2 border-t pt-2 items-center">
          {isSubmitting && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg
                className="animate-spin h-4 w-4 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Saving transactions...
            </div>
          )}

          {successMessage && (
            <div className="text-green-700 font-medium text-sm mr-auto">
              {successMessage}
            </div>
          )}

          <button
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-lg ${
              isSubmitting
                ? "bg-gray-200 text-gray-500"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitAll}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save All Transactions"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
