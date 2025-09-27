import {
  LayoutDashboard,
  UserCircle,
  Calendar,
  Settings,
  Users,
  CalendarDays,
  Package,
  ClipboardList,
  Globe,
} from "lucide-react";
import { all_routes } from "./all_routes";

export const iconMapping = [
  {
    section: "Menu",
    items: [
      {
        text: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        alert: false,
        iconText: "Dashboard",
        to: all_routes.dashboard,
        table: "dashboard",
      },

      {
        text: "Calendar",
        icon: <Calendar size={20} />,
        alert: false,
        iconText: "Calendar",
        to: all_routes.calendar,
        table: "calendar",
      },
      // {
      //   text: "Org Chart",
      //   icon: <Network size={20} />,
      //   alert: false,
      //   iconText: "Org Chart",
      //   to: all_routes.orgChart,
      //   table: "organizational-structure-diagram",
      // },
    ],
  },
  {
    section: "Management",
    items: [
      {
        text: "Doctors",
        icon: <UserCircle size={20} />,
        alert: false,
        iconText: "Doctors",
        to: all_routes.doctors,
        table: "doctors",
      },
      {
        text: "Patients",
        icon: <Users size={20} />,
        alert: false,
        iconText: "Patients",
        to: all_routes.patients,
        table: "patients",
      },
      {
        text: "Users",
        icon: <UserCircle size={20} />,
        alert: false,
        iconText: "Users",
        to: all_routes.users,
        table: "users",
      },
      {
        text: "Appointments",
        icon: <CalendarDays size={20} />,
        alert: false,
        iconText: "Appointments",
        to: all_routes.appointments,
        table: "appointments",
      },
      {
        text: "Inventory",
        icon: <Package size={20} />,
        alert: false,
        iconText: "Inventory",
        to: all_routes.inventory,
        table: "inventory",
      },
      {
        text: "Inventory Logs",
        icon: <ClipboardList size={20} />,
        alert: false,
        iconText: "Inventory Logs",
        to: all_routes.inventoryLogs,
        table: "inventoryLogs",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        text: "Settings",
        icon: <Settings size={20} />,
        alert: false,
        iconText: "Settings",
        to: all_routes.settings,
        table: "settings",
      },
      {
        text: "Portal",
        icon: <Globe size={20} />,
        alert: false,
        iconText: "Portal",
        to: all_routes.portal,
        // table: "test",
      },
    ],
  },
];
