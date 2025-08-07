import React, { useEffect, useState } from 'react';

const CookiePolicyModal = ({ isOpen, onClose }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/cookie-policy.html')
        .then((res) => res.text())
        .then((html) => setHtmlContent(html))
        .catch((err) => console.error('Failed to load cookie policy:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
        <button
          className="absolute top-2 right-2 border border-white py-1 px-3 bg-red-500 text-white text-2xl hover:bg-red-600"
          onClick={onClose}
        >
          &times;
        </button>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default CookiePolicyModal;
