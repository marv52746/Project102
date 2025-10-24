// import React from "react";

// const SelectInput = ({ field, value, onChange, isReadOnly }) => {
//   return (
//     <select
//       id={field.name}
//       name={field.name}
//       value={value}
//       onChange={onChange}
//       disabled={field.disabled || isReadOnly}
//       required={field.required}
//       className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
//     >
//       <option value="" disabled>
//         Select {field.label}
//       </option>
//       {field.options.map((option, idx) => (
//         <option key={idx} value={option._id || option.id || option.value}>
//           {option.name || option.label || option.email}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default SelectInput;

import React from "react";

const SelectInput = ({ field, value, onChange, isReadOnly }) => {
  const isDisabled = field.disabled || isReadOnly;

  return (
    <div className="relative">
      <select
        id={field.name}
        name={field.name}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        required={field.required}
        className={`mt-1 block w-full appearance-none px-4 py-2.5 border text-gray-800 rounded-lg shadow-sm transition-all duration-150
          ${
            isDisabled
              ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white border-gray-300 hover:border-gray-400 focus-visible:outline-none  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
      >
        <option value="" disabled>
          Select {field.label}
        </option>
        {field.options.map((option, idx) => (
          <option key={idx} value={option._id || option.id || option.value}>
            {option.name || option.label || option.email}
          </option>
        ))}
      </select>

      {/* ▼ Dropdown Icon */}
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SelectInput;
