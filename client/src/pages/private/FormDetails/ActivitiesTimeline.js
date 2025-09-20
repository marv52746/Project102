import { useEffect, useState } from "react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import apiService from "../../../core/services/apiService";
import { formatFullDate } from "../../../core/utils/tableUtils";
import {
  Pill,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  CalendarDays,
  FileText,
  Baby,
  Clock,
} from "lucide-react";

// Helper functions
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const formatDateRange = (start, end) => {
  if (!start && !end) return "";
  const s = new Date(start).toLocaleDateString();
  const e = new Date(end).toLocaleDateString();
  return `${s} - ${e}`;
};

// Map table name to icon
const iconMap = {
  medication: <Pill className="text-blue-500" size={20} />,
  allergy: <AlertTriangle className="text-red-500" size={20} />,
  surgical: <Stethoscope className="text-purple-500" size={20} />,
  vitals: <HeartPulse className="text-pink-500" size={20} />,
  condition: <ClipboardList className="text-green-500" size={20} />,
  appointment: <CalendarDays className="text-orange-500" size={20} />,
  pregnancy: <Baby className="text-pink-500" size={20} />, // ✅ Added
  default: <FileText className="text-gray-400" size={20} />,
};

// Format each activity log
const formatActivity = (log) => {
  const { action, table, dataSnapshot, userId } = log;
  const date = log.created_on;

  const actVerb =
    action === "create"
      ? "Created"
      : action === "update"
      ? "Updated"
      : action === "delete"
      ? "Deleted"
      : capitalize(action);

  let title = "";
  let description = "";

  switch (table) {
    case "appointment": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      const status = dataSnapshot.status || "-";
      // Better wording for appointment actions
      if (status === "completed") {
        title = `Completed check-up with ${patientName}`;
      } else if (status === "cancelled") {
        title = `Cancelled appointment with ${patientName}`;
      } else {
        title = `${actVerb} appointment with ${patientName}`;
      }
      description = `Reason: ${dataSnapshot.reason || "-"}, Status: ${status}`;
      break;
    }
    case "medication": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      title = `Prescribed ${dataSnapshot.name || "medicine"} to ${patientName}`;
      description = `Dose: ${dataSnapshot.dose || "-"}, Frequency: ${
        dataSnapshot.frequency || "-"
      } (${formatDateRange(dataSnapshot.start_date, dataSnapshot.end_date)})`;
      break;
    }
    case "condition": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      title = `Added clinical notes for ${patientName}`;
      description = `${actVerb} condition "${
        dataSnapshot.name || "-"
      }" — Notes: ${dataSnapshot.notes || "-"}`;
      break;
    }
    case "vitals": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      title = `${actVerb} vitals for ${patientName}`;
      description = `BP: ${dataSnapshot.blood_pressure || "-"}, HR: ${
        dataSnapshot.heart_rate || "-"
      }, Temp: ${dataSnapshot.temperature || "-"}, Weight: ${
        dataSnapshot.weight || "-"
      }`;
      break;
    }

    case "surgical_history": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      title = `${actVerb} surgical history for ${patientName}`;
      description = `${dataSnapshot.name || "Surgery"} (${
        dataSnapshot.year || "-"
      }) — Surgeon: ${dataSnapshot.surgeon || "-"}`;
      break;
    }

    case "allergy": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      title = `${actVerb} allergy record for ${patientName}`;
      description = `Allergen: ${dataSnapshot.name || "-"}, Reaction: ${
        dataSnapshot.reaction || "-"
      }`;
      break;
    }

    case "document": {
      const patientName = dataSnapshot.patient?.name || "Unknown Patient";
      title = `${actVerb} document for ${patientName}`;
      description = `${dataSnapshot.type || "File"} — ${
        dataSnapshot.filename || "-"
      }`;
      break;
    }

    default: {
      title = `${actVerb} ${capitalize(table)} record`;
      description = log.description || "";
      break;
    }
  }

  return {
    id: log._id,
    date,
    title,
    description,
    icon: iconMap[table] || iconMap.default,
  };
};

export default function ActivitiesTimeline({ patientId, userID }) {
  const { refreshKey } = useSelector((state) => state.utils);
  const dispatch = useDispatch();
  const [activities, setActivities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Build query params dynamically
        const params = {};
        // if (patientId) params.patientId = patientId; // 👈 use patientId
        if (userID) params.userId = userID; // 👈 use userId

        // Call API
        let data;
        if (patientId) {
          data = await apiService.get(dispatch, "activities", {
            patient: patientId,
          });
        } else {
          data = await apiService.get(dispatch, "activities", params);
        }

        const formatted = (data || []).map(formatActivity);
        // console.log(data);
        setActivities(formatted);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, [dispatch, patientId, refreshKey, userID]);

  const visibleActivities = activities.slice(0, visibleCount);
  // console.log(visibleActivities);

  return (
    <Card title="Activities Timeline">
      <div className="max-h-80 overflow-y-auto pr-2">
        <ol className="relative border-s border-gray-200 ml-2 text-sm">
          {visibleActivities.length > 0 ? (
            visibleActivities.map((a) => (
              <li key={a.id} className="mb-6 ms-4 flex items-start gap-3">
                <div className="absolute w-3 h-3 bg-blue-200 rounded-full -start-1.5 mt-1.5 border border-white"></div>
                <div className="mt-1">{a.icon}</div>
                <div>
                  {/* <time className="text-xs text-gray-500">
                    {formatFullDate(a.date)}
                  </time> */}
                  <div className="font-medium">{a.title}</div>
                  {a.description && (
                    <div className="text-gray-500 text-xs">{a.description}</div>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatFullDate(a.date)}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-xs text-gray-400">No activities found.</p>
          )}
        </ol>
      </div>

      {activities.length > visibleCount && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="text-blue-500 hover:underline text-xs"
          >
            Show more
          </button>
        </div>
      )}
    </Card>
  );
}
