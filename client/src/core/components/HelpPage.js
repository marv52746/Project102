import React from "react";
import { HelpCircle, FileText, UserCog, Calendar, Mail } from "lucide-react";

export default function HelpPage() {
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

      {/* Help Sections */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Patient Management */}
        <div className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
          <UserCog className="w-10 h-10 text-blue-700 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Managing Patients
          </h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Learn how to register new patients, update their information, and
            view medical history records.
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
            <li>Creating new patient profiles</li>
            <li>Viewing existing patient records</li>
            <li>Editing contact and medical info</li>
          </ul>
        </div>

        {/* Appointment Management */}
        <div className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
          <Calendar className="w-10 h-10 text-blue-700 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Appointments & Scheduling
          </h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Understand how to create, update, and track appointments for
            patients.
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
            <li>Booking new appointments</li>
            <li>Viewing today’s and upcoming schedules</li>
            <li>Marking completed or cancelled visits</li>
          </ul>
        </div>

        {/* Clinical Records */}
        <div className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
          <FileText className="w-10 h-10 text-blue-700 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Clinical Records
          </h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Access and manage clinical data such as vitals, medications, and
            surgical history.
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
            <li>Recording vital signs</li>
            <li>Adding medications or allergies</li>
            <li>Documenting surgeries and notes</li>
          </ul>
        </div>

        {/* System Support */}
        <div className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
          <Mail className="w-10 h-10 text-blue-700 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Technical Support
          </h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            If you encounter technical issues, contact our IT support team for
            assistance.
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              📧 Email:{" "}
              <a
                href="mailto:support@bisligpremier.com"
                className="text-blue-700 hover:underline"
              >
                support@bisligpremier.com
              </a>
            </p>
            <p>📞 Internal line: 101 (Admin Office)</p>
            <p>🕒 Support hours: Mon–Fri, 9:00AM – 5:00PM</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bislig Premier Birthing Home — Internal Use
        Only
      </div>
    </div>
  );
}
