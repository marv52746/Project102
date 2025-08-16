// src/utils/statusUtils.js
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Ban,
  HelpCircle,
} from "lucide-react";

export const statusMap = {
  completed: {
    text: "Completed",
    color: "bg-green-500",
    icon: CheckCircle,
  },
  scheduled: {
    text: "Scheduled",
    color: "bg-blue-500",
    icon: Clock,
  },
  cancelled: {
    text: "Cancelled",
    color: "bg-gray-400",
    icon: XCircle,
  },
  "no-show": {
    text: "No Show",
    color: "bg-yellow-500",
    icon: Ban,
  },
  rescheduled: {
    text: "Rescheduled",
    color: "bg-purple-500",
    icon: RefreshCw,
  },
};

export function getStatusDetails(status) {
  return (
    statusMap[status] || {
      text: "Unknown",
      color: "bg-gray-400",
      icon: HelpCircle,
    }
  );
}
