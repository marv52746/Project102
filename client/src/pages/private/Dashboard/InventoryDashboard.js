import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Package, AlertTriangle, Clock, RefreshCcw } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";
import StatCard from "../../../core/components/dashboard/StatCard";
import DataModal from "./DataModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Reloader from "../../../core/components/utils/reloader";
import useSocket from "../../../core/hooks/useSocket";

export default function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    soonToExpire: 0,
    transactionsThisMonth: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]); // [{ name, count }]
  const [monthlyItemTransactions, setMonthlyItemTransactions] = useState([]); // [{ name, category, stockIn, stockOut }]

  const [allItems, setAllItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [soonToExpireItems, setSoonToExpireItems] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState("items");

  const [categoryItemsMap, setCategoryItemsMap] = useState({}); // { category: [items...] }
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [transactionFilter, setTransactionFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useSocket({
    inventoryitem_created: (data) => {
      const newItem = data.data;
      setAllItems((prev) => [newItem, ...prev]);

      // Update low stock or soon-to-expire if applicable
      const now = new Date();
      const soonExpireLimit = new Date();
      soonExpireLimit.setDate(now.getDate() + 30);

      if (newItem.quantity <= newItem.reorderLevel) {
        setLowStockItems((prev) => [newItem, ...prev]);
      }

      if (
        newItem.expiryDate &&
        new Date(newItem.expiryDate) <= soonExpireLimit
      ) {
        setSoonToExpireItems((prev) => [newItem, ...prev]);
      }

      // Update category chart & map
      setCategoryItemsMap((prev) => {
        const cat = newItem.category || "Uncategorized";
        const updated = { ...prev };
        if (!updated[cat]) updated[cat] = [];
        updated[cat] = [newItem, ...updated[cat]];
        return updated;
      });
      setCategoryData((prev) => {
        const cat = newItem.category || "Uncategorized";
        const existing = prev.find((c) => c.name === cat);
        if (existing) {
          return prev.map((c) =>
            c.name === cat ? { ...c, count: c.count + 1 } : c
          );
        }
        return [...prev, { name: cat, count: 1 }];
      });

      // Update KPI stats
      setStats((prev) => ({
        ...prev,
        totalItems: prev.totalItems + 1,
        lowStock:
          prev.lowStock + (newItem.quantity <= newItem.reorderLevel ? 1 : 0),
        soonToExpire:
          prev.soonToExpire +
          (newItem.expiryDate && new Date(newItem.expiryDate) <= soonExpireLimit
            ? 1
            : 0),
      }));
    },

    inventorytransaction_created: (data) => {
      const newItem = data.data;
      const newTransaction = {
        ...data.transaction,
        item: newItem,
      };

      // Add to monthly transactions
      setMonthlyTransactions((prev) => [newTransaction, ...prev]);

      // Add to recent transactions (keep only last 5)
      setRecentTransactions((prev) => [newTransaction, ...prev].slice(0, 5));

      // Update monthly item aggregation
      setMonthlyItemTransactions((prev) => {
        const idx = prev.findIndex((i) => i.name === newTransaction.item.name);
        const updated = [...prev];
        if (idx > -1) {
          const item = { ...updated[idx] };
          if (newTransaction.type === "Stock in")
            item.stockIn += newTransaction.quantity;
          if (newTransaction.type === "Stock out")
            item.stockOut += newTransaction.quantity;
          updated[idx] = item;
        } else {
          updated.push({
            name: newTransaction.item.name,
            category: newTransaction.item.category || "Uncategorized",
            stockIn:
              newTransaction.type === "Stock in" ? newTransaction.quantity : 0,
            stockOut:
              newTransaction.type === "Stock out" ? newTransaction.quantity : 0,
          });
        }
        return updated;
      });

      // Update KPI stat for this month's transactions
      const txnDate = new Date(newTransaction.timestamp);
      const now = new Date();
      if (
        txnDate.getFullYear() === now.getFullYear() &&
        txnDate.getMonth() === now.getMonth()
      ) {
        setStats((prev) => ({
          ...prev,
          transactionsThisMonth: prev.transactionsThisMonth + 1,
        }));
      }
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const items = await apiService.get(dispatch, "inventory");
        const transactions = await apiService.get(dispatch, "inventoryLogs");

        const now = new Date();
        const soonExpireLimit = new Date();
        soonExpireLimit.setDate(now.getDate() + 30);

        const lowStock = items.filter((i) => i.quantity <= i.reorderLevel);
        const soonToExpire = items.filter(
          (i) => i.expiryDate && new Date(i.expiryDate) <= soonExpireLimit
        );

        const thisMonthTransactions = transactions.filter((t) => {
          const d = new Date(t.timestamp);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });

        // console.log(thisMonthTransactions);

        // Group items by category
        const categoryMap = {};
        items.forEach((it) => {
          const cat = it.category || "Uncategorized";
          if (!categoryMap[cat]) categoryMap[cat] = [];
          categoryMap[cat].push(it);
        });
        const categoryChart = Object.entries(categoryMap).map(
          ([name, arr]) => ({
            name,
            count: arr.length,
          })
        );

        // Build per-item monthly aggregation
        const itemMonthlyMap = {};
        items.forEach((it) => {
          const nm = it.name || "Unknown";
          itemMonthlyMap[nm] = {
            name: nm,
            category: it.category || "Uncategorized",
            stockIn: 0,
            stockOut: 0,
          };
        });
        thisMonthTransactions.forEach((t) => {
          const nm = t.item?.name || "Unknown";
          if (!itemMonthlyMap[nm]) {
            itemMonthlyMap[nm] = {
              name: nm,
              category: t.item?.category || "Uncategorized",
              stockIn: 0,
              stockOut: 0,
            };
          }
          if (t.type === "Stock in") itemMonthlyMap[nm].stockIn += t.quantity;
          if (t.type === "Stock out") itemMonthlyMap[nm].stockOut += t.quantity;
        });
        const itemChart = Object.values(itemMonthlyMap);

        // Monthly movement (month totals)
        const monthMap = {};
        transactions.forEach((t) => {
          const ts = new Date(t.timestamp);
          const monthKey = `${ts.getFullYear()}-${String(
            ts.getMonth() + 1
          ).padStart(2, "0")}`;
          if (!monthMap[monthKey])
            monthMap[monthKey] = {
              month: monthKey,
              stockIn: 0,
              stockOut: 0,
              adjustment: 0,
            };
          if (t.type === "Stock in") monthMap[monthKey].stockIn += t.quantity;
          if (t.type === "Stock out") monthMap[monthKey].stockOut += t.quantity;
          if (t.type === "Adjustment")
            monthMap[monthKey].adjustment += t.quantity;
        });

        // set states
        setStats({
          totalItems: items.length,
          lowStock: lowStock.length,
          soonToExpire: soonToExpire.length,
          transactionsThisMonth: thisMonthTransactions.length,
        });

        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setAllItems(items);
        setLowStockItems(lowStock);
        setSoonToExpireItems(soonToExpire);
        setMonthlyTransactions(thisMonthTransactions);

        setRecentTransactions(sortedTransactions.slice(0, 5));
        setCategoryData(categoryChart);
        setCategoryItemsMap(categoryMap);

        setMonthlyItemTransactions(itemChart);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  const filteredMonthlyTransactions = monthlyItemTransactions.filter((item) => {
    if (transactionFilter === "All") return true;
    if (transactionFilter === "Stock In") return item.stockIn > 0;
    if (transactionFilter === "Stock Out") return item.stockOut > 0;
    // Category filter
    return item.category === transactionFilter;
  });

  const openModal = (title, data, type = "items") => {
    setModalTitle(title);
    setModalData(data);
    setModalOpen(true);
    setModalType(type);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    const now = new Date();
    const monthName = now.toLocaleString("default", { month: "long" }); // e.g., "September"
    const year = now.getFullYear();
    doc.setFontSize(16);
    doc.text(`${monthName} ${year} - Inventory Report`, 105, 15, {
      align: "center",
    });

    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${now.toLocaleDateString()}`, 14, 25);

    // --- KPI Summary ---
    doc.setFontSize(13);
    doc.text("Key Metrics", 14, 35);

    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Total Items", stats.totalItems],
        ["Low Stock Items", stats.lowStock],
        ["Soon to Expire", stats.soonToExpire],
        ["Transactions This Month", stats.transactionsThisMonth],
      ],
      theme: "grid",
    });

    // --- Stock by Category with Items ---
    doc.setFontSize(13);
    doc.text(
      "Stock by Category (with Items)",
      14,
      doc.lastAutoTable.finalY + 15
    );

    categoryData.forEach((cat, index) => {
      const itemsInCat = categoryItemsMap[cat.name] || [];

      // Add category header below the last table
      const yPos =
        index === 0
          ? doc.lastAutoTable.finalY + 25
          : doc.lastAutoTable
          ? doc.lastAutoTable.finalY + 10
          : 45;
      doc.setFontSize(12);
      doc.text(`${cat.name} (${cat.count} items)`, 14, yPos);

      // Table right below header
      autoTable(doc, {
        startY: yPos + 5,
        head: [["Item", "Quantity", "Unit", "Reorder Level", "Expiry Date"]],
        body: itemsInCat.map((item) => [
          item.name,
          item.quantity,
          item.unit,
          item.reorderLevel,
          item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString()
            : "-",
        ]),
        theme: "grid",
        margin: { left: 14, right: 14 },
      });
    });

    // --- Current Month Item Transactions ---
    doc.setFontSize(13);
    doc.text(
      "Current Month Item Transactions",
      14,
      doc.lastAutoTable.finalY + 15
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [
        ["Item", "Category", "Type", "Quantity", "Units", "Updated By", "Date"],
      ],
      body: monthlyTransactions.map((t) => [
        t.item?.name || "Unknown",
        t.item?.category || "Uncategorized",
        t.type,
        t.quantity,
        t.item?.unit || "-",
        t.updated_by?.fullname || "N/A",
        new Date(t.timestamp).toLocaleDateString(),
      ]),
      theme: "grid",
    });

    // Save
    doc.save(`Inventory_Report_${now.getFullYear()}-${now.getMonth() + 1}.pdf`);
  };

  const itemsForSelectedCategory =
    selectedCategory === "All"
      ? []
      : (categoryItemsMap[selectedCategory] || []).map((it) => ({
          name: it.name,
          quantity: it.quantity,
        }));

  const categoryList = ["All", ...categoryData.map((c) => c.name)];

  if (loading) return <Reloader text="Loading dashboard..." />;

  return (
    <>
      <div className="space-y-6 min-h-screen">
        {/* Generate Report Button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            className="group flex items-center gap-2
              bg-blue-50 text-blue-800 
              hover:bg-blue-100 
              px-5 py-2.5 rounded-2xl
            
              shadow-sm hover:shadow-md
              transition-all duration-200"
          >
            🖨️
            <span className="font-medium">Generate Report</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="cursor-pointer"
            onClick={() => openModal("All Items", allItems)}
          >
            <StatCard
              icon={Package}
              title="Total Items"
              value={stats.totalItems}
              color="#f97316"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => openModal("Low Stock Items", lowStockItems)}
          >
            <StatCard
              icon={AlertTriangle}
              title="Low Stock"
              value={stats.lowStock}
              color="#ef4444"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => openModal("Soon to Expire Items", soonToExpireItems)}
          >
            <StatCard
              icon={Clock}
              title="Soon to Expire"
              value={stats.soonToExpire}
              color="#eab308"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() =>
              openModal(
                "This Month's Transactions",
                monthlyTransactions,
                "transactions"
              )
            }
          >
            <StatCard
              icon={RefreshCcw}
              title="Transactions"
              value={stats.transactionsThisMonth}
              color="#22c55e"
            />
          </div>
        </div>

        {/* Stock by Category Card */}
        <Card
          title={`Stock by Category ${
            selectedCategory === "All" ? "" : ` — ${selectedCategory}`
          }`}
        >
          <div className="mb-3 flex gap-2 items-center">
            <div className="flex flex-wrap gap-2">
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {selectedCategory !== "All" && (
              <button
                className="ml-auto text-sm px-2 py-1 text-gray-600 hover:text-gray-800"
                onClick={() => setSelectedCategory("All")}
              >
                Show categories
              </button>
            )}
          </div>

          {selectedCategory === "All" ? (
            // Category overview
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={categoryData}
                onClick={(e) => {
                  if (e && e.activeLabel) setSelectedCategory(e.activeLabel);
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : itemsForSelectedCategory.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No items in this category.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={itemsForSelectedCategory} barSize={25}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="quantity"
                  fill="#3b82f6"
                  name="Current Quantity"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Monthly Item Transactions */}
        <Card title="Monthly Item Transactions (This Month)">
          <div className="mb-3 flex flex-wrap gap-2">
            {["All", "Stock In", "Stock Out", ...categoryList.slice(1)].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setTransactionFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    transactionFilter === filter
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={filteredMonthlyTransactions}
              barSize={30}
              onClick={(e) => {
                if (!e || !e.activeLabel) return;
                const clickedName = e.activeLabel;

                // get all transactions for this item
                const itemTxns = monthlyTransactions.filter(
                  (t) => t.item?.name === clickedName
                );

                if (itemTxns.length > 0) {
                  openModal(
                    `${clickedName} Transactions`,
                    itemTxns,
                    "transactions"
                  );
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="stockIn"
                fill="#10b981"
                name="Stock In"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="stockOut"
                fill="#ef4444"
                name="Stock Out"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border">Item</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">{t.item?.name}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        t.type === "Stock in"
                          ? "bg-green-100 text-green-800"
                          : t.type === "Stock out"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {t.quantity} {t.unit}
                  </td>
                  <td className="p-3 border">
                    {new Date(t.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Modal */}
      <DataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        type={modalType}
      />
    </>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
