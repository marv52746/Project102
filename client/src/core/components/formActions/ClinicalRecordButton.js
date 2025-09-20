import { useState } from "react";
import { Plus } from "lucide-react";
import ClinicalRecordButtonNew from "./ClinicalRecordButtonNew";

export default function ClinicalRecordButton({ patient, data }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition flex items-center gap-1"
      >
        <Plus className="w-4 h-4" />
        Clinical Record
      </button>

      {showModal && (
        <ClinicalRecordButtonNew
          report={data}
          onClose={() => setShowModal(false)}
          isOpen={true}
        />
      )}
    </>
  );
}
