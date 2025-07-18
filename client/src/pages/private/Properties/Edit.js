import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";
import FormFormat from "../../../core/components/FormFormat";
import { getPropertyFields } from "../../../core/constants/propertiesPresets";

function PropertiesEdit() {
  const { tablename, id } = useParams();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fields = getPropertyFields("all");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [itemData] = await Promise.all([
          apiService.get(dispatch, `${tablename}/${id}`),
        ]);

        setData(itemData);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, dispatch]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">Property not found.</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <FormFormat data={data} fields={fields} />
      </div>
    </div>
  );
}

export default PropertiesEdit;
