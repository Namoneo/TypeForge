import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

const challenges = [
  {
    title: 'Hello TypeScript',
    description: 'Annotate a function so it accepts a string name and returns a greeting string.',
    difficulty: Difficulty.BEGINNER,
    track: 'beginner',
    order: 1,
    starterCode: `// Add a return type annotation and parameter type
function greet(name) {
  return 'Hello, ' + name + '!';
}`,
    solutionCode: `function greet(name: string): string {
  return 'Hello, ' + name + '!';
}`,
    testCases: [
      { description: 'Returns a greeting for "Alice"', input: 'return greet("Alice")', expected: 'Hello, Alice!' },
      { description: 'Returns a greeting for "World"', input: 'return greet("World")', expected: 'Hello, World!' },
    ],
    xpReward: 10,
    tags: ['functions', 'types'],
    published: true,
  },
  {
    title: 'Union Types',
    description: 'Create a type `StringOrNumber` that can hold either a string or a number.',
    difficulty: Difficulty.BEGINNER,
    track: 'beginner',
    order: 2,
    starterCode: `// Define a union type
type StringOrNumber = // your type here

const a: StringOrNumber = 42;
const b: StringOrNumber = 'hello';`,
    solutionCode: `type StringOrNumber = string | number;`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 10,
    tags: ['unions', 'types'],
    published: true,
  },
  {
    title: 'Generic Identity',
    description: 'Implement a generic `identity<T>` function that returns its argument unchanged.',
    difficulty: Difficulty.INTERMEDIATE,
    track: 'intermediate',
    order: 1,
    starterCode: `// Make this function generic
function identity(arg: any): any {
  return arg;
}`,
    solutionCode: `function identity<T>(arg: T): T {
  return arg;
}`,
    testCases: [
      { description: 'Returns string unchanged', input: 'return identity("hello")', expected: 'hello' },
      { description: 'Returns number unchanged', input: 'return identity(42)', expected: '42' },
    ],
    xpReward: 20,
    tags: ['generics', 'functions'],
    published: true,
  },
  {
    title: 'DeepReadonly',
    description: 'Implement a `DeepReadonly<T>` mapped type that recursively makes all properties readonly.',
    difficulty: Difficulty.ADVANCED,
    track: 'advanced',
    order: 1,
    starterCode: `// Implement DeepReadonly
type DeepReadonly<T> = // your implementation

type Config = { server: { host: string; port: number }; debug: boolean };
type ReadonlyConfig = DeepReadonly<Config>;`,
    solutionCode: `type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]; };`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 50,
    tags: ['mapped-types', 'recursive', 'advanced'],
    published: true,
  },
];

async function main() {
  console.log('Seeding database…');
  for (const c of challenges) {
    await prisma.challenge.upsert({
      where: { id: c.title },
      update: {},
      create: { ...c, testCases: c.testCases as any },
    });
    console.log(`  ✓ ${c.title}`);
  }
  console.log('Done.');
}

main().finally(() => prisma.$disconnect());
