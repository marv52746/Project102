import React, { useEffect, useState } from "react";
import { Sun, Moon, Edit, Save } from "lucide-react";
import apiService from "../../../core/services/apiService"; // adjust import path
import { useDispatch } from "react-redux";

export default function ScheduleTab({ data }) {
  const [schedule, setSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  // console.log(data);

  useEffect(() => {
    const defaultSchedule = [
      {
        day: "Monday",
        morning: "9:00 - 12:00",
        afternoon: "1:00- 5:00",
      },
      {
        day: "Tuesday",
        morning: "9:00 - 12:00",
        afternoon: "1:00 - 5:00",
      },
      {
        day: "Wednesday",
        morning: "9:00 - 12:00",
        afternoon: "1:00 - 5:00",
      },
      {
        day: "Thursday",
        morning: "9:00 - 12:00",
        afternoon: "1:00 - 5:00",
      },
      {
        day: "Friday",
        morning: "9:00 - 12:00",
        afternoon: "1:00 - 5:00",
      },
      { day: "Saturday", morning: "-", afternoon: "-" },
      { day: "Sunday", morning: "-", afternoon: "-" },
    ];

    if (!data?.schedule || data.schedule.length === 0) {
      setSchedule(defaultSchedule);
    } else {
      setSchedule(data.schedule);
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSave = async () => {
    try {
      // console.log(schedule);
      // await apiService.put(`users/${data._id}`, { schedule });
      await apiService.put(dispatch, "users", data._id, { schedule });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const renderTime = (time, isMorning) => {
    if (time === "-") {
      return <span className="text-gray-400 italic">Unavailable</span>;
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isMorning
            ? "bg-yellow-100 text-yellow-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {isMorning ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
        {time}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Weekly Schedule</h3>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
          >
            <Save className="w-4 h-4" /> Update
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded  text-blue hover:text-blue-600"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      <table className="min-w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Day</th>
            <th className="px-4 py-2 text-left">Morning</th>
            <th className="px-4 py-2 text-left">Afternoon</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {schedule.map(({ day, morning, afternoon }, i) => (
            <tr key={i}>
              <td className="px-4 py-3 font-medium text-gray-800">{day}</td>
              <td className="px-4 py-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={morning}
                    placeholder="e.g. 9:00 AM - 12:00 PM" // 👈 added
                    onChange={(e) => handleChange(i, "morning", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                ) : (
                  renderTime(morning, true)
                )}
              </td>
              <td className="px-4 py-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={afternoon}
                    placeholder="e.g. 1:00 PM - 5:00 PM" // 👈 added
                    onChange={(e) =>
                      handleChange(i, "afternoon", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                ) : (
                  renderTime(afternoon, false)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
