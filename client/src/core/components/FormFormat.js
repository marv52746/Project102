import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  adminOnlyRoles,
  internalRoles,
  transactionTables,
} from "../constants/rolePresets";
import { shouldShowField } from "../utils/fieldUtils";

import ConfirmDeleteModal from "./modal/ConfirmDeleteModal";
import { handleFormSubmit } from "./formActions/formSubmit";
import {
  handleEdit,
  handleFormDelete,
  handleInputChange,
} from "./formActions/formHandlers";

import { renderSpacer } from "./Form Inputs/LabelSpacerInput";
import { renderField } from "./Form Inputs/Index";
import { FormActionButtons } from "./formActions/FormActionButtons";

const FormFormat = ({ data, fields }) => {
  const { tablename, id, view } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.userInfo);

  // console.log(data);

  const hasUpdateDeletePermission =
    currentUser && adminOnlyRoles.includes(currentUser.role);

  const isViewing = id && view === "view";
  const isCreating = !id && view === "create";
  const isEditing =
    id && view !== "view" && view !== "create" && hasUpdateDeletePermission;
  const canDelete = !!id && hasUpdateDeletePermission;

  const [inputData, setInputData] = useState(data || {});
  const [fileData, setFileData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setInputData((prev) => {
      let changed = false;
      const newData = { ...prev };

      fields.forEach((field) => {
        const hasValue =
          newData[field.name] !== undefined && newData[field.name] !== null;
        if (!hasValue && field.default !== undefined) {
          newData[field.name] =
            typeof field.default === "function"
              ? field.default()
              : field.default;
          changed = true;
        }
      });

      return changed ? newData : prev; // ⛔ prevent setState loop
    });
  }, [fields]); // ✅ only run once on mount

  const handleSubmit = async () => {
    handleFormSubmit({
      dispatch,
      tablename,
      id,
      data: inputData,
      fields,
      fileData,
      navigate,
    });
  };

  const handleChange = (e) => {
    handleInputChange({ e, setInputData, setFileData });
  };

  const handleDeleteConfirm = () => {
    handleFormDelete({ dispatch, tablename, id, navigate });
    setShowDeleteModal(false);
  };

  const isReadOnly = isViewing || (!hasUpdateDeletePermission && !isCreating);

  return (
    <div className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Stop real page reload
          handleSubmit(); // Call your function
        }}
        encType="multipart/form-data"
        className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full"
      >
        <div className="mb-6">
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field, index) => {
                if (!shouldShowField(field, view, inputData)) return null;
                if (["spacer", "half-spacer", "label"].includes(field.type)) {
                  return renderSpacer(field, index);
                }

                // Section label
                if (field.type === "label") {
                  return (
                    <div key={index} className="col-span-2">
                      <h3 className="text-md font-semibold text-gray-600 mt-4 mb-2">
                        {field.label}
                      </h3>
                    </div>
                  );
                }
                if (!field.name) return null;

                return renderField({
                  field,
                  index,
                  inputData,
                  handleChange,
                  setInputData,
                  fields,
                  dispatch,
                  isReadOnly,
                });
              })}
            </div>
          </>
        </div>

        <FormActionButtons
          isViewing={isViewing}
          isCreating={isCreating}
          isEditing={isEditing}
          canDelete={canDelete}
          hasUpdateDeletePermission={hasUpdateDeletePermission}
          onEdit={() => handleEdit({ tablename, id, navigate })}
          onSubmit={handleSubmit}
          onDelete={() => setShowDeleteModal(true)}
          currentRole={currentUser?.role}
          currentTable={tablename}
          allowedRoles={internalRoles}
          transactionTables={transactionTables}
        />
      </form>
      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default FormFormat;
