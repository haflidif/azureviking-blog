import { SITE } from '@/config';

/**
 * Prepends the site base path to a given path.
 * Ensures no double slashes and handles trailing slashes correctly.
 */
export function basePath(path: string): string {
  const base = SITE.base.replace(/\/$/, '');
  if (base === '' || base === '/') return path;
  if (path.startsWith(base)) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
