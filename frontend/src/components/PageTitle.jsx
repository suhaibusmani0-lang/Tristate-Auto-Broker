import React from 'react';

const PageTitle = ({ children }) => (
  <div className="text-center pt-14 pb-8">
    <h1 className="text-3xl md:text-4xl font-semibold text-white">{children}</h1>
    <div className="w-16 h-[2px] bg-[#0055ff] mx-auto mt-4"></div>
  </div>
);

export default PageTitle;
