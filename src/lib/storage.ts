/**
 * Local Upload Storage Utilities
 *
 * File structure: public/uploads/{userId}/{timestamp}.webp
 * Public URL:     /uploads/{userId}/{timestamp}.webp
 */

import { unlink, readdir, stat } from 'fs/promises';
import path from 'path';

/** Root upload directory */
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/** Root temp upload directory */
export const TEMP_DIR = path.join(UPLOAD_DIR, 'temp');

/** Root final upload directory */
export const FINAL_DIR = path.join(UPLOAD_DIR, 'final');

/** Per-user final upload directory */
export function getUserUploadDir(userId: string): string {
    return path.join(FINAL_DIR, userId);
}

/** Per-user temp upload directory */
export function getTempUploadDir(userId: string): string {
    return path.join(TEMP_DIR, userId);
}

/** Max total upload size per user (bytes). Default: 10 MB */
export const QUOTA_PER_USER_BYTES = 10 * 1024 * 1024;

/**
 * Check if a URL points to a local upload file.
 * Only local files (starting with /uploads/) should ever be auto-deleted.
 */
export function isLocalUpload(url: string): boolean {
    return typeof url === 'string' && url.startsWith('/uploads/');
}

/** Check if URL points to a temporary upload */
export function isTempUpload(url: string): boolean {
    return typeof url === 'string' && url.startsWith('/uploads/temp/');
}

/** Check if URL points to a final upload */
export function isFinalUpload(url: string): boolean {
    return typeof url === 'string' && url.startsWith('/uploads/final/');
}

/**
 * Delete a local upload file safely.
 * Handles both regular format (/uploads/{userId}/filename.ext)
 * and temp format (/uploads/temp/{userId}/filename.ext).
 * Prevents path traversal attacks.
 */
export async function deleteLocalFile(url: string): Promise<void> {
    if (!isLocalUpload(url)) return;
    try {
        const relative = url.slice('/uploads/'.length); // e.g. "userId/123.webp" or "temp/userId/123.webp"
        if (relative.split('/').some(seg => seg === '..')) return;
        const filePath = path.join(UPLOAD_DIR, relative);
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
 * Calculate total bytes used by a specific user.
 * Reads from public/uploads/{userId}/ folder.
 */
export async function getUserStorageBytes(userId: string): Promise<number> {
    try {
        const userDir = getUserUploadDir(userId);
        const files = await readdir(userDir);
        let total = 0;
        await Promise.all(
            files.map(async f => {
                try {
                    const s = await stat(path.join(userDir, f));
                    if (s.isFile()) {
                        total += s.size;
                    }
                } catch {
                    // skip
                }
            })
        );
        return total;
    } catch {
        return 0; // user folder may not exist yet
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

import { rename, mkdir as fsMkdir } from 'fs/promises';

/**
 * Moves a file from the temp directory to the final user directory.
 * @param tempUrl e.g. "/uploads/temp/userId/filename.webp"
 * @param userId Needed to reconstruct folder and verify ownership
 * @returns The final URL e.g. "/uploads/userId/filename.webp"
 */
export async function moveTempToFinal(tempUrl: string, userId: string): Promise<string> {
    if (!isTempUpload(tempUrl)) return tempUrl; // not temp, return as is

    // Extract filename from /uploads/temp/{userId}/{filename}
    const parts = tempUrl.replace(/^\/uploads\/temp\//, '').split('/');
    if (parts[0] !== userId) {
        throw new Error('Forbidden: Attempted to move file belonging to another user.');
    }
    const filename = parts[1];

    const tempPath = path.join(getTempUploadDir(userId), filename);
    const finalDir = getUserUploadDir(userId);
    const finalPath = path.join(finalDir, filename);

    // Ensure final dir exists
    await fsMkdir(finalDir, { recursive: true });

    // Move file
    try {
        await rename(tempPath, finalPath);
    } catch (e: any) {
        // if file isn't found, it might have been already moved or deleted.
        console.error('Failed moving temp to final:', tempUrl, e.message);
    }

    return `/uploads/final/${userId}/${filename}`;
}
