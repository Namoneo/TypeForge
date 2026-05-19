import type { TemplateId } from './types.js';
import { newCommand } from './commands/new.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { logger } from './utils/logger.js';

const VERSION = '0.1.0';

const HELP = `
${logger.bold('TypeForge')} — TypeScript project scaffolding CLI

Usage:
  typeforge new <name> [options]   Create a new TypeScript project
  typeforge init [options]         Initialise TypeScript in the current directory
  typeforge list                   List available templates
  typeforge --help                 Show this help message
  typeforge --version              Show version

Options for new / init:
  --template <id>       Template to use: basic | node | library  (default: basic)
  --description <text>  Project description
  --author <name>       Author name
  --force               Overwrite existing files (init only)

Examples:
  typeforge new my-app
  typeforge new my-app --template node --author "Jane Doe"
  typeforge init --template library
  typeforge list
`;

function parseFlags(args: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

export async function runCli(argv: string[]): Promise<void> {
  const [command, ...rest] = argv.slice(2);

  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log(`typeforge v${VERSION}`);
    return;
  }

  if (command === 'list') {
    listCommand();
    return;
  }

  if (command === 'new') {
    const [name, ...flagArgs] = rest;
    const flags = parseFlags(flagArgs);
    await newCommand(name, {
      template: flags['template'] as TemplateId | undefined,
      description: flags['description'] as string | undefined,
      author: flags['author'] as string | undefined,
    });
    return;
  }

  if (command === 'init') {
    const flags = parseFlags(rest);
    await initCommand({
      template: flags['template'] as TemplateId | undefined,
      description: flags['description'] as string | undefined,
      author: flags['author'] as string | undefined,
      force: flags['force'] === true,
    });
    return;
  }

  logger.error(`Unknown command: "${command}". Run typeforge --help for usage.`);
  process.exit(1);
}
