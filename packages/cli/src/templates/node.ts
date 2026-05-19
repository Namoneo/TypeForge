import type { Template } from '../types.js';

export const nodeTemplate: Template = {
  id: 'node',
  name: 'Node.js',
  description: 'Node.js application with a CLI entry point and structured src layout',
  files: [
    {
      path: 'package.json',
      content: ({ name, description, author }) =>
        JSON.stringify(
          {
            name,
            version: '0.1.0',
            description,
            main: 'dist/index.js',
            bin: { [name]: './dist/index.js' },
            scripts: {
              build: 'tsc',
              dev: 'tsc --watch',
              start: 'node dist/index.js',
              test: 'jest',
              lint: 'eslint src/**/*.ts',
              format: 'prettier --write "src/**/*.ts"',
            },
            keywords: [],
            author,
            license: 'MIT',
            devDependencies: {
              typescript: '^5.0.0',
              '@types/node': '^22.0.0',
            },
          },
          null,
          2,
        ) + '\n',
    },
    {
      path: 'tsconfig.json',
      content: () =>
        JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'NodeNext',
              moduleResolution: 'NodeNext',
              outDir: './dist',
              rootDir: './src',
              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
              declaration: true,
              sourceMap: true,
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist', '**/*.test.ts'],
          },
          null,
          2,
        ) + '\n',
    },
    {
      path: 'src/index.ts',
      content: ({ name }) =>
        `#!/usr/bin/env node\nimport { run } from './app.js';\n\nrun().catch((err) => {\n  console.error(err.message);\n  process.exit(1);\n});\n`,
    },
    {
      path: 'src/app.ts',
      content: ({ name }) =>
        `export async function run(): Promise<void> {\n  console.log('${name} is running!');\n}\n`,
    },
    {
      path: '.gitignore',
      content: () => 'node_modules/\ndist/\n*.js.map\n',
    },
    {
      path: 'README.md',
      content: ({ name, description }) =>
        `# ${name}\n\n${description}\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run build\nnpm start\n\`\`\`\n\n## License\n\nMIT\n`,
    },
  ],
};
