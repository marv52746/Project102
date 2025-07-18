import React from "react";
import {
  Heart,
  Clipboard,
  CreditCard,
  AlertTriangle,
  HeartPulse,
  Scale,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAvatarUrl } from "../../utils/avatarURL";

// Helper function to map icons dynamically
const iconMap = {
  hypertension: <Heart className="text-red-500" size={48} />,
  bmi: <Scale className="text-yellow-500" size={48} />,
  bloodPressure: <HeartPulse className="text-purple-500" size={48} />,
  medication: <Clipboard className="text-green-500" size={48} />,
  insurance: <CreditCard className="text-blue-600" size={48} />,
  healthAlert: <AlertTriangle className="text-red-500" size={48} />,
};

// Dynamic Card Component for Health Information
const HealthInfoCard = ({ title, value, category, icon }) => (
  <div className="px-6 py-4 bg-gray-50 rounded-lg shadow-md flex  items-center space-x-8">
    {icon}
    <div>
      <p className="font-semibold text-xl">{title}</p> {/* This is the title */}
      <p className="text-gray-600 mb-3">{value}</p> {/* This is the value */}
      <p className="text-gray-500 text-sm">{category}</p>{" "}
    </div>
    {/* This is the category */}
  </div>
);

const PatientDetailsCardv2 = ({ tableData }) => {
  const { tablename, id } = useParams();
  const navigate = useNavigate();

  // Example BMI data
  const bmi = 25.2; // Example BMI value
  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi >= 18.5 && bmi < 24.9
      ? "Normal weight"
      : bmi >= 25 && bmi < 29.9
      ? "Overweight"
      : "Obese";

  const healthData = [
    {
      id: "hypertension",
      title: "Hypertension",
      value: "Chronic Condition",
      category: "Health Info",
      icon: iconMap.hypertension,
    },
    {
      id: "bmi",
      title: `${bmi.toFixed(1)} BMI`,
      value: bmiCategory,
      category: "Health Info",
      icon: iconMap.bmi,
    },
    {
      id: "bloodPressure",
      title: "BP: 120/80",
      value: "Normal",
      category: "Vital Signs",
      icon: iconMap.bloodPressure,
    },
    {
      id: "medication",
      title: "Amlodipine",
      value: "Medication",
      category: "Medications",
      icon: iconMap.medication,
    },
    {
      id: "insurance",
      title: "Blue Cross",
      value: "Plan 1234",
      category: "Insurance Info",
      icon: iconMap.insurance,
    },
    {
      id: "healthAlert",
      title: "Allergic to Penicillin",
      value: "Health Alert",
      category: "Alerts",
      icon: iconMap.healthAlert,
    },
  ];

  const handleEdit = (item) => {
    navigate(`/form/${tablename}/edit/${id}`);
  };

  const handleDelete = (item) => {
    navigate(`/form/${tablename}/delete/${id}`);
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap -mx-4">
        {/* Left Side: Patient Information (Personal Info and Edit/Delete buttons) */}
        <div className="w-full md:w-1/3 px-4 mb-6">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <img
              className="w-full h-60 object-contain"
              // src={
              //   tableData.avatar
              //     ? process.env.REACT_APP_BASE_URL_IMAGE + tableData.avatar
              //     : process.env.PUBLIC_URL + "/assets/images/default-male.jpg"
              // }
              src={getAvatarUrl(tableData.avatar)}
              alt={tableData.name}
            />
            <div className="p-4">
              <h4 className="text-xl font-semibold mb-2">{tableData.name}</h4>
              <p className="text-gray-600 mb-4">
                {tableData.description || "No description available."}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(tableData)}
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 flex items-center"
                >
                  Edit Patient
                </button>
                <button
                  onClick={() => handleDelete(tableData)}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 flex items-center"
                >
                  Delete Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Dashboard Cards */}
        <div className="w-full md:w-2/3 px-4 flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {healthData.map((item) => (
              <HealthInfoCard
                key={item.id}
                title={item.title}
                value={item.value}
                category={item.category}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsCardv2;
