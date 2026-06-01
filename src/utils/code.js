export function parseCodeBlock(text) {
  const match = text.match(/^```(\w*)\n?([\s\S]*?)```\s*$/);
  if (match) {
    return {
      language: match[1] || null,
      code: match[2].replace(/\n+$/, '')
    };
  }
  return { language: null, code: text.replace(/\n+$/, '') };
}
