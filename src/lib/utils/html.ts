export function cleanHtmlContent(content: string): string {
  if (!content) return '';
  
  return content
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .trim();
}
