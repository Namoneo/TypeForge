import type { Template } from '../types.js';

export const basicTemplate: Template = {
  id: 'basic',
  name: 'Basic',
  description: 'Minimal TypeScript module — great for scripts and simple libraries',
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
            types: 'dist/index.d.ts',
            scripts: {
              build: 'tsc',
              dev: 'tsc --watch',
              test: 'jest',
              lint: 'eslint src/**/*.ts',
              format: 'prettier --write "src/**/*.ts"',
            },
            keywords: [],
            author,
            license: 'MIT',
            devDependencies: {
              typescript: '^5.0.0',
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
              declarationMap: true,
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
        `export function greet(name: string): string {\n  return \`Hello from ${name}, \${name}!\`;\n}\n`,
    },
    {
      path: '.gitignore',
      content: () => 'node_modules/\ndist/\n*.js.map\n',
    },
    {
      path: 'README.md',
      content: ({ name, description }) =>
        `# ${name}\n\n${description}\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run build\n\`\`\`\n\n## License\n\nMIT\n`,
    },
  ],
};
