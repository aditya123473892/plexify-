import React from 'react';

const InputWithIcon = ({ name, icon, placeholder, value, onChange, type }) => (
  <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg p-2 w-full">
    <span className="mx-2 text-[#538d2dfd] font-extrabold">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}       
      onChange={onChange} 
      className="flex-1 bg-transparent outline-none"
    />
  </div>
);

export default InputWithIcon;
