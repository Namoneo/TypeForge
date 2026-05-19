import { join, resolve } from 'path';
import { cwd } from 'process';
import type { ProjectConfig, TemplateId } from '../types.js';
import { getTemplate, listTemplates } from '../templates/index.js';
import { pathExists, writeProjectFile } from '../utils/files.js';
import { logger } from '../utils/logger.js';

const VALID_NAME = /^[a-z0-9]([a-z0-9-_]*[a-z0-9])?$/;
const VALID_TEMPLATES = listTemplates().map((t) => t.id);

export interface NewOptions {
  template?: TemplateId;
  description?: string;
  author?: string;
}

export async function newCommand(name: string, opts: NewOptions): Promise<void> {
  if (!name) {
    logger.error('Project name is required. Usage: typeforge new <name>');
    process.exit(1);
  }

  if (!VALID_NAME.test(name)) {
    logger.error(
      `Invalid project name "${name}". Use lowercase letters, numbers, hyphens, and underscores only.`,
    );
    process.exit(1);
  }

  const templateId = opts.template ?? 'basic';
  if (!VALID_TEMPLATES.includes(templateId)) {
    logger.error(
      `Unknown template "${templateId}". Available: ${VALID_TEMPLATES.join(', ')}`,
    );
    process.exit(1);
  }

  const projectDir = resolve(cwd(), name);

  if (await pathExists(projectDir)) {
    logger.error(`Directory "${name}" already exists.`);
    process.exit(1);
  }

  const config: ProjectConfig = {
    name,
    template: templateId,
    description: opts.description ?? `A TypeScript project called ${name}`,
    author: opts.author ?? '',
  };

  const template = getTemplate(templateId);

  logger.heading(`TypeForge — creating "${name}"`);
  logger.info(`Template: ${logger.bold(template.name)} — ${template.description}`);
  logger.blank();

  for (const file of template.files) {
    const content = file.content(config);
    await writeProjectFile(projectDir, file.path, content);
    logger.step(`created ${file.path}`);
  }

  logger.blank();
  logger.success(`Project "${name}" created at ${projectDir}`);
  logger.blank();
  logger.dim('Next steps:');
  logger.dim(`  cd ${name}`);
  logger.dim('  npm install');
  logger.dim('  npm run build');
  logger.blank();
}
