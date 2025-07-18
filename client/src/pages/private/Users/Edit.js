import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";
import FormFormat from "../../../core/components/FormFormat";
import { getUserFormFields } from "../../../core/constants/userPresets";

function UserEdit() {
  const { tablename, id } = useParams();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fields = getUserFormFields("all");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [userData] = await Promise.all([
          apiService.get(dispatch, `${tablename}/${id}`),
        ]);

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, tablename, dispatch]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">User not found.</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <FormFormat data={user} fields={fields} />
      </div>

      {/* <div className="mb-6">
        <PatientDetailsCard patientInfo={user} />
      </div> */}

      {/* <div className="mb-6">
        <PatientBMI visits={patient.visits} />
      </div> */}

      {/* <PatientHistory visits={appointments} /> */}
    </div>
  );
}

export default UserEdit;
