import { useEffect, useState } from "react";
import Card from "./Card";
import { useDispatch } from "react-redux";
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
  default: <FileText className="text-gray-400" size={20} />,
};

// Format each activity log
const formatActivity = (log) => {
  const { action, table, dataSnapshot } = log;
  const date = log.createdAt;

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
    case "medication":
      title = `Medications Prescribed: ${dataSnapshot.name}`;
      description = `${actVerb} medication "${dataSnapshot.name}" with dose ${
        dataSnapshot.dose || "-"
      } and frequency ${dataSnapshot.frequency || "-"} (${formatDateRange(
        dataSnapshot.start_date,
        dataSnapshot.end_date
      )}).`;
      break;
    case "allergy":
      title = `Allergy: ${dataSnapshot.name}`;
      description = `${actVerb} allergy "${dataSnapshot.name}" — Reaction: ${
        dataSnapshot.reaction || "-"
      }, Severity: ${dataSnapshot.severity || "-"}.`;
      break;
    case "surgical":
      title = `Surgical History: ${dataSnapshot.name}`;
      description = `${actVerb} surgical record "${
        dataSnapshot.name
      }" — Year: ${dataSnapshot.year || "-"}, Surgeon: ${
        dataSnapshot.surgeon || "-"
      }.`;
      break;
    case "vitals":
      title = `Vitals`;
      description = `${actVerb} vitals — BP: ${
        dataSnapshot.blood_pressure || "-"
      }, HR: ${dataSnapshot.heart_rate || "-"}, Temp: ${
        dataSnapshot.temperature || "-"
      }.`;
      break;
    case "condition":
      title = `Diagnosis / Conditions: ${dataSnapshot.name}`;
      description = `${actVerb} condition "${dataSnapshot.name}" — Code: ${
        dataSnapshot.code || "-"
      }, Notes: ${dataSnapshot.notes || "-"}.`;
      break;
    case "appointment":
      title = `Appointment`;
      description = `${actVerb} appointment — Reason: ${
        dataSnapshot.reason || "-"
      }, Status: ${dataSnapshot.status || "-"}.`;
      break;
    default:
      title = capitalize(table);
      description = `${actVerb} ${table} record.`;
      break;
  }

  return {
    id: log._id,
    date,
    title,
    description,
    icon: iconMap[table] || iconMap.default,
  };
};

export default function ActivitiesTimeline({ patientId }) {
  const dispatch = useDispatch();
  const [activities, setActivities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!patientId) return;
        const data = await apiService.get(dispatch, "activities", {
          patient: patientId,
        });
        const formatted = (data || []).map(formatActivity);
        setActivities(formatted);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, [dispatch, patientId]);

  const visibleActivities = activities.slice(0, visibleCount);

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
                  <time className="text-xs text-gray-500">
                    {formatFullDate(a.date)}
                  </time>
                  <div className="font-medium">{a.title}</div>
                  {a.description && (
                    <div className="text-gray-500 text-xs">{a.description}</div>
                  )}
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
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="text-blue-500 hover:underline text-xs"
          >
            Show more
          </button>
        </div>
      )}
    </Card>
  );
}
