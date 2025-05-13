// components/ui/Progress.js
import React from 'react';

export const Progress = ({ value, max = 100 }) => {
  const progress = (value / max) * 100;

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="font-semibold">{progress}%</span>
        </div>
      </div>
      <div className="flex mb-2 items-center justify-between">
        <div className="relative pt-1 flex flex-col">
          <div
            className="flex mb-2 bg-blue-200 rounded-full h-2"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
