import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Import the components for Patient and Doctor views and edits

import { useDispatch, useSelector } from "react-redux";
import { internalRoles } from "../../core/constants/rolePresets";
import { formConfigMap } from "../../core/constants/FieldConfigMap";
import FormFormat from "../../core/components/FormFormat";
import apiService from "../../core/services/apiService";
import UserDashboardPage from "./FormDetails/Index";
import { normalizeTableName } from "../../core/utils/tableUtils";

function Form() {
  const { tablename: rawTablename, view, id } = useParams();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(view !== "create");

  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  const tablename = normalizeTableName(rawTablename);

  useEffect(() => {
    if (view !== "create") {
      const fetchDetails = async () => {
        try {
          const record = await apiService.get(dispatch, `${tablename}/${id}`);

          setData(record);
        } catch (error) {
          console.error(`Error fetching ${tablename} details:`, error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [view, id, tablename, dispatch]);

  if (!hasValidRole) return <div>Access denied</div>;
  if (loading) return <div className="p-4">Loading...</div>;
  if (view !== "create" && !data)
    return <div className="p-4">Record not found.</div>;

  const config = formConfigMap[tablename];
  if (!config) return <div>Invalid route or parameters.</div>;

  const fields = config.getFields(view);

  // ✅ Conditional component rendering
  if (
    view === "view" &&
    (tablename === "patients" ||
      tablename === "doctors" ||
      tablename === "users")
  ) {
    return <UserDashboardPage data={data} />;
  }

  // return view === "create" ? (
  //   <FormNew fields={fields} />
  // ) : (
  //   <FormFormat fields={fields} data={data} />
  // );
  return <FormFormat fields={fields} data={data} />;
}

export default Form;
