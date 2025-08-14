import React, { useEffect, useState } from "react";
import TableList from "./TableList";
import apiService from "../services/apiService";
import { useDispatch } from "react-redux";

function ListFormat({ apiURL, fieldData, mode, title }) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  //   const fields = getFormFields(fieldData, mode);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await apiService.get(dispatch, apiURL);
        setData(records);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    if (apiURL) {
      fetchRecords();
    }
  }, [dispatch, apiURL]);
  // console.log(data);
  return (
    <div className="container mx-auto p-4">
      <TableList title={title} data={data} columns={fieldData} />
    </div>
  );
}

export default ListFormat;
