import React, { useState } from "react";
import {
  Calendar,
  Users,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Phone,
  MapPin,
  Stethoscope,
  ShieldAlert,
  ChevronDown,
  MoreHorizontal,
  Video,
  FileText,
  Plus,
} from "lucide-react";

/**
 * Patient dashboard page inspired by the provided mock.
 * - TailwindCSS utility classes
 * - No external component library required
 * - Pure React with small, composable components
 */

const followUpsSeed = [
  { id: 1, title: "Tobacco Screening", date: null },
  {
    id: 2,
    title: "Alcohol Misuse Screening",
    date: new Date("2021-05-01T17:30:00"),
  },
  {
    id: 3,
    title: "Abdominal Aortic Aneurysm Screening by ultrasonography",
    date: null,
  },
  { id: 4, title: "Depression Screening", date: null },
];

const conditionsSeed = [
  { id: 1, name: "Diabetes Mellitus", code: "E11.1" },
  { id: 2, name: "Hypertension", code: "I10" },
  { id: 3, name: "Heart Disease", code: "E11.1" },
];

const medsSeed = [
  { id: 1, name: "Metformin 500mg", dose: "500mg", freq: "BID" },
  { id: 2, name: "Lisinopril 10mg", dose: "10mg", freq: "QD" },
];

const allergiesSeed = [{ id: 1, name: "Penicillin", reaction: "Rash" }];

const surgicalSeed = [
  { id: 1, name: "Appendectomy", year: 2001 },
  { id: 2, name: "Knee Arthroscopy", year: 2014 },
];

const activitiesSeed = [
  {
    id: 1,
    date: "21 Jan 2021",
    title: "Appointment",
    reason: "back pain",
    amount: null,
  },
  {
    id: 2,
    date: "20 Jan 2021",
    title: "Payment Made",
    reason: null,
    amount: 20,
  },
  {
    id: 3,
    date: "13 Jan 2021",
    title: "Annual Wellness Completed",
    reason: null,
    amount: null,
  },
];

const documentsSeed = [
  { id: 1, name: "Check In" },
  { id: 2, name: "Consent Form" },
  { id: 3, name: "Lab Results" },
];

function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="md:hidden h-3 w-3 rounded-full bg-green-500 inline-block" />
          <span className="md:hidden font-semibold">connected clinic</span>
          <span className="hidden md:block text-sm text-gray-500">
            Kansas City Family Medical Care
          </span>
          <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              1
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="text-sm leading-tight">
              <div className="font-semibold">Margaret Lim</div>
              <div className="text-xs text-gray-500">Cardiologist</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PatientHeader() {
  return (
    <section className="bg-white border rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
          CW
        </div>
        <div>
          <div className="font-semibold text-gray-900">Cameron Williamson</div>
          <div className="text-xs text-gray-500">
            53 yo (09.12.1967), English
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-px h-10 bg-gray-200" />

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone className="h-4 w-4" /> +351 588 954 257
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FileText className="h-4 w-4" /> cameron@gmail.com
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" /> 15208 West 119th Street, Olathe, Kansas
        666062
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Stethoscope className="h-4 w-4" /> Mary Ryan DNP
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <ShieldAlert className="h-4 w-4" /> United Healthcare
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="text-blue-600 text-sm hover:underline">
          + Wellness Screen
        </button>
        <button className="text-blue-600 text-sm hover:underline">+ RPM</button>
        <button className="text-blue-600 text-sm hover:underline">+ CCM</button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Video className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <FileText className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function Card({ title, right, children, className = "" }) {
  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function DashboardTab() {
  const [followUps, setFollowUps] = useState(followUpsSeed);
  const [clinicalTab, setClinicalTab] = useState("conditions");

  const schedule = (id) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, date: new Date() } : f))
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        <Card title="Recommended Follow-Up Care">
          <ul className="divide-y">
            {followUps.map((f) => (
              <li key={f.id} className="py-3 flex items-center justify-between">
                <div className="pr-2 text-sm text-gray-700">{f.title}</div>
                <div className="flex items-center gap-2">
                  {f.date ? (
                    <span className="text-blue-600 text-sm">
                      {f.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {f.date.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <button
                      onClick={() => schedule(f.id)}
                      className="px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      Schedule
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-4 text-sm">
              {[
                {
                  key: "conditions",
                  label: `Conditions (${conditionsSeed.length})`,
                },
                {
                  key: "medications",
                  label: `Medications (${medsSeed.length})`,
                },
                {
                  key: "allergies",
                  label: `Allergies (${allergiesSeed.length})`,
                },
                {
                  key: "surgical",
                  label: `Surgical History (${surgicalSeed.length})`,
                },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setClinicalTab(t.key)}
                  className={`pb-1 border-b-2 -mb-1 transition-colors ${
                    clinicalTab === t.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
        >
          {clinicalTab === "conditions" && (
            <ul className="space-y-2">
              {conditionsSeed.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-md bg-yellow-50 border border-yellow-100"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <ShieldAlert className="h-4 w-4 text-yellow-500" /> {c.name}
                  </span>
                  <span className="text-xs text-gray-500">{c.code}</span>
                </li>
              ))}
            </ul>
          )}

          {clinicalTab === "medications" && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 font-medium">Medication</th>
                    <th className="py-2 font-medium">Dose</th>
                    <th className="py-2 font-medium">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {medsSeed.map((m) => (
                    <tr key={m.id} className="border-t">
                      <td className="py-2">{m.name}</td>
                      <td className="py-2">{m.dose}</td>
                      <td className="py-2">{m.freq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {clinicalTab === "allergies" && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {allergiesSeed.map((a) => (
                <li key={a.id}>
                  {a.name} - <span className="text-gray-500">{a.reaction}</span>
                </li>
              ))}
            </ul>
          )}

          {clinicalTab === "surgical" && (
            <ul className="text-sm text-gray-700">
              {surgicalSeed.map((s) => (
                <li key={s.id} className="py-1 flex items-center gap-2">
                  <Plus className="h-3 w-3 text-gray-400" /> {s.name} ({s.year})
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <Card title="Activities Timeline">
          <ol className="relative border-s border-gray-200 ml-2 text-sm">
            {activitiesSeed.map((a, idx) => (
              <li key={a.id} className="mb-6 ms-4">
                <div className="absolute w-3 h-3 bg-blue-200 rounded-full -start-1.5 mt-1.5 border border-white"></div>
                <time className="text-xs text-gray-500">{a.date}</time>
                <div className="font-medium">{a.title}</div>
                {a.reason && (
                  <div className="text-gray-500 text-xs">
                    Reason: {a.reason}
                  </div>
                )}
                {a.amount && (
                  <div className="text-gray-500 text-xs">{a.amount} $</div>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Documents">
          <ul className="divide-y text-sm">
            {documentsSeed.map((d) => (
              <li key={d.id} className="py-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" /> {d.name}
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <button className="hover:text-gray-600" title="Print">
                    🖨️
                  </button>
                  <button className="hover:text-gray-600" title="Download">
                    ⬇️
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function AppointmentsTab() {
  return (
    <div className="bg-white border rounded-lg p-10 text-center text-gray-500">
      <p>Appointments tab placeholder. Add your table / calendar here.</p>
    </div>
  );
}

export default function PatientDashboardPage() {
  const [mainTab, setMainTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 text-slate-700">
      <TopBar />
      <div className="flex">
        <main className="flex-1 p-4 md:p-6 space-y-4">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 flex items-center gap-2">
            <span>Patients</span> <span>/</span>
            <span className="text-gray-900 font-medium">
              Cameron Williamson
            </span>
          </nav>

          <PatientHeader />

          {/* Tabs */}
          <div className="mt-4 border-b text-sm flex items-center gap-6">
            {[
              { key: "dashboard", label: "Dashboard" },
              { key: "appointments", label: "Appointments" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setMainTab(t.key)}
                className={`pb-2 border-b-2 -mb-px transition-colors ${
                  mainTab === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {mainTab === "dashboard" ? <DashboardTab /> : <AppointmentsTab />}
        </main>
      </div>
    </div>
  );
}
