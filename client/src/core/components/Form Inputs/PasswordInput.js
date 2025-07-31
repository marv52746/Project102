import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ field, value, onChange, isReadOnly }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={field.name}
        id={field.name}
        value={value || ""}
        onChange={onChange}
        disabled={field.disabled || isReadOnly}
        placeholder={field.placeholder || ""}
        required={field.required}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
