// Helper component to show each vital
export default function VitalItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <li className="flex items-center gap-2 p-3 rounded-md bg-blue-50 border border-blue-100">
      <Icon className="h-5 w-5 text-blue-600" />
      <div>
        <div className="font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-500">{value}</div>
      </div>
    </li>
  );
}
