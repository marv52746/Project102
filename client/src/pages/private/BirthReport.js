// src/components/BirthReportList.js

import React from "react";
import TableList from "../../core/components/TableList"; // Assuming you already have this component
import birthReports from "../../core/data/birthReports.json";

const BirthReport = () => {
  const columns = [
    { field: "patientName", title: "Patient Name" },
    { field: "forecastDate", title: "Forecast Date" },
    { field: "actualBirthDate", title: "Actual Birth Date" },
    { field: "actualTime", title: "Actual Birth Time" },
    { field: "birthType", title: "Birth Type" },
    { field: "stage", title: "Stage" }, // Pre-birth, Post-birth, Review
  ];

  return (
    <div className="container mx-auto p-4">
      <TableList
        title="Birth Reports List"
        data={birthReports.birthReports}
        columns={columns}
      />
    </div>
  );
};

export default BirthReport;
