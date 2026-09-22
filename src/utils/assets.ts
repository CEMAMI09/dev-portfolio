import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Build-time helpers for files under /public.
 *
 * Project pages reference assets that may not exist yet (screenshots,
 * CAD animations, the resume PDF). These helpers let a component decide at
 * build time whether to render the real file or a designed placeholder, so
 * dropping a file into /public is enough to light it up.
 *
 * Resolve public/ from the project root. `astro dev` and `astro build`
 * (including Vercel) both run with that directory as the cwd. A path
 * relative to import.meta.url works in dev, where the URL is this source
 * file, and fails in production: Vite bundles the module and the URL then
 * points at the build chunk, so the PDF looks missing and the page renders
 * the placeholder.
 */

const publicDir = join(process.cwd(), 'public');

/** Convert a public URL path like "/assets/struct/x.png" to an absolute file path. */
function toFilePath(publicPath: string): string {
  return join(publicDir, publicPath.replace(/^\/+/, ''));
}

export function publicFileExists(publicPath: string | undefined | null): boolean {
  if (!publicPath) return false;
  try {
    return existsSync(toFilePath(publicPath));
  } catch {
    return false;
  }
}

export interface PublicFileInfo {
  exists: boolean;
  /** Size in bytes, when the file exists. */
  size?: number;
  /** Last modified time, when the file exists. */
  modified?: Date;
}

export function publicFileInfo(publicPath: string): PublicFileInfo {
  try {
    const path = toFilePath(publicPath);
    if (!existsSync(path)) return { exists: false };
    const stat = statSync(path);
    return { exists: true, size: stat.size, modified: stat.mtime };
  } catch {
    return { exists: false };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
