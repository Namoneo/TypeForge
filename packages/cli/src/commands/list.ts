import { listTemplates } from '../templates/index.js';
import { logger } from '../utils/logger.js';

export function listCommand(): void {
  const templates = listTemplates();

  logger.heading('Available templates');

  for (const t of templates) {
    console.log(`  ${logger.bold(t.id.padEnd(10))} ${t.description}`);
  }

  logger.blank();
  logger.dim('Use: typeforge new <name> --template <id>');
  logger.blank();
}
