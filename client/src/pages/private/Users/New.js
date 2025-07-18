import FormFormat from "../../../core/components/FormFormat";
import { getUserFormFields } from "../../../core/constants/userPresets";

function UserNew() {
  const fields = getUserFormFields("create");

  return (
    <div className="p-4">
      <div className="mb-6">
        <FormFormat fields={fields} />
      </div>
    </div>
  );
}

export default UserNew;
