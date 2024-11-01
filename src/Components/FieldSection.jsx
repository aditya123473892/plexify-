
import React from 'react';

const FieldSection = ({ title, icon, children }) => (
  <section className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold flex mb-4">
      <span className="inline mr-3 text-[#538d2dfd] mt-1">{icon}</span>
      {title}
    </h2>
    <div className="grid grid-cols-2 gap-6">
      {children}
    </div>
  </section>
);

export default FieldSection;
