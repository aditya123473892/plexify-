// InputWithIcon.js

import React from 'react';

const InputWithIcon = ({ icon, placeholder, type = 'text' }) => (
  <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg p-2 w-full">
    <span className="mx-2 text-[#538d2dfd]">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      className="flex-1 bg-transparent outline-none"
    />
  </div>
);

export default InputWithIcon;
