import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { internalRoles } from "../../core/constants/rolePresets";
import ListFormat from "../../core/components/ListFormat"; // adjust this path
import { listConfigMap } from "../../core/constants/FieldConfigMap";

function List() {
  const { tablename } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  if (!hasValidRole) return <div>Access denied</div>;

  const config = listConfigMap[tablename];
  if (!config) return <div>Page not found</div>;

  return (
    <ListFormat
      apiURL={config.apiURL}
      query={config.query}
      fieldData={config.fieldData}
      mode="view"
      title={config.title}
    />
  );
}

export default List;
