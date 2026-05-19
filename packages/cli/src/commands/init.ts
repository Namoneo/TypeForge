import { basename, resolve } from 'path';
import { cwd } from 'process';
import type { ProjectConfig, TemplateId } from '../types.js';
import { getTemplate, listTemplates } from '../templates/index.js';
import { pathExists, writeProjectFile } from '../utils/files.js';
import { logger } from '../utils/logger.js';

const VALID_TEMPLATES = listTemplates().map((t) => t.id);

export interface InitOptions {
  template?: TemplateId;
  description?: string;
  author?: string;
  force?: boolean;
}

export async function initCommand(opts: InitOptions): Promise<void> {
  const projectDir = resolve(cwd());
  const name = basename(projectDir);

  const templateId = opts.template ?? 'basic';
  if (!VALID_TEMPLATES.includes(templateId)) {
    logger.error(
      `Unknown template "${templateId}". Available: ${VALID_TEMPLATES.join(', ')}`,
    );
    process.exit(1);
  }

  const config: ProjectConfig = {
    name,
    template: templateId,
    description: opts.description ?? `A TypeScript project called ${name}`,
    author: opts.author ?? '',
  };

  const template = getTemplate(templateId);

  logger.heading(`TypeForge — initialising in current directory`);
  logger.info(`Project name: ${logger.bold(name)}`);
  logger.info(`Template: ${logger.bold(template.name)} — ${template.description}`);
  logger.blank();

  const skipped: string[] = [];

  for (const file of template.files) {
    const exists = await pathExists(resolve(projectDir, file.path));
    if (exists && !opts.force) {
      skipped.push(file.path);
      logger.warn(`skipped  ${file.path} (already exists, use --force to overwrite)`);
      continue;
    }
    const content = file.content(config);
    await writeProjectFile(projectDir, file.path, content);
    logger.step(`created ${file.path}`);
  }

  logger.blank();
  if (skipped.length > 0) {
    logger.info(`Initialised with ${skipped.length} file(s) skipped.`);
  } else {
    logger.success('Initialised successfully.');
  }
  logger.blank();
}
