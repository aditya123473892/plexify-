import React from "react";

const InputWithIcon = ({ name, icon, placeholder, value, onChange, type, options = [] }) => (
  <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg p-2 w-full">
    <span className="mx-2 text-[#538d2dfd] font-extrabold">{icon}</span>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none"
      >
        {options.map((option, index) => (
          <option key={index} value={option === "Select Bond Type" ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none"
      />
    )}
  </div>
);

export default InputWithIcon;
