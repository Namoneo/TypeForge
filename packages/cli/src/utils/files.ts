import { mkdir, writeFile, access } from 'fs/promises';
import { join, dirname } from 'path';

export async function pathExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function writeProjectFile(
  projectDir: string,
  filePath: string,
  content: string,
): Promise<void> {
  const fullPath = join(projectDir, filePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, 'utf-8');
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}
