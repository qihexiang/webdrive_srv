import { readdir, stat } from "fs/promises";
import { join } from "path";

export default async function listDir(dirpath: string) {
    const entries = await readdir(dirpath, { withFileTypes: true });
    const dirs = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
    const files = await Promise.all(entries.filter(entry => entry.isFile())
        .map(async entry => {
            const filename = entry.name;
            const fileStatus = await stat(join(dirpath, filename))
            return {
                filename, size: fileStatus.size, lastModified: fileStatus.mtime, createdAt: fileStatus.ctime
            }
        }))
    return { files, dirs }
}