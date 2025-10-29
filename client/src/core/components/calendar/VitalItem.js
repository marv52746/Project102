export default function VitalItem({ icon: Icon, label, value, type, height }) {
  if (!value) return null;

  const getStatus = () => {
    switch (type) {
      case "bp": {
        const [systolic, diastolic] = value.split("/").map(Number);
        if (systolic > 140 || diastolic > 90) return "high";
        if (systolic < 90 || diastolic < 60) return "low";
        return "normal";
      }
      case "hr": {
        const hr = Number(value);
        if (hr > 100) return "high";
        if (hr < 60) return "low";
        return "normal";
      }
      case "temp": {
        const temp = parseFloat(value);
        if (temp >= 37.8) return "high";
        if (temp <= 35.5) return "low";
        return "normal";
      }
      case "weight": {
        const weight = parseFloat(value);
        if (!height) {
          if (weight >= 100) return "high";
          if (weight <= 40) return "low";
          return "normal";
        }

        // 🧮 Compute BMI: weight (kg) / [height (m)]²
        const heightMeters = parseFloat(height) / 100;
        const bmi = weight / (heightMeters * heightMeters);

        if (bmi < 18.5) return "underweight";
        if (bmi < 25) return "normal";
        if (bmi < 30) return "overweight";
        return "obese";
      }
      default:
        return "normal";
    }
  };

  const status = getStatus();

  // 🎨 Color logic
  const bgColorMap = {
    high: "bg-red-100 border-red-300",
    low: "bg-yellow-100 border-yellow-300",
    underweight: "bg-yellow-100 border-yellow-300",
    overweight: "bg-orange-100 border-orange-300",
    obese: "bg-red-100 border-red-300",
    normal: "bg-blue-50 border-blue-100",
  };

  const iconColorMap = {
    high: "text-red-600",
    low: "text-yellow-600",
    underweight: "text-yellow-600",
    overweight: "text-orange-600",
    obese: "text-red-600",
    normal: "text-blue-600",
  };

  const bgColor = bgColorMap[status] || bgColorMap.normal;
  const iconColor = iconColorMap[status] || iconColorMap.normal;

  // 🧠 Compute BMI text for weight type
  let bmiValue = null;
  let bmiCategory = null;
  if (type === "weight" && height) {
    const heightMeters = parseFloat(height) / 100;
    const bmi = (parseFloat(value) / (heightMeters * heightMeters)).toFixed(1);
    bmiValue = bmi;

    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";
  }

  return (
    <li className={`flex items-center gap-2 p-3 rounded-md border ${bgColor}`}>
      <Icon className={`h-5 w-5 ${iconColor}`} />
      <div>
        <div className="font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-600 font-semibold">{value}</div>

        {type === "weight" && bmiValue && (
          <div className="text-xs text-gray-500">
            BMI: <span className="font-semibold">{bmiValue}</span>{" "}
            <span
              className={`${
                status === "obese" || status === "overweight"
                  ? "text-red-600"
                  : status === "underweight"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              ({bmiCategory})
            </span>
          </div>
        )}

        {status !== "normal" &&
          !["underweight", "overweight", "obese"].includes(status) && (
            <div className="text-xs italic text-red-500">
              {status === "high" ? "Above normal" : "Below normal"}
            </div>
          )}
      </div>
    </li>
  );
}
