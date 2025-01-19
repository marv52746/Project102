import React from "react";
import TableList from "../../../core/components/TableList";
import staffData from "../../../core/data/clinic/staff.json";

function Doctors() {
  const data = staffData.staff;

  const columns = [
    { field: "avatar", title: "Avatar" },
    { field: "name", title: "Name" },
    { field: "role", title: "Role" },
    { field: "specialization", title: "Specialization" },
    { field: "qualification", title: "Qualification" },
    { field: "years_of_experience", title: "Years of Experience" },
    // { field: "phone", title: "Phone" },
    { field: "email", title: "Email" },
  ];

  return (
    <div className="container mx-auto p-4">
      <TableList title="Doctors List" data={data} columns={columns} />
    </div>
  );
}

export default Doctors;
