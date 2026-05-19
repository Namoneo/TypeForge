import type { Template } from '../types.js';

export const libraryTemplate: Template = {
  id: 'library',
  name: 'Library',
  description: 'NPM library with dual CJS/ESM exports, declaration files, and a build tsconfig',
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
            module: 'dist/index.mjs',
            types: 'dist/index.d.ts',
            exports: {
              '.': {
                import: './dist/index.mjs',
                require: './dist/index.js',
                types: './dist/index.d.ts',
              },
            },
            files: ['dist'],
            scripts: {
              build: 'tsc -p tsconfig.build.json',
              dev: 'tsc --watch',
              test: 'jest',
              lint: 'eslint src/**/*.ts',
              prepublishOnly: 'npm run build',
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
      path: 'tsconfig.build.json',
      content: () =>
        JSON.stringify(
          {
            extends: './tsconfig.json',
            exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts'],
          },
          null,
          2,
        ) + '\n',
    },
    {
      path: 'src/index.ts',
      content: ({ name }) =>
        `export { greet } from './greet.js';\n\nexport type { GreetOptions } from './greet.js';\n`,
    },
    {
      path: 'src/greet.ts',
      content: ({ name }) =>
        `export interface GreetOptions {\n  name: string;\n  prefix?: string;\n}\n\nexport function greet({ name, prefix = 'Hello' }: GreetOptions): string {\n  return \`\${prefix} from ${name}, \${name}!\`;\n}\n`,
    },
    {
      path: '.gitignore',
      content: () => 'node_modules/\ndist/\n*.js.map\n',
    },
    {
      path: 'README.md',
      content: ({ name, description }) =>
        `# ${name}\n\n${description}\n\n## Install\n\n\`\`\`bash\nnpm install ${name}\n\`\`\`\n\n## Usage\n\n\`\`\`typescript\nimport { greet } from '${name}';\n\nconsole.log(greet({ name: 'World' }));\n\`\`\`\n\n## License\n\nMIT\n`,
    },
  ],
};
