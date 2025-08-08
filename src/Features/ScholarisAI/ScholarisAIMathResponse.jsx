import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS once in your app

// Helper: converts AI text with $...$ and $$...$$ math to HTML with KaTeX renderings
const renderMathInText = (text) => {
  if (!text) return '';

  // Replace block math $$...$$ first
  let html = text.replace(/\$\$(.+?)\$\$/gs, (match, latex) => {
    try {
      return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return match; // fallback to raw if error
    }
  });

  // Replace inline math $...$
  html = html.replace(/\$(.+?)\$/g, (match, latex) => {
    // Avoid replacing block math (already replaced)
    if (match.startsWith('$$') && match.endsWith('$$')) return match;
    try {
      return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return match;
    }
  });

  return html;
};

const ScholarisAIMathResponse = ({ aiText }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const rendered = renderMathInText(aiText);
    setHtmlContent(rendered);
  }, [aiText]);

  return (
    <div
      className="scholaris-ai-response"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default ScholarisAIMathResponse;
