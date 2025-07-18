import FormFormat from "../../../core/components/FormFormat";
import { getPropertyFields } from "../../../core/constants/propertiesPresets";

function PropertiesNew() {
  const fields = getPropertyFields("create");

  return (
    <div className="p-4">
      <div className="mb-6">
        <FormFormat fields={fields} />
      </div>
    </div>
  );
}

export default PropertiesNew;
