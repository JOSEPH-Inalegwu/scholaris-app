export const highlightText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Normalize tabs to spaces (4 spaces per tab)
  text = text.replace(/\t/g, '    ');

  // Split lines for processing nested lists
  const lines = text.split('\n');

  // Helper to generate list items and nesting based on indent level
  const processLines = (lines) => {
    const result = [];
    const stack = []; // Stack to hold list types ('ul' or 'ol') and indent levels

    const listItemRegex = /^(\s*)(\d+)\. (.*)$/;    // Ordered list
    const unorderedItemRegexDash = /^(\s*)- (.*)$/; // Unordered list dash
    const unorderedItemRegexStar = /^(\s*)\* (.*)$/; // Unordered list star

    lines.forEach((line) => {
      let indent, content, tag, formattedLine;

      if (listItemRegex.test(line)) {
        const [, spaces, num, rest] = line.match(listItemRegex);
        indent = Math.floor(spaces.length / 2);
        content = rest;
        tag = 'ol';
        // Format the li with number bold green span
        formattedLine = `<li class="ml-6"><span class="mr-2">${num}.</span>${content}</li>`;
      } else if (unorderedItemRegexDash.test(line)) {
        const [, spaces, rest] = line.match(unorderedItemRegexDash);
        indent = Math.floor(spaces.length / 2);
        content = rest;
        tag = 'ul';
        formattedLine = `<li class="ml-6 leading-relaxed">${content}</li>`;
      } else if (unorderedItemRegexStar.test(line)) {
        const [, spaces, rest] = line.match(unorderedItemRegexStar);
        indent = Math.floor(spaces.length / 2);
        content = rest;
        tag = 'ul';
        formattedLine = `<li class="ml-6 leading-relaxed">${content}</li>`;
      } else {
        // Not a list line, close all open lists if any
        while (stack.length) {
          result.push(`</${stack.pop().tag}>`);
        }
        result.push(line);
        return;
      }

      // Now handle stack for nesting
      while (stack.length && indent < stack[stack.length - 1].indent) {
        // Close deeper nested lists
        result.push(`</${stack.pop().tag}>`);
      }

      if (!stack.length || indent > stack[stack.length - 1].indent) {
        // Open new nested list
        result.push(`<${tag} class="mb-2 ${tag === 'ul' ? 'list-none' : 'list-none'}">`);
        stack.push({ tag, indent });
      } else if (stack[stack.length - 1].tag !== tag) {
        // Close different type, open new
        result.push(`</${stack.pop().tag}>`);
        result.push(`<${tag} class="mb-2 ${tag === 'ul' ? 'list-none' : 'list-none'} font-bold">`);
        stack.push({ tag, indent });
      }

      // Push the formatted <li>
      result.push(formattedLine);
    });

    // Close any remaining open lists
    while (stack.length) {
      result.push(`</${stack.pop().tag}>`);
    }

    return result.join('\n');
  };

  // FIXED: Pass the lines array, not the original text string
  let processed = processLines(lines);

  // Apply other markdown-style formatting
  processed = processed
    .replace(/^### (.*)$/gim, '<h2 class="text-lg font-bold text-black mt-3 mb-2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-yellow-600 font-semibold">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 text-red-600 px-1 py-0.5 rounded">$1</code>')
    .replace(/\n{2,}/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br />');

  // IMPROVED: Only wrap in paragraph if content doesn't contain block elements
  const hasBlockElements = /<(ul|ol|h[1-6]|div)/i.test(processed);
  if (hasBlockElements) {
    return processed;
  } else {
    return `<p class="mt-2">${processed}</p>`;
  }
};