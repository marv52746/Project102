import { Edit, PlusCircle, Save, Trash } from "lucide-react";
import { internalRoles } from "../../constants/rolePresets";

export const FormActionButtons = ({
  isViewing,
  isCreating,
  isEditing,
  canDelete,
  hasUpdateDeletePermission,
  onEdit,
  onSubmit,
  onDelete,
  currentRole,
  currentTable,
  allowedRoles = internalRoles,
  transactionTables = [],
}) => {
  const isRoleAllowed =
    allowedRoles.length === 0 || allowedRoles.includes(currentRole);
  const isTableAllowed =
    transactionTables.length === 0 || transactionTables.includes(currentTable);

  const isAllowed = isRoleAllowed && !isTableAllowed;

  if (!isAllowed) return null; // Hide all buttons if user is not allowed

  return (
    <div className="flex space-x-4 mt-6">
      {isViewing && hasUpdateDeletePermission && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Edit className="mr-2" /> Edit
        </button>
      )}
      {isCreating && (
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
        >
          <PlusCircle className="mr-2" /> Submit
        </button>
      )}
      {isEditing && (
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg"
        >
          <Save className="mr-2" /> Update
        </button>
      )}
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <Trash className="mr-2" /> Delete
        </button>
      )}
    </div>
  );
};
