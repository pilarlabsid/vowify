/**
 * Local Upload Storage Utilities
 *
 * Helpers for managing files in public/uploads/:
 * - Check per-user quota before accepting uploads
 * - Delete local files that are no longer referenced
 */

import { unlink, readdir, stat } from 'fs/promises';
import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/** Max total upload size per user (bytes). Default: 200 MB */
export const QUOTA_PER_USER_BYTES = 200 * 1024 * 1024;

/**
 * Check if a URL points to a local upload file.
 * Only local files (starting with /uploads/) should ever be auto-deleted.
 */
export function isLocalUpload(url: string): boolean {
    return typeof url === 'string' && url.startsWith('/uploads/');
}

/**
 * Extract the filename from a local upload URL.
 * e.g. "/uploads/abc-123.jpg" → "abc-123.jpg"
 */
export function urlToFilename(url: string): string {
    return path.basename(url);
}

/**
 * Delete a local upload file safely (ignores errors if file doesn't exist).
 * Only deletes files that are inside UPLOAD_DIR to prevent path traversal.
 */
export async function deleteLocalFile(url: string): Promise<void> {
    if (!isLocalUpload(url)) return;
    try {
        const filename = urlToFilename(url);
        // Prevent path traversal: filename must not contain directory separators
        if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) return;
        const filePath = path.join(UPLOAD_DIR, filename);
        await unlink(filePath);
    } catch {
        // File might already be deleted or never existed — ignore
    }
}

/**
 * Delete multiple local upload files in parallel.
 */
export async function deleteLocalFiles(urls: string[]): Promise<void> {
    await Promise.all(urls.filter(isLocalUpload).map(deleteLocalFile));
}

/**
 * Calculate total bytes used by a specific user in public/uploads/.
 * Files are identified by the prefix "{userId}-" in their filename.
 */
export async function getUserStorageBytes(userId: string): Promise<number> {
    try {
        const files = await readdir(UPLOAD_DIR);
        const prefix = `${userId}-`;
        let total = 0;
        await Promise.all(
            files
                .filter(f => f.startsWith(prefix))
                .map(async f => {
                    try {
                        const s = await stat(path.join(UPLOAD_DIR, f));
                        total += s.size;
                    } catch {
                        // skip
                    }
                })
        );
        return total;
    } catch {
        return 0; // uploads dir may not exist yet
    }
}

/**
 * Format bytes into a human-readable string.
 */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Given the old and new values of a photos slot map,
 * return the list of OLD local file URLs that were replaced or removed.
 */
export function findReplacedSlotUrls(
    oldPhotos: Record<string, string>,
    newPhotos: Record<string, string>,
): string[] {
    const toDelete: string[] = [];
    for (const [key, oldUrl] of Object.entries(oldPhotos)) {
        if (!isLocalUpload(oldUrl)) continue;
        const newUrl = newPhotos[key];
        // If the key now has a different (or empty) URL → old file is orphaned
        if (newUrl !== oldUrl) toDelete.push(oldUrl);
    }
    return toDelete;
}

/**
 * Given the old and new gallery arrays,
 * return any local file URLs that were in old but not in new.
 */
export function findRemovedGalleryUrls(
    oldGallery: string[],
    newGallery: string[],
): string[] {
    const newSet = new Set(newGallery);
    return oldGallery.filter(url => isLocalUpload(url) && !newSet.has(url));
}
