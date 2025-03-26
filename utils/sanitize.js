import DOMPurify from 'dompurify';

export const sanitizeHTML = (html) => ({
  __html: DOMPurify.sanitize(html)
});