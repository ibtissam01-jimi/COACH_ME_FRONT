// components/ui/Card.js
import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => {
  return <div className="border-b pb-2 mb-2">{children}</div>;
};

export const CardTitle = ({ children }) => {
  return <h3 className="text-xl font-semibold">{children}</h3>;
};

export const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};
