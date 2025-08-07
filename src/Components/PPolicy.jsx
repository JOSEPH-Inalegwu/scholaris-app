import React from 'react';

const PPolicy = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <iframe
        src="/privacy-policy.html"
        title="Cookie Policy"
        className="w-full h-[80vh] border border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default PPolicy;
