import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { Package, AlertTriangle, Clock, RefreshCcw } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";
import StatCard from "../../../core/components/dashboard/StatCard";

export default function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    soonToExpire: 0,
    transactionsThisMonth: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyMovement, setMonthlyMovement] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const items = await apiService.get(dispatch, "inventory");
        const transactions = await apiService.get(dispatch, "inventoryLogs");

        const now = new Date();
        const soonExpireLimit = new Date();
        soonExpireLimit.setDate(now.getDate() + 30);

        const lowStockItems = items.filter((i) => i.quantity <= i.reorderLevel);
        const soonToExpireItems = items.filter(
          (i) => i.expiryDate && new Date(i.expiryDate) <= soonExpireLimit
        );

        const transactionsThisMonth = transactions.filter((t) => {
          const d = new Date(t.timestamp);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });

        const categoryCount = {};
        items.forEach((item) => {
          const category = item.category || "Uncategorized";
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        const categoryChart = Object.entries(categoryCount).map(
          ([name, count]) => ({ name, count })
        );

        const monthMap = {};
        transactions.forEach((t) => {
          const ts = new Date(t.timestamp);
          const monthKey = `${ts.getFullYear()}-${String(
            ts.getMonth() + 1
          ).padStart(2, "0")}`;
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
              month: monthKey,
              stockIn: 0,
              stockOut: 0,
              adjustment: 0,
            };
          }
          if (t.type === "Stock in") monthMap[monthKey].stockIn += t.quantity;
          if (t.type === "Stock out") monthMap[monthKey].stockOut += t.quantity;
          if (t.type === "Adjustment")
            monthMap[monthKey].adjustment += t.quantity;
        });

        const monthlyChart = Object.entries(monthMap)
          .map(([month, data]) => ({ ...data, month }))
          .sort((a, b) => new Date(a.month) - new Date(b.month));

        setStats({
          totalItems: items.length,
          lowStock: lowStockItems.length,
          soonToExpire: soonToExpireItems.length,
          transactionsThisMonth: transactionsThisMonth.length,
        });

        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setRecentTransactions(sortedTransactions.slice(0, 5));
        setCategoryData(categoryChart);
        setMonthlyMovement(monthlyChart);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Items"
          value={stats.totalItems}
          color="#f97316"
        />
        <StatCard
          icon={AlertTriangle}
          title="Low Stock"
          value={stats.lowStock}
          color="#ef4444"
        />
        <StatCard
          icon={Clock}
          title="Soon to Expire"
          value={stats.soonToExpire}
          color="#eab308"
        />
        <StatCard
          icon={RefreshCcw}
          title="Transactions This Month"
          value={stats.transactionsThisMonth}
          color="#22c55e"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Stock by Category">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} barSize={40}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Stock Movement">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyMovement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="stockIn"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Stock In"
              />
              <Line
                type="monotone"
                dataKey="stockOut"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Stock Out"
              />
              <Line
                type="monotone"
                dataKey="adjustment"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Adjustment"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

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
