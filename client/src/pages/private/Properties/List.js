import React, { useEffect, useState } from "react";
import TableList from "../../../core/components/TableList";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";
import { getFormFields as getPropertyFields } from "../../../core/constants/propertiesPresets";
import { getUserFormFields } from "../../../core/constants/userPresets";

export const listConfigMap = {
  //   patients: {
  //     apiURL: "patients",
  //     fieldData: patientFields,
  //     title: "Patients",
  //   },
  //   staff: {
  //     apiURL: "staff",
  //     fieldData: doctorFields,
  //     title: "Staff",
  //   },
  users: {
    apiURL: "users",
    fieldData: getUserFormFields("list"),
    title: "Users",
  },
  properties: {
    apiURL: "properties",
    fieldData: getPropertyFields(),
    title: "System Properties",
  },
  //   appointments: {
  //     apiURL: "appointments",
  //     fieldData: appointmentFields,
  //     title: "Appointments",
  //   },
  //   "birth-reports": {
  //     apiURL: "birth-reports",
  //     fieldData: birthReportFields,
  //     title: "Birth Reports",
  //   },
  //   pregnancies: {
  //     apiURL: "pregnancies",
  //     fieldData: pregnancyFields,
  //     title: "Pregnancies",
  //   },
  //   "labor-and-deliveries": {
  //     apiURL: "labor-and-deliveries",
  //     fieldData: laborDeliveryFields,
  //     title: "Labor & Deliveries",
  //   },
  //   payments: {
  //     apiURL: "payments",
  //     fieldData: paymentFields,
  //     title: "Payments",
  //   },
};

function Properties() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const fields = getFormFields("all");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await apiService.get(dispatch, "properties");
        setData(records);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };

    fetchRecords();
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <TableList title="Properties" data={data} columns={fields} />
    </div>
  );
}

export default Properties;
