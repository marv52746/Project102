import React, { useState } from "react";
import {
  HelpCircle,
  FileText,
  UserCog,
  Calendar,
  Mail,
  X,
  Stethoscope,
  Package,
} from "lucide-react";

import AddNewPatientGuide from "./AddNewPatientGuide";

import ManageConsultationsGuide from "./ManageConsultationsGuide";
import ScheduleAndManageAppointmentsGuide from "./ScheduleAndManageAppointmentsGuide";
import ManagePatientRecordsGuide from "./ManagePatientRecordsGuide";
import InventoryGuide from "./InventoryGuide";
import ManageInventoryDashboardGuide from "./ManageInventoryDashboardGuide.js";

export default function HelpPage() {
  const [activeGuide, setActiveGuide] = useState(null);

  // All guide sections are now configurable from this array 👇
  const helpSections = [
    {
      id: "patients",
      icon: <UserCog className="w-10 h-10 text-blue-700 mb-3" />,
      title: "Managing Patients",
      description:
        "Learn how to register new patients, update their information, and view medical history records.",
      links: [
        {
          label: "Creating new patient profiles",
          guide: "AddNewPatientGuide",
        },
        // { label: "Viewing existing patient records" },
        // { label: "Editing contact and medical info" },
      ],
    },
    {
      id: "appointments",
      icon: <Calendar className="w-10 h-10 text-blue-700 mb-3" />,
      title: "Appointments & Scheduling",
      description:
        "Understand how to create, update, and track appointments for patients.",
      links: [
        {
          label: "Booking new appointments",
          guide: "ScheduleAndManageAppointmentsGuide",
        },
        // { label: "Viewing today’s and upcoming schedules" },
        // { label: "Marking completed or cancelled visits" },
      ],
    },
    {
      id: "consultations",
      icon: <Stethoscope className="w-10 h-10 text-blue-700 mb-3" />,
      title: "Doctor Consultations",
      description:
        "Step-by-step guide for doctors on handling patient consultations, prescriptions, and diagnosis records.",
      links: [
        {
          label: "Managing ongoing checkups",
          guide: "ManageConsultationsGuide",
        },
        {
          label: "Managing patient records",
          guide: "ManagePatientRecordsGuide",
        },
      ],
    },
    {
      id: "inventory",
      icon: <Package className="w-10 h-10 text-blue-700 mb-3" />,
      title: "Inventory Management",
      description:
        "Monitor and manage medical and clinic supplies efficiently. Learn how to record adjustments, add new items, and track stock levels.",
      links: [
        {
          label: "Creating new inventory items",
          guide: "InventoryGuide",
        },
        {
          label: "Tracking stock usage and reports",
          guide: "ManageInventoryDashboardGuide",
        },
      ],
    },
    {
      id: "support",
      icon: <Mail className="w-10 h-10 text-blue-700 mb-3" />,
      title: "Technical Support",
      description:
        "If you encounter technical issues, contact our support for assistance.",
      customContent: (
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            📧 Email:{" "}
            <a
              href="mailto:marvinlaspinascanoneo@gmail.com"
              className="text-blue-700 hover:underline"
            >
              marvinlaspinascanoneo@gmail.com
            </a>
          </p>
          <p>📞 Phone number: 09610905335</p>
        </div>
      ),
    },
  ];

  // Map guide names to components
  const guideComponents = {
    AddNewPatientGuide,
    ScheduleAndManageAppointmentsGuide,
    ManageConsultationsGuide,
    ManagePatientRecordsGuide,
    InventoryGuide,
    ManageInventoryDashboardGuide,
  };

  const ActiveGuideComponent = activeGuide
    ? guideComponents[activeGuide]
    : null;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-8 h-8 text-blue-700" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          System Help & Support
        </h1>
      </div>

      <p className="text-gray-600 mb-8 leading-relaxed">
        This Help Center is designed for staff and doctors using the
        <strong> Bislig Premier Birthing Home System</strong>. Here, you’ll find
        guidance on common workflows and how to use different modules
        effectively.
      </p>

      {/* Dynamic Help Sections */}
      <div className="grid sm:grid-cols-2 gap-6">
        {helpSections.map((section) => (
          <div
            key={section.id}
            className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
          >
            {section.icon}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {section.description}
            </p>

            {section.customContent ? (
              section.customContent
            ) : (
              <ul className="list-disc ml-5 text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li
                    key={i}
                    onClick={() => link.guide && setActiveGuide(link.guide)}
                    className={`transition-colors ${
                      link.guide
                        ? "text-blue-600 cursor-pointer hover:text-blue-700 hover:underline"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bislig Premier Birthing Home — Internal Use
        Only
      </div>

      {/* Dynamic Guide Modal */}
      {ActiveGuideComponent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full relative animate-fadeIn overflow-hidden flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto p-4">
              <div className="sticky top-0 z-10 flex justify-end">
                <button
                  onClick={() => setActiveGuide(null)}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ActiveGuideComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
