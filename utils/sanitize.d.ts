declare module '../utils/sanitize' {
  export function sanitizeHTML(html: string): { __html: string };
}

declare module '@/utils/sanitize' {
  export function sanitizeHTML(html: string): { __html: string };
}
