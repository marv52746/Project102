import React, { useState } from "react";
import { X } from "lucide-react";

function GridInput({ label, name, value, onChange, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
      />
    </div>
  );
}

export default function UltrasoundReportForm({
  isOpen,
  onClose,
  initialData = {},
  onSubmit,
}) {
  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-11/12 max-w-6xl shadow-lg p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold">Ultrasound Report</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* PATIENT DATA */}
        <h3 className="font-semibold text-sm border-b mb-3">PATIENT DATA</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <GridInput
            label="Name"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
          <GridInput
            label="Address"
            name="address"
            value={data.address}
            onChange={handleChange}
          />
          <GridInput
            label="Date of Birth"
            name="dob"
            value={data.dob}
            onChange={handleChange}
          />
          <GridInput
            label="Age"
            name="age"
            value={data.age}
            onChange={handleChange}
          />
          <GridInput
            label="G/P"
            name="gp"
            value={data.gp}
            onChange={handleChange}
          />
          <GridInput
            label="EDD"
            name="edd"
            value={data.edd}
            onChange={handleChange}
          />
          <GridInput
            label="LMP"
            name="lmp"
            value={data.lmp}
            onChange={handleChange}
          />
          <GridInput
            label="AOG"
            name="aog"
            value={data.aog}
            onChange={handleChange}
          />
        </div>

        {/* FETAL SURVEY */}
        <h3 className="font-semibold text-sm border-b mb-3">FETAL SURVEY</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <GridInput
            label="Presentation"
            name="presentation"
            value={data.presentation}
            onChange={handleChange}
          />
          <GridInput
            label="Fetal Sex"
            name="fetal_sex"
            value={data.fetal_sex}
            onChange={handleChange}
          />
          <GridInput
            label="No. of Fetus"
            name="fetus_count"
            value={data.fetus_count}
            onChange={handleChange}
          />
          <GridInput
            label="Placental Grade"
            name="placental_grade"
            value={data.placental_grade}
            onChange={handleChange}
          />
          <GridInput
            label="Fetal Heart Beat"
            name="fetal_heart"
            value={data.fetal_heart}
            onChange={handleChange}
          />
          <GridInput
            label="Placental Position"
            name="placental_position"
            value={data.placental_position}
            onChange={handleChange}
          />
          <GridInput
            label="Amniotic Fluid"
            name="amniotic_fluid"
            value={data.amniotic_fluid}
            onChange={handleChange}
          />
          <GridInput
            label="SVP"
            name="svp"
            value={data.svp}
            onChange={handleChange}
          />
        </div>

        {/* FETAL BIOMETRY */}
        <h3 className="font-semibold text-sm border-b mb-3">FETAL BIOMETRY</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <GridInput
            label="Biparietal Diameter (BPD)"
            name="bpd"
            value={data.bpd}
            onChange={handleChange}
          />
          <GridInput
            label="Occipito-Frontal Diameter (OFD)"
            name="ofd"
            value={data.ofd}
            onChange={handleChange}
          />
          <GridInput
            label="Head Circumference (HC)"
            name="hc"
            value={data.hc}
            onChange={handleChange}
          />
          <GridInput
            label="Abdominal Circumference (AC)"
            name="ac"
            value={data.ac}
            onChange={handleChange}
          />
          <GridInput
            label="Femoral Length (FL)"
            name="fl"
            value={data.fl}
            onChange={handleChange}
          />
        </div>

        {/* IMPRESSION */}
        <h3 className="font-semibold text-sm border-b mb-3">IMPRESSION</h3>
        <textarea
          name="impression"
          value={data.impression || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Enter impression here..."
        />

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => onSubmit && onSubmit(data)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
