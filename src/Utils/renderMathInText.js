import katex from 'katex';

export const renderMathInText = (text) => {
  if (!text) return '';

  let html = text.replace(/\$\$(.+?)\$\$/gs, (match, latex) => {
    try {
      return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return match;
    }
  });

  html = html.replace(/\$(.+?)\$/g, (match, latex) => {
    if (match.startsWith('$$') && match.endsWith('$$')) return match;
    try {
      return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return match;
    }
  });

  return html;
};
