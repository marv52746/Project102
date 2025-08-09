import React from "react";
import { Clock } from "lucide-react";

export default function RecentActivities({ activities }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-800">
        Recent Activity
      </h3>
      <ul className="space-y-4 text-sm text-gray-700">
        {activities.map((item, idx) => (
          <li key={idx} className="flex gap-3 items-start">
            <div className="mt-1">{item.icon}</div>
            <div>
              <p>{item.action}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
