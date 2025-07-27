import { useEffect, useState } from "react";
import { listConfigMap } from "../../../core/constants/FieldConfigMap";
import TableMini from "../../../core/components/TableMini";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";

export default function AppointmentsTab({ id }) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const config = listConfigMap["appointments"];
  const columns = config.fieldData;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const records = await apiService.get(dispatch, `appointments`);

        // Filter by patient._id or patient (if stored directly)
        const filtered = records.filter((appt) => {
          const patientId = appt.patient?._id || appt.patient;
          return patientId === id;
        });

        setData(filtered);
        // console.log(filtered);
      } catch (error) {
        console.error(`Error fetching appointments list:`, error);
      }
    };

    fetchDetails();
  }, [id, dispatch]);

  return (
    // <div className="bg-white border rounded-lg p-10 text-gray-500">
    <TableMini columns={columns} data={data} filter={""} />
    // </div>
  );
}
