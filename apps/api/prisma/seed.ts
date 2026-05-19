import { Difficulty, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const challenges = [
  // ─────────────────────────────────────────────────────────────────
  // BEGINNER TRACK (15 challenges)
  // ─────────────────────────────────────────────────────────────────
  {
    title: 'Hello TypeScript',
    description: 'Annotate the `greet` function so it accepts a `name` parameter of type `string` and returns a `string`.\n\nType annotations tell TypeScript what kinds of values are allowed. Add `: string` after the parameter and `: string` after the closing parenthesis.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 1,
    starterCode: `// Add parameter and return type annotations
function greet(name) {
  return 'Hello, ' + name + '!';
}`,
    solutionCode: `function greet(name: string): string {
  return 'Hello, ' + name + '!';
}`,
    testCases: [
      { description: 'Greets Alice', input: 'return greet("Alice")', expected: 'Hello, Alice!' },
      { description: 'Greets World', input: 'return greet("World")', expected: 'Hello, World!' },
      { description: 'Greets TypeScript', input: 'return greet("TypeScript")', expected: 'Hello, TypeScript!' },
    ],
    xpReward: 10,
    tags: ['functions', 'annotations', 'strings'],
    tips: [
      'TypeScript type annotations use a colon after the parameter name. Try adding `: string` after `name`.',
      'To annotate the return type, add `: string` between the closing `)` and the opening `{` of the function body.',
      'The completed signature looks like: `function greet(name: string): string`',
    ],
    published: true,
  },
  {
    title: 'Number Operations',
    description: 'Implement `clamp(value: number, min: number, max: number): number` that constrains a value between min and max.\n\n- If `value < min`, return `min`\n- If `value > max`, return `max`\n- Otherwise return `value`',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 2,
    starterCode: `// Implement clamp so value stays within [min, max]
function clamp(value: number, min: number, max: number): number {
  // your code here
}`,
    solutionCode: `function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}`,
    testCases: [
      { description: 'Value within range', input: 'return clamp(5, 0, 10)', expected: '5' },
      { description: 'Value below min', input: 'return clamp(-5, 0, 10)', expected: '0' },
      { description: 'Value above max', input: 'return clamp(15, 0, 10)', expected: '10' },
      { description: 'Value equals min', input: 'return clamp(0, 0, 10)', expected: '0' },
      { description: 'Value equals max', input: 'return clamp(10, 0, 10)', expected: '10' },
    ],
    xpReward: 10,
    tags: ['numbers', 'functions', 'conditionals'],
    tips: [
      'Think about three cases: value below min, value above max, or value already in range.',
      'Use two early-return `if` statements to handle the out-of-range cases first.',
      'Pattern: `if (value < min) return min; if (value > max) return max; return value;`',
    ],
    published: true,
  },
  {
    title: 'Typed Arrays',
    description: 'Implement `sumArray(nums: number[]): number` that returns the sum of all numbers in the array.\n\nIn TypeScript, `number[]` is an array of numbers. Use `.reduce()` or a loop to sum the elements.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 3,
    starterCode: `// Annotate and implement sumArray
function sumArray(nums: number[]): number {
  // your code here
}`,
    solutionCode: `function sumArray(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}`,
    testCases: [
      { description: 'Sum of [1,2,3]', input: 'return sumArray([1, 2, 3])', expected: '6' },
      { description: 'Sum of empty array', input: 'return sumArray([])', expected: '0' },
      { description: 'Sum of [10,20,30]', input: 'return sumArray([10, 20, 30])', expected: '60' },
      { description: 'Sum of single element', input: 'return sumArray([42])', expected: '42' },
    ],
    xpReward: 10,
    tags: ['arrays', 'numbers', 'reduce'],
    tips: [
      'Arrays in TypeScript have all the same methods as JavaScript arrays — `.reduce()`, `.forEach()`, etc.',
      '`Array.prototype.reduce` with an initial value of `0` handles the empty array case automatically.',
      'Try: `return nums.reduce((acc, n) => acc + n, 0);`',
    ],
    published: true,
  },
  {
    title: 'Tuple Types',
    description: 'Implement `swap(pair: [string, number]): [number, string]` that swaps the two elements of a tuple.\n\nTuples are fixed-length arrays where each position has a known type. `[string, number]` means index 0 is a string and index 1 is a number.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 4,
    starterCode: `// Implement swap using tuple types
function swap(pair: [string, number]): [number, string] {
  // your code here
}`,
    solutionCode: `function swap(pair: [string, number]): [number, string] {
  return [pair[1], pair[0]];
}`,
    testCases: [
      { description: 'Swaps ["hello", 42]', input: 'return JSON.stringify(swap(["hello", 42]))', expected: '[42,"hello"]' },
      { description: 'Swaps ["world", 0]', input: 'return JSON.stringify(swap(["world", 0]))', expected: '[0,"world"]' },
      { description: 'Swaps ["a", 1]', input: 'return JSON.stringify(swap(["a", 1]))', expected: '[1,"a"]' },
    ],
    xpReward: 12,
    tags: ['tuples', 'arrays', 'types'],
    tips: [
      'Tuples are accessed by index, just like arrays — use `pair[0]` and `pair[1]`.',
      'Return a new array literal with the positions swapped.',
      'The complete solution: `return [pair[1], pair[0]];`',
    ],
    published: true,
  },
  {
    title: 'Object Interfaces',
    description: 'Define a `Point` interface with `x: number` and `y: number` properties, then implement `distance(p: Point): number` that returns the distance from the origin using the Pythagorean theorem: `Math.sqrt(x² + y²)`.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 5,
    starterCode: `// Define Point interface and implement distance
interface Point {
  // your properties here
}

function distance(p: Point): number {
  // your code here
}`,
    solutionCode: `interface Point {
  x: number;
  y: number;
}

function distance(p: Point): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}`,
    testCases: [
      { description: 'Distance of (3,4) is 5', input: 'return distance({ x: 3, y: 4 })', expected: '5' },
      { description: 'Distance of origin is 0', input: 'return distance({ x: 0, y: 0 })', expected: '0' },
      { description: 'Distance of (1,0) is 1', input: 'return distance({ x: 1, y: 0 })', expected: '1' },
    ],
    xpReward: 12,
    tags: ['interfaces', 'objects', 'math'],
    tips: [
      'Interface properties use `propertyName: Type;` syntax. Add `x: number;` and `y: number;` inside the interface body.',
      'Access object properties with dot notation: `p.x` and `p.y`.',
      'The Pythagorean formula: `Math.sqrt(p.x * p.x + p.y * p.y)`',
    ],
    published: true,
  },
  {
    title: 'Optional Properties',
    description: 'Define a `User` interface with `name: string`, `email: string`, and optional `age?: number`. Implement `formatUser(u: User): string` that returns `"name (age)"` if age is present, or just `"name"` if not.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 6,
    starterCode: `// Define User with optional age, implement formatUser
interface User {
  name: string;
  email: string;
  // add optional age here
}

function formatUser(u: User): string {
  // your code here
}`,
    solutionCode: `interface User {
  name: string;
  email: string;
  age?: number;
}

function formatUser(u: User): string {
  if (u.age !== undefined) {
    return u.name + ' (' + u.age + ')';
  }
  return u.name;
}`,
    testCases: [
      { description: 'User with age', input: 'return formatUser({ name: "Alice", email: "a@b.com", age: 30 })', expected: 'Alice (30)' },
      { description: 'User without age', input: 'return formatUser({ name: "Bob", email: "b@c.com" })', expected: 'Bob' },
      { description: 'User with age 0', input: 'return formatUser({ name: "Carol", email: "c@d.com", age: 0 })', expected: 'Carol (0)' },
    ],
    xpReward: 12,
    tags: ['interfaces', 'optional', 'objects'],
    tips: [
      'Mark a property optional with `?` after its name: `age?: number;`',
      'Check for an optional property with `u.age !== undefined` — don\'t use `if (u.age)` because that would fail for `age: 0`.',
      'Pattern: `if (u.age !== undefined) return u.name + " (" + u.age + ")"; return u.name;`',
    ],
    published: true,
  },
  {
    title: 'Union Types',
    description: 'Implement `formatId(id: string | number): string` that returns the id prefixed with `"ID:"`. Union types allow a value to be one of several types.\n\nExample: `formatId(42)` → `"ID:42"`, `formatId("abc")` → `"ID:abc"`',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 7,
    starterCode: `// Implement formatId accepting string | number
function formatId(id: string | number): string {
  // your code here
}`,
    solutionCode: `function formatId(id: string | number): string {
  return 'ID:' + id;
}`,
    testCases: [
      { description: 'Format number id', input: 'return formatId(42)', expected: 'ID:42' },
      { description: 'Format string id', input: 'return formatId("abc")', expected: 'ID:abc' },
      { description: 'Format zero', input: 'return formatId(0)', expected: 'ID:0' },
      { description: 'Format empty string', input: 'return formatId("")', expected: 'ID:' },
    ],
    xpReward: 12,
    tags: ['unions', 'strings', 'types'],
    tips: [
      'The `|` operator means "or" — `string | number` accepts either type.',
      'String concatenation `+` automatically coerces numbers to strings, so the same code works for both.',
      'Simplest solution: `return "ID:" + id;` or use a template literal `` `ID:${id}` ``',
    ],
    published: true,
  },
  {
    title: 'Intersection Types',
    description: 'Define `Named` (with `name: string`) and `Aged` (with `age: number`) interfaces. Create a `Person` type as their intersection (`Named & Aged`). Implement `introduce(p: Person): string` returning `"Hi, I am name and I am age years old."`',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 8,
    starterCode: `// Define Named, Aged, and Person intersection type
interface Named {
  // your code here
}

interface Aged {
  // your code here
}

type Person = Named & Aged;

function introduce(p: Person): string {
  // your code here
}`,
    solutionCode: `interface Named {
  name: string;
}

interface Aged {
  age: number;
}

type Person = Named & Aged;

function introduce(p: Person): string {
  return 'Hi, I am ' + p.name + ' and I am ' + p.age + ' years old.';
}`,
    testCases: [
      { description: 'Introduces Alice aged 25', input: 'return introduce({ name: "Alice", age: 25 })', expected: 'Hi, I am Alice and I am 25 years old.' },
      { description: 'Introduces Bob aged 40', input: 'return introduce({ name: "Bob", age: 40 })', expected: 'Hi, I am Bob and I am 40 years old.' },
    ],
    xpReward: 14,
    tags: ['intersections', 'interfaces', 'types'],
    tips: [
      'Fill in `Named` with `name: string;` and `Aged` with `age: number;`',
      'The `&` operator combines types — `Named & Aged` requires BOTH name and age properties.',
      'Build the string with concatenation: `"Hi, I am " + p.name + " and I am " + p.age + " years old."`',
    ],
    published: true,
  },
  {
    title: 'Type Narrowing',
    description: 'Implement `describe(value: string | number | boolean): string` using `typeof` to distinguish types:\n- string → `"string: <value>"`\n- number → `"number: <value>"`\n- boolean → `"boolean: <value>"`',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 9,
    starterCode: `// Use typeof to narrow the union type
function describe(value: string | number | boolean): string {
  // your code here
}`,
    solutionCode: `function describe(value: string | number | boolean): string {
  if (typeof value === 'string') return 'string: ' + value;
  if (typeof value === 'number') return 'number: ' + value;
  return 'boolean: ' + value;
}`,
    testCases: [
      { description: 'Describes a string', input: 'return describe("hello")', expected: 'string: hello' },
      { description: 'Describes a number', input: 'return describe(42)', expected: 'number: 42' },
      { description: 'Describes true', input: 'return describe(true)', expected: 'boolean: true' },
      { description: 'Describes false', input: 'return describe(false)', expected: 'boolean: false' },
    ],
    xpReward: 14,
    tags: ['narrowing', 'typeof', 'unions'],
    tips: [
      'Use the `typeof` operator: `typeof value === "string"` returns true if value is a string.',
      'Chain `if` statements for each type. TypeScript narrows the type inside each branch.',
      'Pattern: `if (typeof value === "string") return "string: " + value;` then number, then default to boolean.',
    ],
    published: true,
  },
  {
    title: 'String Enums',
    description: 'Define a `Direction` string enum with values `Up = "UP"`, `Down = "DOWN"`, `Left = "LEFT"`, `Right = "RIGHT"`. Implement `opposite(d: Direction): Direction` returning the opposite direction.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 10,
    starterCode: `// Define Direction enum and implement opposite()
enum Direction {
  // your values here
}

function opposite(d: Direction): Direction {
  // your code here
}`,
    solutionCode: `enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

function opposite(d: Direction): Direction {
  switch (d) {
    case Direction.Up: return Direction.Down;
    case Direction.Down: return Direction.Up;
    case Direction.Left: return Direction.Right;
    case Direction.Right: return Direction.Left;
  }
}`,
    testCases: [
      { description: 'Opposite of Up is Down', input: 'return opposite(Direction.Up)', expected: 'DOWN' },
      { description: 'Opposite of Down is Up', input: 'return opposite(Direction.Down)', expected: 'UP' },
      { description: 'Opposite of Left is Right', input: 'return opposite(Direction.Left)', expected: 'RIGHT' },
      { description: 'Opposite of Right is Left', input: 'return opposite(Direction.Right)', expected: 'LEFT' },
    ],
    xpReward: 15,
    tags: ['enums', 'switch', 'strings'],
    tips: [
      'String enums assign explicit values: `Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT"`',
      'Use a `switch (d)` statement with cases for each Direction value.',
      'Each case returns the opposite: Up→Down, Down→Up, Left→Right, Right→Left.',
    ],
    published: true,
  },
  {
    title: 'Literal Types',
    description: 'Implement `align(text: string, direction: "left" | "center" | "right", width: number): string` that pads the text:\n- `"left"`: pad spaces on the right\n- `"right"`: pad spaces on the left\n- `"center"`: pad equally on both sides (extra space on right)',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 11,
    starterCode: `// Use literal types for direction
function align(
  text: string,
  direction: 'left' | 'center' | 'right',
  width: number
): string {
  // your code here
}`,
    solutionCode: `function align(
  text: string,
  direction: 'left' | 'center' | 'right',
  width: number
): string {
  const pad = width - text.length;
  if (pad <= 0) return text;
  if (direction === 'left') return text + ' '.repeat(pad);
  if (direction === 'right') return ' '.repeat(pad) + text;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}`,
    testCases: [
      { description: 'Left align', input: 'return align("hi", "left", 5)', expected: 'hi   ' },
      { description: 'Right align', input: 'return align("hi", "right", 5)', expected: '   hi' },
      { description: 'Center align even', input: 'return align("hi", "center", 6)', expected: '  hi  ' },
      { description: 'Text longer than width', input: 'return align("hello", "left", 3)', expected: 'hello' },
    ],
    xpReward: 15,
    tags: ['literal-types', 'strings', 'padding'],
    tips: [
      'Calculate the padding amount first: `const pad = width - text.length;`. Return text unchanged if pad ≤ 0.',
      'Use `" ".repeat(n)` to build padding. For "left", append; for "right", prepend.',
      'For "center", split: `const left = Math.floor(pad / 2); const right = pad - left;` then sandwich the text.',
    ],
    published: true,
  },
  {
    title: 'Type Aliases',
    description: 'Define a `Coordinates` type alias as `[number, number]` and a `Transform` type alias as a function `(c: Coordinates) => Coordinates`. Implement `scale(factor: number): Transform` that returns a transform multiplying both coordinates by the factor.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 12,
    starterCode: `// Define type aliases and implement scale
type Coordinates = // [number, number]
type Transform = // function type

function scale(factor: number): Transform {
  // your code here
}`,
    solutionCode: `type Coordinates = [number, number];
type Transform = (c: Coordinates) => Coordinates;

function scale(factor: number): Transform {
  return (c: Coordinates): Coordinates => [c[0] * factor, c[1] * factor];
}`,
    testCases: [
      { description: 'Scale by 2', input: 'return JSON.stringify(scale(2)([3, 4]))', expected: '[6,8]' },
      { description: 'Scale by 0', input: 'return JSON.stringify(scale(0)([3, 4]))', expected: '[0,0]' },
      { description: 'Scale by 1 (identity)', input: 'return JSON.stringify(scale(1)([5, 7]))', expected: '[5,7]' },
      { description: 'Scale negative', input: 'return JSON.stringify(scale(-1)([3, 4]))', expected: '[-3,-4]' },
    ],
    xpReward: 15,
    tags: ['type-aliases', 'tuples', 'higher-order'],
    tips: [
      'Define type aliases with the `type` keyword: `type Coordinates = [number, number];`',
      '`Transform` is a function type: `type Transform = (c: Coordinates) => Coordinates;`',
      '`scale` returns a closure: `return (c) => [c[0] * factor, c[1] * factor];`',
    ],
    published: true,
  },
  {
    title: 'Nullish Coalescing',
    description: 'Implement `getDisplayName(user: { name?: string; nickname?: string } | null): string` that returns the nickname if present, otherwise the name, otherwise `"Anonymous"`.\n\nUse the nullish coalescing operator `??` and optional chaining `?.` to handle null/undefined safely.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 13,
    starterCode: `// Use ?? and ?. to safely handle missing values
function getDisplayName(user: { name?: string; nickname?: string } | null): string {
  // your code here
}`,
    solutionCode: `function getDisplayName(user: { name?: string; nickname?: string } | null): string {
  return user?.nickname ?? user?.name ?? 'Anonymous';
}`,
    testCases: [
      { description: 'Returns nickname when present', input: 'return getDisplayName({ name: "Alice", nickname: "Ally" })', expected: 'Ally' },
      { description: 'Falls back to name', input: 'return getDisplayName({ name: "Bob" })', expected: 'Bob' },
      { description: 'Falls back to Anonymous when both missing', input: 'return getDisplayName({})', expected: 'Anonymous' },
      { description: 'Handles null user', input: 'return getDisplayName(null)', expected: 'Anonymous' },
    ],
    xpReward: 14,
    tags: ['nullish-coalescing', 'optional-chaining', 'beginner'],
    tips: [
      'Optional chaining `user?.nickname` returns undefined safely if user is null.',
      'The nullish coalescing operator `??` provides a fallback only for null/undefined (not for "" or 0).',
      'Chain them: `return user?.nickname ?? user?.name ?? "Anonymous";`',
    ],
    published: true,
  },
  {
    title: 'Array Filter and Find',
    description: 'Implement two functions on typed arrays:\n- `firstEven(nums: number[]): number | undefined` — returns the first even number, or undefined if none\n- `onlyEvens(nums: number[]): number[]` — returns all even numbers\n\nUse `.find()` and `.filter()` methods.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 14,
    starterCode: `// Implement firstEven and onlyEvens using array methods
function firstEven(nums: number[]): number | undefined {
  // your code here
}

function onlyEvens(nums: number[]): number[] {
  // your code here
}`,
    solutionCode: `function firstEven(nums: number[]): number | undefined {
  return nums.find((n) => n % 2 === 0);
}

function onlyEvens(nums: number[]): number[] {
  return nums.filter((n) => n % 2 === 0);
}`,
    testCases: [
      { description: 'firstEven returns first match', input: 'return firstEven([1, 3, 4, 5, 6])', expected: '4' },
      { description: 'firstEven returns undefined when none', input: 'return String(firstEven([1, 3, 5]))', expected: 'undefined' },
      { description: 'onlyEvens filters correctly', input: 'return onlyEvens([1, 2, 3, 4, 5, 6]).join(",")', expected: '2,4,6' },
      { description: 'onlyEvens returns empty when no matches', input: 'return JSON.stringify(onlyEvens([1, 3, 5]))', expected: '[]' },
    ],
    xpReward: 14,
    tags: ['arrays', 'filter', 'find', 'beginner'],
    tips: [
      '`.find()` returns the first matching element or `undefined` — perfect for `firstEven`.',
      '`.filter()` returns a new array of all matching elements — use it for `onlyEvens`.',
      'Check evenness with `n % 2 === 0`. Try: `nums.find(n => n % 2 === 0)` and `nums.filter(n => n % 2 === 0)`.',
    ],
    published: true,
  },
  {
    title: 'Object Spread',
    description: 'Implement `mergeDefaults<T extends object>(defaults: T, overrides: Partial<T>): T` that merges two objects, with values in `overrides` taking precedence.\n\nUse the spread operator `...` to combine objects.',
    difficulty: 'BEGINNER',
    track: 'beginner',
    order: 15,
    starterCode: `// Implement mergeDefaults using the spread operator
function mergeDefaults<T extends object>(defaults: T, overrides: Partial<T>): T {
  // your code here
}`,
    solutionCode: `function mergeDefaults<T extends object>(defaults: T, overrides: Partial<T>): T {
  return { ...defaults, ...overrides };
}`,
    testCases: [
      { description: 'Overrides take precedence', input: 'return mergeDefaults({ a: 1, b: 2 }, { b: 99 }).b', expected: '99' },
      { description: 'Defaults preserved when not overridden', input: 'return mergeDefaults({ a: 1, b: 2 }, { b: 99 }).a', expected: '1' },
      { description: 'Empty overrides keeps all defaults', input: 'return JSON.stringify(mergeDefaults({ x: 10 }, {}))', expected: '{"x":10}' },
      { description: 'String values', input: 'return mergeDefaults({ name: "default" }, { name: "custom" }).name', expected: 'custom' },
    ],
    xpReward: 15,
    tags: ['spread', 'objects', 'generics', 'beginner'],
    tips: [
      'The spread operator `...` copies enumerable properties from an object.',
      'Order matters: later properties override earlier ones. Put defaults first, overrides second.',
      'The solution is a one-liner: `return { ...defaults, ...overrides };`',
    ],
    published: true,
  },

  // ─────────────────────────────────────────────────────────────────
  // INTERMEDIATE TRACK (15 challenges)
  // ─────────────────────────────────────────────────────────────────
  {
    title: 'Generic Identity',
    description: 'Replace the `any` types with a proper generic type parameter `T` so that `identity<T>(arg: T): T` preserves the exact type of its argument instead of widening to `any`.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 1,
    starterCode: `// Replace any with a generic type parameter T
function identity(arg: any): any {
  return arg;
}`,
    solutionCode: `function identity<T>(arg: T): T {
  return arg;
}`,
    testCases: [
      { description: 'Returns string unchanged', input: 'return identity("hello")', expected: 'hello' },
      { description: 'Returns number unchanged', input: 'return identity(42)', expected: '42' },
      { description: 'Returns boolean unchanged', input: 'return identity(true)', expected: 'true' },
    ],
    xpReward: 20,
    tags: ['generics', 'functions', 'types'],
    tips: [
      'Add a type parameter `<T>` immediately after the function name.',
      'Replace both `any` occurrences with the type parameter `T`.',
      'Full signature: `function identity<T>(arg: T): T`',
    ],
    published: true,
  },
  {
    title: 'Generic Stack',
    description: 'Implement a `Stack<T>` class with:\n- `push(item: T): void` — add to top\n- `pop(): T | undefined` — remove and return top item\n- `peek(): T | undefined` — return top without removing\n- `size: number` getter — number of items',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 2,
    starterCode: `// Implement a generic Stack<T> class
class Stack<T> {
  // your code here
}`,
    solutionCode: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}`,
    testCases: [
      { description: 'Push and pop', input: 'const s = new Stack(); s.push(1); s.push(2); return s.pop()', expected: '2' },
      { description: 'Peek does not remove', input: 'const s = new Stack(); s.push("a"); s.peek(); return s.size', expected: '1' },
      { description: 'Pop empty returns undefined', input: 'const s = new Stack(); return String(s.pop())', expected: 'undefined' },
      { description: 'Size tracks items', input: 'const s = new Stack(); s.push(1); s.push(2); s.push(3); return s.size', expected: '3' },
    ],
    xpReward: 22,
    tags: ['generics', 'classes', 'data-structures'],
    tips: [
      'Store items in a private field of type `T[]`: `private items: T[] = [];`',
      '`push` and `pop` can delegate directly to the underlying array methods.',
      'Use a getter for `size`: `get size(): number { return this.items.length; }`. `peek` returns the last element.',
    ],
    published: true,
  },
  {
    title: 'Generic Constraints',
    description: 'Implement `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]` that safely retrieves a property from an object. The constraint `K extends keyof T` ensures only valid keys are accepted.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 3,
    starterCode: `// Add generic constraints so only valid keys are accepted
function getProperty(obj: any, key: any): any {
  return obj[key];
}`,
    solutionCode: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
    testCases: [
      { description: 'Get name property', input: 'return getProperty({ name: "Alice", age: 30 }, "name")', expected: 'Alice' },
      { description: 'Get age property', input: 'return getProperty({ name: "Alice", age: 30 }, "age")', expected: '30' },
      { description: 'Get nested value', input: 'return getProperty({ x: 10, y: 20 }, "x")', expected: '10' },
    ],
    xpReward: 25,
    tags: ['generics', 'keyof', 'constraints'],
    tips: [
      'Add two type parameters: `<T, K extends keyof T>`. The constraint ensures K is a valid key of T.',
      'Replace parameter types: `obj: T, key: K`.',
      'The return type uses indexed access: `T[K]` gives the type of the value at key K.',
    ],
    published: true,
  },
  {
    title: 'Partial<T>',
    description: 'Implement `updateUser(user: User, changes: Partial<User>): User` that returns a new User with the changes merged in. `Partial<T>` makes all properties optional.\n\n```typescript\ninterface User { name: string; email: string; age: number; }\n```',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 4,
    starterCode: `interface User {
  name: string;
  email: string;
  age: number;
}

// Use Partial<User> for the changes parameter
function updateUser(user: User, changes: any): User {
  // your code here
}`,
    solutionCode: `interface User {
  name: string;
  email: string;
  age: number;
}

function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}`,
    testCases: [
      { description: 'Update name', input: 'return updateUser({ name: "Alice", email: "a@b.com", age: 30 }, { name: "Bob" }).name', expected: 'Bob' },
      { description: 'Original fields preserved', input: 'return updateUser({ name: "Alice", email: "a@b.com", age: 30 }, { age: 31 }).email', expected: 'a@b.com' },
      { description: 'Update multiple fields', input: 'const u = updateUser({ name: "Alice", email: "a@b.com", age: 30 }, { name: "Carol", age: 25 }); return u.name + "," + u.age', expected: 'Carol,25' },
    ],
    xpReward: 22,
    tags: ['utility-types', 'partial', 'generics'],
    tips: [
      'Replace `changes: any` with `changes: Partial<User>` to allow any subset of User fields.',
      'Use object spread to merge — later properties override earlier ones.',
      'Solution: `return { ...user, ...changes };`',
    ],
    published: true,
  },
  {
    title: 'Readonly<T>',
    description: 'Implement `freeze<T>(obj: T): Readonly<T>` that returns the object wrapped with `Object.freeze`. `Readonly<T>` makes all properties non-writable at the type level.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 5,
    starterCode: `// Use Readonly<T> as the return type
function freeze<T>(obj: T): any {
  return Object.freeze(obj);
}`,
    solutionCode: `function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}`,
    testCases: [
      { description: 'Returns same object reference', input: 'const o = { x: 1 }; return freeze(o) === o', expected: 'true' },
      { description: 'Object is frozen', input: 'const o = freeze({ x: 1 }); return Object.isFrozen(o)', expected: 'true' },
      { description: 'Values are preserved', input: 'return freeze({ name: "Alice" }).name', expected: 'Alice' },
    ],
    xpReward: 20,
    tags: ['utility-types', 'readonly', 'generics'],
    tips: [
      'Only the return type annotation needs to change — the body is already correct.',
      'Replace `any` with `Readonly<T>` to match what `Object.freeze` conceptually returns.',
      '`Readonly<T>` is a built-in utility equivalent to `{ readonly [K in keyof T]: T[K] }`.',
    ],
    published: true,
  },
  {
    title: 'Pick and Omit',
    description: 'Implement two functions:\n1. `pickName(user: Pick<User, "name" | "email">): string` — returns `"name <email>"`\n2. `publicUser(user: User): Omit<User, "password">` — returns user without password field\n\n```typescript\ninterface User { name: string; email: string; password: string; }\n```',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 6,
    starterCode: `interface User {
  name: string;
  email: string;
  password: string;
}

// Use Pick and Omit utility types
function pickName(user: Pick<User, 'name' | 'email'>): string {
  // your code here
}

function publicUser(user: User): Omit<User, 'password'> {
  // your code here
}`,
    solutionCode: `interface User {
  name: string;
  email: string;
  password: string;
}

function pickName(user: Pick<User, 'name' | 'email'>): string {
  return user.name + ' <' + user.email + '>';
}

function publicUser(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}`,
    testCases: [
      { description: 'pickName formats correctly', input: 'return pickName({ name: "Alice", email: "alice@example.com" })', expected: 'Alice <alice@example.com>' },
      { description: 'publicUser removes password', input: 'return "password" in publicUser({ name: "Alice", email: "a@b.com", password: "secret" })', expected: 'false' },
      { description: 'publicUser keeps other fields', input: 'return publicUser({ name: "Alice", email: "a@b.com", password: "secret" }).name', expected: 'Alice' },
    ],
    xpReward: 25,
    tags: ['utility-types', 'pick', 'omit'],
    tips: [
      'For `pickName`, just concatenate: `user.name + " <" + user.email + ">"`.',
      'For `publicUser`, use destructuring with rest: `const { password, ...rest } = user;`',
      'Return `rest` — it has all of `user`\'s properties except `password`.',
    ],
    published: true,
  },
  {
    title: 'Record<K,V>',
    description: 'Implement `groupByFirst(words: string[]): Record<string, string[]>` that groups words by their first letter.\n\nExample: `["apple", "ant", "bee"]` → `{ "a": ["apple", "ant"], "b": ["bee"] }`',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 7,
    starterCode: `// Use Record<string, string[]> as return type
function groupByFirst(words: string[]): Record<string, string[]> {
  // your code here
}`,
    solutionCode: `function groupByFirst(words: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const word of words) {
    const key = word[0];
    if (!result[key]) result[key] = [];
    result[key].push(word);
  }
  return result;
}`,
    testCases: [
      { description: 'Groups by first letter', input: 'const r = groupByFirst(["apple","ant","bee"]); return r["a"].join(",")', expected: 'apple,ant' },
      { description: 'Single letter group', input: 'return groupByFirst(["cat"])["c"].length', expected: '1' },
      { description: 'Empty array', input: 'return JSON.stringify(groupByFirst([]))', expected: '{}' },
      { description: 'Multiple groups', input: 'const r = groupByFirst(["x","y","x2"]); return r["x"].length', expected: '2' },
    ],
    xpReward: 25,
    tags: ['record', 'utility-types', 'objects'],
    tips: [
      'Initialize an empty result: `const result: Record<string, string[]> = {};`',
      'For each word, get the first character with `word[0]`, then initialize the array if missing.',
      'Use the pattern: `if (!result[key]) result[key] = []; result[key].push(word);`',
    ],
    published: true,
  },
  {
    title: 'ReturnType and Parameters',
    description: 'Implement `logged<F extends (...args: any[]) => any>(fn: F)` that returns a wrapper function with the same signature as `fn`. The wrapper logs `"calling <name>"` to the console then delegates to the original.\n\nUse `ReturnType<F>` and `Parameters<F>` to preserve types.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 8,
    starterCode: `// Use ReturnType<F> and Parameters<F> to preserve types
function logged<F extends (...args: any[]) => any>(fn: F): (...args: Parameters<F>) => ReturnType<F> {
  // your code here
}`,
    solutionCode: `function logged<F extends (...args: any[]) => any>(fn: F): (...args: Parameters<F>) => ReturnType<F> {
  return (...args: Parameters<F>): ReturnType<F> => {
    console.log('calling ' + fn.name);
    return fn(...args);
  };
}`,
    testCases: [
      { description: 'Returns same value', input: 'function add(a, b) { return a + b; } const loggedAdd = logged(add); return loggedAdd(2, 3)', expected: '5' },
      { description: 'Works with string functions', input: 'function greet(n) { return "Hi " + n; } return logged(greet)("World")', expected: 'Hi World' },
    ],
    xpReward: 28,
    tags: ['utility-types', 'return-type', 'parameters', 'generics'],
    tips: [
      'Return an arrow function with rest parameters: `(...args) => { ... }`',
      'Inside, log first with `console.log("calling " + fn.name);`',
      'Then call the original function with spread args: `return fn(...args);`',
    ],
    published: true,
  },
  {
    title: 'Custom Mapped Types',
    description: 'Implement `Nullable<T>` — a mapped type that makes every property of `T` also accept `null`. For each key `K` in `T`, the type should be `T[K] | null`.\n\nThen use it: the compile guards must pass.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 9,
    starterCode: `// Implement Nullable<T> mapped type
type Nullable<T> = never; // replace with your implementation

// Compile guards (do not remove)
type NullableUser = Nullable<{ name: string; age: number }>;
const _a: NullableUser = { name: null, age: null };
const _b: NullableUser = { name: 'Alice', age: 30 };`,
    solutionCode: `type Nullable<T> = { [K in keyof T]: T[K] | null };

type NullableUser = Nullable<{ name: string; age: number }>;
const _a: NullableUser = { name: null, age: null };
const _b: NullableUser = { name: 'Alice', age: 30 };`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 28,
    tags: ['mapped-types', 'nullable', 'generics'],
    tips: [
      'Mapped types iterate over keys using `[K in keyof T]`.',
      'For each key, transform the value type. Here, allow `T[K]` OR `null`.',
      'Full implementation: `type Nullable<T> = { [K in keyof T]: T[K] | null };`',
    ],
    published: true,
  },
  {
    title: 'Index Signatures',
    description: 'Define a `Dictionary<V>` interface using an index signature `[key: string]: V`. Implement `count(text: string): Dictionary<number>` that returns a map of character frequencies.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 10,
    starterCode: `// Define Dictionary<V> with an index signature
interface Dictionary<V> {
  // your code here
}

function count(text: string): Dictionary<number> {
  // your code here
}`,
    solutionCode: `interface Dictionary<V> {
  [key: string]: V;
}

function count(text: string): Dictionary<number> {
  const result: Dictionary<number> = {};
  for (const ch of text) {
    result[ch] = (result[ch] || 0) + 1;
  }
  return result;
}`,
    testCases: [
      { description: 'Counts characters in "hello"', input: 'const r = count("hello"); return r["l"]', expected: '2' },
      { description: 'Single occurrence', input: 'return count("abc")["a"]', expected: '1' },
      { description: 'Empty string', input: 'return JSON.stringify(count(""))', expected: '{}' },
      { description: 'Multiple same chars', input: 'return count("aaa")["a"]', expected: '3' },
    ],
    xpReward: 25,
    tags: ['index-signatures', 'generics', 'objects'],
    tips: [
      'Index signature syntax: `[key: string]: V;` — allows any string key mapping to type V.',
      'Initialize `const result: Dictionary<number> = {};`',
      'For each character: `result[ch] = (result[ch] || 0) + 1;` — handles missing keys with `|| 0`.',
    ],
    published: true,
  },
  {
    title: 'Function Overloads',
    description: 'Declare two overloads for `parse`:\n- `parse(value: string): number` — parses a string to number\n- `parse(value: number): string` — converts a number to string\n\nThe implementation signature should handle both cases.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 11,
    starterCode: `// Add function overload signatures
function parse(value: string): number;
// add second overload here
function parse(value: any): any {
  if (typeof value === 'string') return parseFloat(value);
  return String(value);
}`,
    solutionCode: `function parse(value: string): number;
function parse(value: number): string;
function parse(value: any): any {
  if (typeof value === 'string') return parseFloat(value);
  return String(value);
}`,
    testCases: [
      { description: 'Parse string to number', input: 'return parse("3.14")', expected: '3.14' },
      { description: 'Parse number to string', input: 'return parse(42)', expected: '42' },
      { description: 'Parse integer string', input: 'return parse("100")', expected: '100' },
    ],
    xpReward: 28,
    tags: ['overloads', 'functions', 'types'],
    tips: [
      'Add the second overload before the implementation: `function parse(value: number): string;`',
      'Overload signatures define the public API — only the implementation runs at runtime.',
      'The implementation already handles both cases correctly using `typeof`.',
    ],
    published: true,
  },
  {
    title: 'keyof and typeof',
    description: 'Implement two generic utilities:\n1. `keys<T extends object>(obj: T): Array<keyof T>` — returns the keys of an object\n2. `pick<T, K extends keyof T>(obj: T, ks: K[]): Pick<T, K>` — picks the specified keys from an object',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 12,
    starterCode: `// Implement keys and pick using keyof
function keys<T extends object>(obj: T): Array<keyof T> {
  // your code here
}

function pick<T, K extends keyof T>(obj: T, ks: K[]): Pick<T, K> {
  // your code here
}`,
    solutionCode: `function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

function pick<T, K extends keyof T>(obj: T, ks: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const k of ks) {
    result[k] = obj[k];
  }
  return result;
}`,
    testCases: [
      { description: 'keys returns all keys', input: 'return keys({ a: 1, b: 2, c: 3 }).sort().join(",")', expected: 'a,b,c' },
      { description: 'pick selects specified keys', input: 'return JSON.stringify(pick({ a: 1, b: 2, c: 3 }, ["a", "c"]))', expected: '{"a":1,"c":3}' },
      { description: 'pick single key', input: 'return pick({ name: "Alice", age: 30 }, ["name"]).name', expected: 'Alice' },
    ],
    xpReward: 28,
    tags: ['keyof', 'typeof', 'generics', 'utility-types'],
    tips: [
      'For `keys`: `Object.keys()` returns `string[]` — cast it: `Object.keys(obj) as Array<keyof T>`.',
      'For `pick`: initialize an empty result with the right type: `const result = {} as Pick<T, K>;`',
      'Loop over `ks` and copy each property: `for (const k of ks) result[k] = obj[k];`',
    ],
    published: true,
  },
  {
    title: 'Required<T>',
    description: 'Implement `assertComplete<T>(partial: Partial<T>, defaults: T): T` that takes a partial object and fills in any missing fields from the defaults.\n\n`Required<T>` is the opposite of `Partial<T>` — it makes all optional properties required.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 13,
    starterCode: `// Use spread to combine defaults with partial overrides
function assertComplete<T>(partial: Partial<T>, defaults: T): T {
  // your code here
}

// Compile guard: verify Required works
type Config = { host?: string; port?: number };
type StrictConfig = Required<Config>;
const _c: StrictConfig = { host: 'localhost', port: 3000 };`,
    solutionCode: `function assertComplete<T>(partial: Partial<T>, defaults: T): T {
  return { ...defaults, ...partial };
}

type Config = { host?: string; port?: number };
type StrictConfig = Required<Config>;
const _c: StrictConfig = { host: 'localhost', port: 3000 };`,
    testCases: [
      { description: 'Fills missing fields', input: 'return assertComplete({ host: "x" }, { host: "default", port: 80 }).port', expected: '80' },
      { description: 'Partial overrides defaults', input: 'return assertComplete({ host: "custom" }, { host: "default", port: 80 }).host', expected: 'custom' },
      { description: 'Empty partial uses all defaults', input: 'return JSON.stringify(assertComplete({}, { a: 1, b: 2 }))', expected: '{"a":1,"b":2}' },
    ],
    xpReward: 25,
    tags: ['required', 'partial', 'utility-types', 'intermediate'],
    tips: [
      '`Required<T>` makes every optional property mandatory — the inverse of `Partial<T>`.',
      'Merge defaults with the partial using spread: `{ ...defaults, ...partial }`.',
      'Defaults come first so partial values override them, ensuring all keys are present.',
    ],
    published: true,
  },
  {
    title: 'Generic Queue',
    description: 'Implement a `Queue<T>` class (FIFO: First In, First Out) with:\n- `enqueue(item: T): void` — add to the back\n- `dequeue(): T | undefined` — remove and return the front item\n- `peek(): T | undefined` — return front without removing\n- `size: number` getter',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 14,
    starterCode: `// Implement a generic Queue<T> (FIFO)
class Queue<T> {
  // your code here
}`,
    solutionCode: `class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }
}`,
    testCases: [
      { description: 'FIFO order', input: 'const q = new Queue(); q.enqueue(1); q.enqueue(2); return q.dequeue()', expected: '1' },
      { description: 'Peek does not remove', input: 'const q = new Queue(); q.enqueue("a"); q.peek(); return q.size', expected: '1' },
      { description: 'Dequeue empty returns undefined', input: 'const q = new Queue(); return String(q.dequeue())', expected: 'undefined' },
      { description: 'Size tracks items', input: 'const q = new Queue(); q.enqueue(1); q.enqueue(2); q.dequeue(); return q.size', expected: '1' },
    ],
    xpReward: 25,
    tags: ['generics', 'classes', 'data-structures', 'queue'],
    tips: [
      'A queue is FIFO (first in, first out) — the opposite of a stack.',
      'Use `Array.prototype.push` to enqueue (add to back) and `Array.prototype.shift` to dequeue (remove from front).',
      '`peek` returns `this.items[0]` (the front), and `size` is a getter for `this.items.length`.',
    ],
    published: true,
  },
  {
    title: 'Awaited<T>',
    description: 'Use the built-in `Awaited<T>` utility to extract the resolved type from a Promise. Implement `unwrap<T>(p: Promise<T>): Promise<Awaited<T>>` that returns a promise of the resolved value.\n\nAlso implement `chainAll<T>(promises: Promise<T>[]): Promise<T[]>` that resolves all promises in order.',
    difficulty: 'INTERMEDIATE',
    track: 'intermediate',
    order: 15,
    starterCode: `// Use Awaited<T> to unwrap nested promise types
async function unwrap<T>(p: Promise<T>): Promise<Awaited<T>> {
  // your code here
}

async function chainAll<T>(promises: Promise<T>[]): Promise<T[]> {
  // your code here
}`,
    solutionCode: `async function unwrap<T>(p: Promise<T>): Promise<Awaited<T>> {
  return await p;
}

async function chainAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return Promise.all(promises);
}`,
    testCases: [
      { description: 'unwrap resolves the value', input: 'return unwrap(Promise.resolve(42)).then(v => v)', expected: '42' },
      { description: 'unwrap with string', input: 'return unwrap(Promise.resolve("hello")).then(v => v)', expected: 'hello' },
      { description: 'chainAll resolves all', input: 'return chainAll([Promise.resolve(1), Promise.resolve(2)]).then(arr => arr.join(","))', expected: '1,2' },
      { description: 'chainAll with empty array', input: 'return chainAll([]).then(arr => arr.length)', expected: '0' },
    ],
    xpReward: 28,
    tags: ['awaited', 'promises', 'async', 'intermediate'],
    tips: [
      '`Awaited<T>` recursively unwraps nested Promise types — `Awaited<Promise<Promise<string>>>` is `string`.',
      'For `unwrap`, simply `await` the promise inside the async function — the type annotation does the rest.',
      'For `chainAll`, use the built-in `Promise.all(promises)` which returns `Promise<T[]>`.',
    ],
    published: true,
  },

  // ─────────────────────────────────────────────────────────────────
  // ADVANCED TRACK (12 challenges)
  // ─────────────────────────────────────────────────────────────────
  {
    title: 'Conditional Types',
    description: 'Implement `IsArray<T>` — a conditional type that resolves to `true` if `T` is an array, and `false` otherwise.\n\nThen implement `isArray(val: unknown): boolean` at runtime using `Array.isArray`.\n\nThe compile guards must pass.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 1,
    starterCode: `// Implement IsArray<T> conditional type
type IsArray<T> = never; // replace with your implementation

// Compile guards (do not remove)
const _a: IsArray<string[]> = true;
const _b: IsArray<number> = false;

// Runtime function
function isArray(val: unknown): boolean {
  // your code here
}`,
    solutionCode: `type IsArray<T> = T extends any[] ? true : false;

const _a: IsArray<string[]> = true;
const _b: IsArray<number> = false;

function isArray(val: unknown): boolean {
  return Array.isArray(val);
}`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
      { description: 'Array returns true', input: 'return isArray([1,2,3])', expected: 'true' },
      { description: 'Non-array returns false', input: 'return isArray("hello")', expected: 'false' },
      { description: 'Empty array returns true', input: 'return isArray([])', expected: 'true' },
    ],
    xpReward: 40,
    tags: ['conditional-types', 'generics', 'advanced'],
    tips: [
      'Conditional types follow the pattern: `T extends SomeType ? TrueType : FalseType`.',
      'To check if T is any array, use `T extends any[] ? true : false`.',
      'The runtime function just uses `Array.isArray(val)`.',
    ],
    published: true,
  },
  {
    title: 'The infer Keyword',
    description: 'Implement `UnpackPromise<T>` — a conditional type that extracts the resolved type from a `Promise<T>`. If `T` is not a `Promise`, it should return `T` unchanged.\n\nUse `infer R` inside the conditional type to capture the inner type.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 2,
    starterCode: `// Use infer to extract the inner type of a Promise
type UnpackPromise<T> = never; // replace with your implementation

// Compile guards (do not remove)
type A = UnpackPromise<Promise<string>>;
const _a: A = 'hello';

type B = UnpackPromise<number>;
const _b: B = 42;`,
    solutionCode: `type UnpackPromise<T> = T extends Promise<infer R> ? R : T;

type A = UnpackPromise<Promise<string>>;
const _a: A = 'hello';

type B = UnpackPromise<number>;
const _b: B = 42;`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 45,
    tags: ['infer', 'conditional-types', 'promises', 'advanced'],
    tips: [
      '`infer` is only valid inside the extends clause of a conditional type.',
      'Pattern: `T extends Promise<infer R> ? R : T` — captures R as the type inside the Promise.',
      'If T isn\'t a Promise, fall through to `T` (unchanged).',
    ],
    published: true,
  },
  {
    title: 'Template Literal Types',
    description: 'Define `EventName<T extends string>` as a template literal type that prepends `"on"` and capitalizes `T`. For example: `EventName<"click">` → `"onClick"`, `EventName<"change">` → `"onChange"`.\n\nUse `Capitalize<T>` built-in utility.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 3,
    starterCode: `// Define EventName using template literal types
type EventName<T extends string> = never; // replace with your implementation

// Compile guards (do not remove)
const _click: EventName<'click'> = 'onClick';
const _change: EventName<'change'> = 'onChange';`,
    solutionCode: `type EventName<T extends string> = \`on\${Capitalize<T>}\`;

const _click: EventName<'click'> = 'onClick';
const _change: EventName<'change'> = 'onChange';`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 45,
    tags: ['template-literal-types', 'capitalize', 'advanced'],
    tips: [
      'Template literal types use backticks at the type level: `` `prefix${T}suffix` ``',
      '`Capitalize<T>` is a built-in intrinsic that uppercases the first letter of a string type.',
      'Solution: `` type EventName<T extends string> = `on${Capitalize<T>}`; ``',
    ],
    published: true,
  },
  {
    title: 'DeepReadonly',
    description: 'Implement `DeepReadonly<T>` — a recursive mapped type that makes all properties (including nested objects) `readonly`.\n\nFor each key `K` in `T`: if `T[K]` extends `object`, recurse; otherwise make it `readonly T[K]`.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 4,
    starterCode: `// Implement DeepReadonly recursively
type DeepReadonly<T> = never; // replace with your implementation

// Compile guards (do not remove)
type Config = { server: { host: string; port: number }; debug: boolean };
type RConfig = DeepReadonly<Config>;
const _cfg: RConfig = { server: { host: 'localhost', port: 3000 }, debug: false };`,
    solutionCode: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Config = { server: { host: string; port: number }; debug: boolean };
type RConfig = DeepReadonly<Config>;
const _cfg: RConfig = { server: { host: 'localhost', port: 3000 }, debug: false };`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
      { description: 'Runtime value preserved', input: 'const c = { server: { host: "localhost", port: 3000 }, debug: false }; return c.server.host', expected: 'localhost' },
    ],
    xpReward: 50,
    tags: ['mapped-types', 'recursive', 'readonly', 'advanced'],
    tips: [
      'Start with the shape of `Readonly<T>`: `{ readonly [K in keyof T]: T[K] }`.',
      'Add recursion via a conditional check: `T[K] extends object ? DeepReadonly<T[K]> : T[K]`.',
      'Recursive types reference themselves by name — TypeScript handles the recursion lazily.',
    ],
    published: true,
  },
  {
    title: 'Distributive Conditional Types',
    description: 'Implement `Flatten<T>` — a distributive conditional type that strips one level of array wrapping from a union.\n\n`Flatten<string[] | number[]>` should resolve to `string | number`.\n\nConditional types distribute automatically over unions when the checked type is a naked type parameter.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 5,
    starterCode: `// Implement Flatten<T> distributing over unions
type Flatten<T> = never; // replace with your implementation

// Compile guards (do not remove)
type A = Flatten<string[]>;
const _a: A = 'hello';

type B = Flatten<number[]>;
const _b: B = 42;

type C = Flatten<string[] | number[]>;
const _c1: C = 'world';
const _c2: C = 99;`,
    solutionCode: `type Flatten<T> = T extends (infer U)[] ? U : T;

type A = Flatten<string[]>;
const _a: A = 'hello';

type B = Flatten<number[]>;
const _b: B = 42;

type C = Flatten<string[] | number[]>;
const _c1: C = 'world';
const _c2: C = 99;`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 50,
    tags: ['conditional-types', 'distributive', 'infer', 'advanced'],
    tips: [
      'Combine conditional types with `infer`: `T extends (infer U)[] ? U : T`.',
      'When T is a naked type parameter in a union, the conditional distributes: `Flatten<A | B> = Flatten<A> | Flatten<B>`.',
      'So `Flatten<string[] | number[]>` becomes `string | number` automatically.',
    ],
    published: true,
  },
  {
    title: 'Exclude and Extract',
    description: 'Implement `MyExclude<T, U>` and `MyExtract<T, U>` from scratch using conditional types (do not use the built-in versions).\n\n- `MyExclude<T, U>`: removes from `T` all types assignable to `U`\n- `MyExtract<T, U>`: keeps only types from `T` that are assignable to `U`',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 6,
    starterCode: `// Implement MyExclude and MyExtract from scratch
type MyExclude<T, U> = never; // replace with your implementation
type MyExtract<T, U> = never; // replace with your implementation

// Compile guards (do not remove)
type E1 = MyExclude<'a' | 'b' | 'c', 'a'>;
const _e1: E1 = 'b';

type X1 = MyExtract<'a' | 'b' | 'c', 'a' | 'b'>;
const _x1: X1 = 'a';
const _x2: X1 = 'b';`,
    solutionCode: `type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type E1 = MyExclude<'a' | 'b' | 'c', 'a'>;
const _e1: E1 = 'b';

type X1 = MyExtract<'a' | 'b' | 'c', 'a' | 'b'>;
const _x1: X1 = 'a';
const _x2: X1 = 'b';`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 50,
    tags: ['conditional-types', 'exclude', 'extract', 'advanced'],
    tips: [
      'Conditional types distribute over union type parameters automatically.',
      '`MyExclude<T, U> = T extends U ? never : T` — `never` is removed from unions, effectively excluding matches.',
      '`MyExtract<T, U> = T extends U ? T : never` — keeps only types assignable to U.',
    ],
    published: true,
  },
  {
    title: 'NonNullable',
    description: 'Implement `MyNonNullable<T>` that removes `null` and `undefined` from a type. Then use it to implement `compact<T>(arr: (T | null | undefined)[]): T[]` that filters out nullish values.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 7,
    starterCode: `// Implement MyNonNullable and compact
type MyNonNullable<T> = never; // replace with your implementation

function compact<T>(arr: (T | null | undefined)[]): T[] {
  // your code here
}`,
    solutionCode: `type MyNonNullable<T> = T extends null | undefined ? never : T;

function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((x): x is T => x !== null && x !== undefined);
}`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
      { description: 'Removes null and undefined', input: 'return JSON.stringify(compact([1, null, 2, undefined, 3]))', expected: '[1,2,3]' },
      { description: 'All values present', input: 'return JSON.stringify(compact(["a","b","c"]))', expected: '["a","b","c"]' },
      { description: 'All nullish', input: 'return JSON.stringify(compact([null, undefined, null]))', expected: '[]' },
    ],
    xpReward: 45,
    tags: ['nonnullable', 'conditional-types', 'filtering', 'advanced'],
    tips: [
      '`MyNonNullable<T> = T extends null | undefined ? never : T` — removes both nullish types via distribution.',
      'For `compact`, use `.filter()` with a type predicate: `(x): x is T => x !== null && x !== undefined`.',
      'The `is T` predicate narrows the result type so TypeScript knows the array is `T[]` (no nullish).',
    ],
    published: true,
  },
  {
    title: 'Discriminated Unions',
    description: 'Define a `Shape` discriminated union with a `kind` discriminant:\n- `{ kind: "circle"; radius: number }`\n- `{ kind: "rectangle"; width: number; height: number }`\n- `{ kind: "triangle"; base: number; height: number }`\n\nImplement `area(shape: Shape): number`. Use an exhaustive switch with a `never` check.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 8,
    starterCode: `// Define Shape discriminated union and implement area
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  // use a switch on shape.kind
  // add a default: that assigns to never for exhaustiveness
}`,
    solutionCode: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return 0.5 * shape.base * shape.height;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}`,
    testCases: [
      { description: 'Circle area', input: 'return area({ kind: "circle", radius: 1 }).toFixed(4)', expected: '3.1416' },
      { description: 'Rectangle area', input: 'return area({ kind: "rectangle", width: 4, height: 5 })', expected: '20' },
      { description: 'Triangle area', input: 'return area({ kind: "triangle", base: 6, height: 4 })', expected: '12' },
    ],
    xpReward: 55,
    tags: ['discriminated-unions', 'exhaustive', 'switch', 'advanced'],
    tips: [
      'Switch on `shape.kind` — TypeScript narrows the type in each case automatically.',
      'Areas: circle = `Math.PI * shape.radius ** 2`, rectangle = `shape.width * shape.height`, triangle = `0.5 * shape.base * shape.height`.',
      'Add `default: { const _e: never = shape; return _e; }` to enforce exhaustiveness at compile time.',
    ],
    published: true,
  },
  {
    title: 'Satisfies Operator',
    description: 'Use the `satisfies` operator to type-check a palette configuration object. Define a `Palette` type where keys are color names and values are either `string` (hex) or `[number, number, number]` (RGB tuple). Use `satisfies Palette` so TypeScript validates the shape while preserving the exact literal types.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 9,
    starterCode: `// Use satisfies to type-check the palette config
type Palette = Record<string, string | [number, number, number]>;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
};
// Add "satisfies Palette" here

// Compile guard: accessing a tuple method is safe because satisfies preserves literal type
const _redGreen: number = palette.red[1];`,
    solutionCode: `type Palette = Record<string, string | [number, number, number]>;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Palette;

const _redGreen: number = palette.red[1];`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
      { description: 'Red channel value', input: 'return palette.red[0]', expected: '255' },
      { description: 'Green hex value', input: 'return palette.green', expected: '#00ff00' },
    ],
    xpReward: 45,
    tags: ['satisfies', 'record', 'advanced'],
    tips: [
      'Add `satisfies Palette` directly after the closing `}` of the object literal.',
      'Unlike `as Palette`, `satisfies` validates without widening the inferred type — literal types are preserved.',
      'This is why `palette.red[1]` is allowed: TypeScript still knows `red` is `[number, number, number]`, not `string | tuple`.',
    ],
    published: true,
  },
  {
    title: 'DeepPartial',
    description: 'Implement `DeepPartial<T>` — a recursive utility type that makes all properties (including nested objects) optional.\n\nFor each key `K` in `T`: if `T[K]` extends `object`, apply `DeepPartial` recursively; otherwise make it optional.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 10,
    starterCode: `// Implement DeepPartial<T> recursively
type DeepPartial<T> = never; // replace with your implementation

// Compile guards (do not remove)
type Config = { db: { host: string; port: number }; debug: boolean };
type PartialConfig = DeepPartial<Config>;
const _a: PartialConfig = {};
const _b: PartialConfig = { db: {} };
const _c: PartialConfig = { db: { host: 'localhost' } };`,
    solutionCode: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Config = { db: { host: string; port: number }; debug: boolean };
type PartialConfig = DeepPartial<Config>;
const _a: PartialConfig = {};
const _b: PartialConfig = { db: {} };
const _c: PartialConfig = { db: { host: 'localhost' } };`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 60,
    tags: ['mapped-types', 'recursive', 'partial', 'advanced'],
    tips: [
      'Very similar to `DeepReadonly` — use `?` instead of `readonly` to make properties optional.',
      'Recurse when the value is an object: `T[K] extends object ? DeepPartial<T[K]> : T[K]`.',
      'Full type: `type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]; };`',
    ],
    published: true,
  },
  {
    title: 'String Intrinsic Manipulation',
    description: 'Use the built-in string manipulation types `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, and `Uncapitalize<T>`.\n\nImplement `CSSVar<T extends string>` that produces a CSS custom property by prefixing `"--"` and lowercasing the first character. For example, `CSSVar<"Color">` → `"--color"`.\n\nAlso define `Greeting<Name extends string>` that produces `` `Hello, ${Capitalize<Name>}!` ``',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 11,
    starterCode: `// Use built-in string manipulation intrinsic types
type CSSVar<T extends string> = never; // "--" + Uncapitalize<T>
type Greeting<Name extends string> = never;

// Compile guards (do not remove)
const _v: CSSVar<'Color'> = '--color';
const _g: Greeting<'alice'> = 'Hello, Alice!';`,
    solutionCode: `type CSSVar<T extends string> = \`--\${Uncapitalize<T>}\`;
type Greeting<Name extends string> = \`Hello, \${Capitalize<Name>}!\`;

const _v: CSSVar<'Color'> = '--color';
const _g: Greeting<'alice'> = 'Hello, Alice!';`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 50,
    tags: ['template-literal-types', 'string-manipulation', 'advanced'],
    tips: [
      'TypeScript ships four intrinsic string types: `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, `Uncapitalize<T>`.',
      'Combine them with template literals using backticks at the type level.',
      'For `CSSVar`: `` `--${Uncapitalize<T>}` ``. For `Greeting`: `` `Hello, ${Capitalize<Name>}!` ``',
    ],
    published: true,
  },
  {
    title: 'Tuple Length',
    description: 'Implement `Length<T extends readonly any[]>` that resolves to the literal length of a tuple type.\n\nFor `["a", "b", "c"]`, the length should be `3` as a literal type.\n\nHint: tuple types have a `length` property whose type is the literal length.',
    difficulty: 'ADVANCED',
    track: 'advanced',
    order: 12,
    starterCode: `// Implement Length<T> for tuple types
type Length<T extends readonly any[]> = never; // replace with your implementation

// Compile guards (do not remove)
const _l3: Length<['a', 'b', 'c']> = 3;
const _l0: Length<[]> = 0;
const _l1: Length<[number]> = 1;`,
    solutionCode: `type Length<T extends readonly any[]> = T['length'];

const _l3: Length<['a', 'b', 'c']> = 3;
const _l0: Length<[]> = 0;
const _l1: Length<[number]> = 1;`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 55,
    tags: ['tuples', 'indexed-access', 'advanced'],
    tips: [
      'Tuple types have a `length` property whose value is the literal number.',
      'Use indexed access: `T["length"]` gives you the literal length type.',
      'Solution: `type Length<T extends readonly any[]> = T["length"];`',
    ],
    published: true,
  },

  // ─────────────────────────────────────────────────────────────────
  // EXPERT TRACK (9 challenges)
  // ─────────────────────────────────────────────────────────────────
  {
    title: 'Branded Types',
    description: 'Implement `Brand<T, B>` — a type that creates a unique branded type from base type `T` and brand tag `B`. Use it to define `UserId` and `ProductId` as branded strings so they cannot be confused.\n\nImplement `createUserId(s: string): UserId` and `createProductId(s: string): ProductId` as casting helpers.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 1,
    starterCode: `// Implement Brand<T, B> and create UserId / ProductId
type Brand<T, B> = never; // replace with your implementation

type UserId = Brand<string, 'UserId'>;
type ProductId = Brand<string, 'ProductId'>;

function createUserId(s: string): UserId {
  // your code here
}

function createProductId(s: string): ProductId {
  // your code here
}`,
    solutionCode: `type Brand<T, B> = T & { readonly __brand: B };

type UserId = Brand<string, 'UserId'>;
type ProductId = Brand<string, 'ProductId'>;

function createUserId(s: string): UserId {
  return s as UserId;
}

function createProductId(s: string): ProductId {
  return s as ProductId;
}`,
    testCases: [
      { description: 'UserId is a string at runtime', input: 'return typeof createUserId("u-123")', expected: 'string' },
      { description: 'ProductId value preserved', input: 'return createProductId("p-456")', expected: 'p-456' },
      { description: 'UserId value preserved', input: 'return createUserId("u-789")', expected: 'u-789' },
    ],
    xpReward: 75,
    tags: ['branded-types', 'type-safety', 'expert'],
    tips: [
      '`Brand<T, B>` intersects T with a unique tag: `T & { readonly __brand: B }`.',
      'The `__brand` property exists only at the type level — it has no runtime cost.',
      'Use a cast to construct branded values: `return s as UserId;`',
    ],
    published: true,
  },
  {
    title: 'Template Literal + Infer',
    description: 'Implement `StripPx<S extends string>` — a conditional type that uses `infer` with a template literal pattern to extract the number part from a `"${number}px"` string type.\n\n`StripPx<"42px">` → `"42"`, `StripPx<"100px">` → `"100"`, non-matching → `never`.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 2,
    starterCode: `// Use template literal + infer to extract the number part
type StripPx<S extends string> = never; // replace with your implementation

// Compile guards (do not remove)
type A = StripPx<'42px'>;
const _a: A = '42';

type B = StripPx<'100px'>;
const _b: B = '100';`,
    solutionCode: `type StripPx<S extends string> = S extends \`\${infer N}px\` ? N : never;

type A = StripPx<'42px'>;
const _a: A = '42';

type B = StripPx<'100px'>;
const _b: B = '100';`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 80,
    tags: ['template-literal-types', 'infer', 'expert'],
    tips: [
      'You can place `infer` inside template literal patterns in conditional types.',
      'Pattern: `` S extends `${infer N}px` ? N : never `` — captures everything before "px" as N.',
      'Strings that don\'t end in "px" fail the extends check and fall through to `never`.',
    ],
    published: true,
  },
  {
    title: 'Variadic Tuple Types',
    description: 'Implement `concat<A extends any[], B extends any[]>(a: A, b: B): [...A, ...B]` using variadic tuple types and the spread operator. The return type should be the exact concatenation of the two tuple types.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 3,
    starterCode: `// Use variadic tuples [...A, ...B] as the return type
function concat<A extends any[], B extends any[]>(a: A, b: B): [...A, ...B] {
  // your code here
}`,
    solutionCode: `function concat<A extends any[], B extends any[]>(a: A, b: B): [...A, ...B] {
  return [...a, ...b] as [...A, ...B];
}`,
    testCases: [
      { description: 'Concatenates two arrays', input: 'return JSON.stringify(concat([1, 2], [3, 4]))', expected: '[1,2,3,4]' },
      { description: 'Concatenates mixed types', input: 'return JSON.stringify(concat(["a", "b"], [1, 2]))', expected: '["a","b",1,2]' },
      { description: 'Concatenates with empty', input: 'return JSON.stringify(concat([], [1, 2, 3]))', expected: '[1,2,3]' },
    ],
    xpReward: 80,
    tags: ['variadic-tuples', 'generics', 'expert'],
    tips: [
      'Variadic tuple spread `[...A, ...B]` works in both value and type positions.',
      'The runtime is just `[...a, ...b]` — spread two arrays.',
      'TypeScript can\'t infer the variadic return, so add a cast: `as [...A, ...B]`.',
    ],
    published: true,
  },
  {
    title: 'Type-Safe Builder Pattern',
    description: 'Implement a `Builder<T>` class with:\n- `set<K extends keyof T>(key: K, value: T[K]): this` — sets a property\n- `build(): T` — returns the completed object\n\nThe builder accumulates key-value pairs and returns a fully typed `T` on `.build()`.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 4,
    starterCode: `// Implement a type-safe Builder<T> class
class Builder<T extends object> {
  // your code here
}`,
    solutionCode: `class Builder<T extends object> {
  private data: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  build(): T {
    return this.data as T;
  }
}`,
    testCases: [
      { description: 'Builds object with set values', input: 'const b = new Builder(); b.set("name", "Alice"); b.set("age", 30); const r = b.build(); return r.name', expected: 'Alice' },
      { description: 'Chaining works', input: 'const r = new Builder().set("x", 10).set("y", 20).build(); return r.x + r.y', expected: '30' },
      { description: 'Build returns all set keys', input: 'const r = new Builder().set("a", 1).set("b", 2).build(); return JSON.stringify(r)', expected: '{"a":1,"b":2}' },
    ],
    xpReward: 85,
    tags: ['builder-pattern', 'generics', 'classes', 'expert'],
    tips: [
      'Store accumulated data as `private data: Partial<T> = {};`',
      'The `set` method uses `K extends keyof T` for type safety, and returns `this` to enable chaining.',
      '`build()` casts to `T`: `return this.data as T;`',
    ],
    published: true,
  },
  {
    title: 'Custom Type Guards',
    description: 'Implement type predicates:\n- `isString(val: unknown): val is string`\n- `isNumber(val: unknown): val is number`\n\nThen implement `filterStrings(arr: unknown[]): string[]` and `filterNumbers(arr: unknown[]): number[]` using these guards with `.filter()`.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 5,
    starterCode: `// Implement type predicates and filter functions
function isString(val: unknown): val is string {
  // your code here
}

function isNumber(val: unknown): val is number {
  // your code here
}

function filterStrings(arr: unknown[]): string[] {
  // your code here
}

function filterNumbers(arr: unknown[]): number[] {
  // your code here
}`,
    solutionCode: `function isString(val: unknown): val is string {
  return typeof val === 'string';
}

function isNumber(val: unknown): val is number {
  return typeof val === 'number';
}

function filterStrings(arr: unknown[]): string[] {
  return arr.filter(isString);
}

function filterNumbers(arr: unknown[]): number[] {
  return arr.filter(isNumber);
}`,
    testCases: [
      { description: 'isString identifies strings', input: 'return isString("hello")', expected: 'true' },
      { description: 'isString rejects numbers', input: 'return isString(42)', expected: 'false' },
      { description: 'filterStrings extracts strings', input: 'return JSON.stringify(filterStrings([1, "a", true, "b", null]))', expected: '["a","b"]' },
      { description: 'filterNumbers extracts numbers', input: 'return JSON.stringify(filterNumbers([1, "a", 2, true, 3]))', expected: '[1,2,3]' },
    ],
    xpReward: 75,
    tags: ['type-guards', 'predicates', 'narrowing', 'expert'],
    tips: [
      'A type predicate has the return type `val is Type` — TypeScript uses this to narrow types after the function returns true.',
      'The implementation uses `typeof val === "string"` and `typeof val === "number"`.',
      'Pass the type guard directly to `.filter()`: `arr.filter(isString)` — TypeScript infers the narrowed return type.',
    ],
    published: true,
  },
  {
    title: 'Const Assertions',
    description: 'Define a `config` object with string values using `as const`. Then define `ConfigValue` as `typeof config[keyof typeof config]` — a literal union of all the config values.\n\nImplement `isValidConfig(v: string): boolean` that checks if `v` is one of the config values.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 6,
    starterCode: `// Use as const to preserve literal types
const config = {
  env: 'production',
  region: 'us-east-1',
  tier: 'premium',
}; // add as const here

type ConfigValue = string; // replace: typeof config[keyof typeof config]

// Compile guard (do not remove)
const _v: ConfigValue = 'production';

function isValidConfig(v: string): boolean {
  // your code here
}`,
    solutionCode: `const config = {
  env: 'production',
  region: 'us-east-1',
  tier: 'premium',
} as const;

type ConfigValue = typeof config[keyof typeof config];

const _v: ConfigValue = 'production';

function isValidConfig(v: string): boolean {
  return Object.values(config).includes(v as ConfigValue);
}`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
      { description: 'Valid config value', input: 'return isValidConfig("production")', expected: 'true' },
      { description: 'Invalid config value', input: 'return isValidConfig("staging")', expected: 'false' },
      { description: 'Another valid value', input: 'return isValidConfig("us-east-1")', expected: 'true' },
    ],
    xpReward: 80,
    tags: ['const-assertions', 'literal-types', 'keyof', 'expert'],
    tips: [
      'Add `as const` immediately after the closing `}` of the object literal — this preserves literal types.',
      '`typeof config` gives the object\'s type; `keyof typeof config` gives the union of keys.',
      'Indexed access: `typeof config[keyof typeof config]` gives the union of all value types.',
    ],
    published: true,
  },
  {
    title: 'Higher-Order Type Utilities',
    description: 'Implement:\n- `Mutable<T>` — removes `readonly` from all properties of `T`\n- `DeepMutable<T>` — recursively removes `readonly` from all nested properties\n\nUse `-readonly` mapping modifier.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 7,
    starterCode: `// Implement Mutable and DeepMutable
type Mutable<T> = never; // replace with your implementation
type DeepMutable<T> = never; // replace with your implementation

// Compile guards (do not remove)
type ReadonlyPoint = { readonly x: number; readonly y: number };
type MutablePoint = Mutable<ReadonlyPoint>;
const _p: MutablePoint = { x: 1, y: 2 };
_p.x = 10; // should compile

type Nested = { readonly a: { readonly b: number } };
type MutableNested = DeepMutable<Nested>;
const _n: MutableNested = { a: { b: 1 } };
_n.a.b = 99; // should compile`,
    solutionCode: `type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type DeepMutable<T> = { -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K] };

type ReadonlyPoint = { readonly x: number; readonly y: number };
type MutablePoint = Mutable<ReadonlyPoint>;
const _p: MutablePoint = { x: 1, y: 2 };
_p.x = 10;

type Nested = { readonly a: { readonly b: number } };
type MutableNested = DeepMutable<Nested>;
const _n: MutableNested = { a: { b: 1 } };
_n.a.b = 99;`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
    ],
    xpReward: 90,
    tags: ['mapped-types', 'mutable', 'readonly', 'recursive', 'expert'],
    tips: [
      'Use the `-readonly` modifier to strip readonly: `{ -readonly [K in keyof T]: T[K] }`.',
      'The `-` prefix on modifiers means "remove" — so `-readonly` removes readonly, and `-?` removes optional.',
      '`DeepMutable` adds recursion: `T[K] extends object ? DeepMutable<T[K]> : T[K]`.',
    ],
    published: true,
  },
  {
    title: 'Type-Level State Machine',
    description: 'Define a `Transition<State extends string, Event extends string, Next extends string>` type and a `StateMachine` that maps valid transitions. The type system should prevent invalid transitions at compile time.\n\nDefine an `OrderMachine` for states `Draft → Placed → Shipped → Delivered`.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 8,
    starterCode: `// Define Transition and a type-safe state machine
type Transition<State extends string, Event extends string, Next extends string> = {
  from: State;
  event: Event;
  to: Next;
};

// Define your OrderMachine transitions here
type OrderTransition = never; // replace with your implementation

// Compile guard: these valid transitions must compile
type T1 = Transition<'Draft', 'place', 'Placed'>;
const _t1: OrderTransition = { from: 'Draft', event: 'place', to: 'Placed' };`,
    solutionCode: `type Transition<State extends string, Event extends string, Next extends string> = {
  from: State;
  event: Event;
  to: Next;
};

type OrderTransition =
  | Transition<'Draft', 'place', 'Placed'>
  | Transition<'Placed', 'ship', 'Shipped'>
  | Transition<'Shipped', 'deliver', 'Delivered'>;

type T1 = Transition<'Draft', 'place', 'Placed'>;
const _t1: OrderTransition = { from: 'Draft', event: 'place', to: 'Placed' };`,
    testCases: [
      { description: 'Type compiles without errors', input: '', expected: 'ok' },
      { description: 'Valid transition object shape', input: 'const t = { from: "Draft", event: "place", to: "Placed" }; return t.from + "->" + t.to', expected: 'Draft->Placed' },
    ],
    xpReward: 100,
    tags: ['state-machine', 'conditional-types', 'literal-types', 'expert'],
    tips: [
      '`OrderTransition` is a union of specific `Transition<...>` types — one variant per valid edge.',
      'Combine with `|`: each variant is a fully-specified transition tuple.',
      'Build the chain: `Transition<"Draft", "place", "Placed"> | Transition<"Placed", "ship", "Shipped"> | Transition<"Shipped", "deliver", "Delivered">`',
    ],
    published: true,
  },
  {
    title: 'Phantom Type Parameters',
    description: 'Implement phantom-typed `Distance` values that track the unit at the type level only.\n\nGiven `type Distance<U extends "m" | "km"> = number & { readonly __unit?: U }`, implement:\n- `meters(n: number): Distance<"m">`\n- `kilometers(n: number): Distance<"km">`\n- `addMeters(a: Distance<"m">, b: Distance<"m">): Distance<"m">`\n\nThe key idea: TypeScript prevents mixing units at compile time, but at runtime each value is just a `number`.',
    difficulty: 'EXPERT',
    track: 'expert',
    order: 9,
    starterCode: `// Implement phantom-typed distance values
type Distance<U extends 'm' | 'km'> = number & { readonly __unit?: U };

function meters(n: number): Distance<'m'> {
  // your code here
}

function kilometers(n: number): Distance<'km'> {
  // your code here
}

function addMeters(a: Distance<'m'>, b: Distance<'m'>): Distance<'m'> {
  // your code here
}`,
    solutionCode: `type Distance<U extends 'm' | 'km'> = number & { readonly __unit?: U };

function meters(n: number): Distance<'m'> {
  return n as Distance<'m'>;
}

function kilometers(n: number): Distance<'km'> {
  return n as Distance<'km'>;
}

function addMeters(a: Distance<'m'>, b: Distance<'m'>): Distance<'m'> {
  return (a + b) as Distance<'m'>;
}`,
    testCases: [
      { description: 'meters returns the number', input: 'return meters(5)', expected: '5' },
      { description: 'kilometers returns the number', input: 'return kilometers(10)', expected: '10' },
      { description: 'addMeters sums correctly', input: 'return addMeters(meters(3), meters(4))', expected: '7' },
      { description: 'Runtime is just number', input: 'return typeof meters(1)', expected: 'number' },
    ],
    xpReward: 95,
    tags: ['phantom-types', 'branded-types', 'units', 'expert'],
    tips: [
      'Phantom types attach a compile-time tag without runtime overhead — the `__unit` field is optional and never assigned.',
      'Cast plain numbers to the branded type: `return n as Distance<"m">;`',
      'For `addMeters`: the sum is a plain number, so cast: `return (a + b) as Distance<"m">;`',
    ],
    published: true,
  },

  // ─────────────────────────────────────────────────────────────────
  // ENTERPRISE TRACK (8 challenges)
  // ─────────────────────────────────────────────────────────────────
  {
    title: 'Module Augmentation',
    description: 'Augment the global `Array` interface to declare a `groupBy<K extends string>(fn: (item: T) => K): Record<K, T[]>` method. Then implement it on `Array.prototype`.\n\nThis pattern is used in enterprise codebases to extend built-in types with utility methods.',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 1,
    starterCode: `// Augment Array interface and implement groupBy on Array.prototype
declare global {
  interface Array<T> {
    // declare groupBy here
  }
}

// Implement Array.prototype.groupBy
(Array.prototype as any).groupBy = function() {
  // your code here
};`,
    solutionCode: `declare global {
  interface Array<T> {
    groupBy<K extends string>(fn: (item: T) => K): Record<K, T[]>;
  }
}

(Array.prototype as any).groupBy = function<T, K extends string>(fn: (item: T) => K): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of this as T[]) {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
};`,
    testCases: [
      { description: 'Groups by first letter', input: 'const r = ["apple","ant","bee"].groupBy(w => w[0]); return r["a"].join(",")', expected: 'apple,ant' },
      { description: 'Groups numbers by parity', input: 'const r = [1,2,3,4].groupBy(n => n % 2 === 0 ? "even" : "odd"); return r["even"].join(",")', expected: '2,4' },
    ],
    xpReward: 80,
    tags: ['module-augmentation', 'prototype', 'generics', 'enterprise'],
    tips: [
      'Inside `interface Array<T>`, declare: `groupBy<K extends string>(fn: (item: T) => K): Record<K, T[]>;`',
      'On the prototype, `this` refers to the array — iterate with `for (const item of this as T[])`.',
      'Build the result: initialize `result[key]` as `[]` if missing, then push each item.',
    ],
    published: true,
  },
  {
    title: 'Type-Safe Event Emitter',
    description: 'Implement a `TypedEmitter<Events>` class where `Events` is a record of event name → payload type. The class must have:\n- `on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): void`\n- `emit<K extends keyof Events>(event: K, payload: Events[K]): void`',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 2,
    starterCode: `// Implement TypedEmitter<Events>
class TypedEmitter<Events extends Record<string, any>> {
  // your code here
}`,
    solutionCode: `class TypedEmitter<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: Array<(payload: Events[K]) => void> } = {};

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const handlers = this.listeners[event];
    if (handlers) {
      for (const handler of handlers) {
        handler(payload);
      }
    }
  }
}`,
    testCases: [
      { description: 'Emits and receives events', input: 'const ee = new TypedEmitter(); let received = null; ee.on("data", p => { received = p; }); ee.emit("data", 42); return received', expected: '42' },
      { description: 'Multiple listeners', input: 'const ee = new TypedEmitter(); const results = []; ee.on("msg", m => results.push(m + "1")); ee.on("msg", m => results.push(m + "2")); ee.emit("msg", "hi"); return results.join(",")', expected: 'hi1,hi2' },
      { description: 'No listeners — no error', input: 'const ee = new TypedEmitter(); ee.emit("unknown", "test"); return "ok"', expected: 'ok' },
    ],
    xpReward: 90,
    tags: ['event-emitter', 'generics', 'classes', 'enterprise'],
    tips: [
      'Store listeners as a mapped type: `{ [K in keyof Events]?: Array<(payload: Events[K]) => void> }`.',
      'In `on`: initialize the array if missing, then push the listener.',
      'In `emit`: look up the handlers for that event, iterate, and call each with the payload.',
    ],
    published: true,
  },
  {
    title: 'Generic Repository Pattern',
    description: 'Define a `Repository<T extends { id: string }>` interface with:\n- `findById(id: string): T | undefined`\n- `findAll(): T[]`\n- `save(item: T): void`\n- `delete(id: string): void`\n\nImplement `InMemoryRepo<T>` that fulfils this interface using a `Map`.',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 3,
    starterCode: `// Define Repository interface and InMemoryRepo implementation
interface Repository<T extends { id: string }> {
  // your interface here
}

class InMemoryRepo<T extends { id: string }> implements Repository<T> {
  // your implementation here
}`,
    solutionCode: `interface Repository<T extends { id: string }> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(item: T): void;
  delete(id: string): void;
}

class InMemoryRepo<T extends { id: string }> implements Repository<T> {
  private store = new Map<string, T>();

  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  findAll(): T[] {
    return Array.from(this.store.values());
  }

  save(item: T): void {
    this.store.set(item.id, item);
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}`,
    testCases: [
      { description: 'Save and findById', input: 'const r = new InMemoryRepo(); r.save({ id: "1", name: "Alice" }); return r.findById("1").name', expected: 'Alice' },
      { description: 'findAll returns all items', input: 'const r = new InMemoryRepo(); r.save({ id: "1" }); r.save({ id: "2" }); return r.findAll().length', expected: '2' },
      { description: 'delete removes item', input: 'const r = new InMemoryRepo(); r.save({ id: "1" }); r.delete("1"); return String(r.findById("1"))', expected: 'undefined' },
      { description: 'findById returns undefined for missing', input: 'const r = new InMemoryRepo(); return String(r.findById("none"))', expected: 'undefined' },
    ],
    xpReward: 95,
    tags: ['repository-pattern', 'generics', 'interfaces', 'enterprise'],
    tips: [
      'The constraint `T extends { id: string }` guarantees every stored item has an id.',
      'Use a `Map<string, T>` internally: `private store = new Map<string, T>();`',
      'Methods are thin wrappers: `findById` → `store.get(id)`, `save` → `store.set(item.id, item)`, etc.',
    ],
    published: true,
  },
  {
    title: 'Discriminated API Responses',
    description: 'Define `ApiResult<T>` as a discriminated union:\n- `{ ok: true; data: T }`\n- `{ ok: false; error: string }`\n\nImplement `handleResult<T>(result: ApiResult<T>, onSuccess: (data: T) => string, onError: (err: string) => string): string` that dispatches to the right handler.',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 4,
    starterCode: `// Define ApiResult and implement handleResult
type ApiResult<T> = never; // replace with your implementation

function handleResult<T>(
  result: ApiResult<T>,
  onSuccess: (data: T) => string,
  onError: (err: string) => string
): string {
  // your code here
}`,
    solutionCode: `type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function handleResult<T>(
  result: ApiResult<T>,
  onSuccess: (data: T) => string,
  onError: (err: string) => string
): string {
  if (result.ok) return onSuccess(result.data);
  return onError(result.error);
}`,
    testCases: [
      { description: 'Handles success', input: 'return handleResult({ ok: true, data: 42 }, d => "got " + d, e => "err: " + e)', expected: 'got 42' },
      { description: 'Handles error', input: 'return handleResult({ ok: false, error: "not found" }, d => "got " + d, e => "err: " + e)', expected: 'err: not found' },
      { description: 'Success with string data', input: 'return handleResult({ ok: true, data: "Alice" }, d => d.toUpperCase(), e => e)', expected: 'ALICE' },
    ],
    xpReward: 85,
    tags: ['discriminated-unions', 'api', 'generics', 'enterprise'],
    tips: [
      'The discriminant is `ok: true | false` — TypeScript narrows the type based on this check.',
      'Define as a union: `{ ok: true; data: T } | { ok: false; error: string }`.',
      'In the function: `if (result.ok) return onSuccess(result.data); return onError(result.error);`',
    ],
    published: true,
  },
  {
    title: 'Zod-Style Schema Validator',
    description: 'Build a mini schema validator inspired by Zod. Implement:\n- `Schema<T>` interface with `parse(val: unknown): T`\n- `string()` — returns a `Schema<string>` that throws if not a string\n- `number()` — returns a `Schema<number>` that throws if not a number\n- `object<S extends Record<string, Schema<any>>>(shape: S)` — returns a `Schema<{ [K in keyof S]: S[K] extends Schema<infer T> ? T : never }>`',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 5,
    starterCode: `// Implement a Zod-style schema validator
interface Schema<T> {
  parse(val: unknown): T;
}

function string(): Schema<string> {
  // your code here
}

function number(): Schema<number> {
  // your code here
}

function object<S extends Record<string, Schema<any>>>(
  shape: S
): Schema<{ [K in keyof S]: S[K] extends Schema<infer T> ? T : never }> {
  // your code here
}`,
    solutionCode: `interface Schema<T> {
  parse(val: unknown): T;
}

function string(): Schema<string> {
  return {
    parse(val: unknown): string {
      if (typeof val !== 'string') throw new Error('Expected string');
      return val;
    },
  };
}

function number(): Schema<number> {
  return {
    parse(val: unknown): number {
      if (typeof val !== 'number') throw new Error('Expected number');
      return val;
    },
  };
}

function object<S extends Record<string, Schema<any>>>(
  shape: S
): Schema<{ [K in keyof S]: S[K] extends Schema<infer T> ? T : never }> {
  return {
    parse(val: unknown) {
      if (typeof val !== 'object' || val === null) throw new Error('Expected object');
      const result: any = {};
      for (const key in shape) {
        result[key] = shape[key].parse((val as any)[key]);
      }
      return result;
    },
  };
}`,
    testCases: [
      { description: 'Parses a string', input: 'return string().parse("hello")', expected: 'hello' },
      { description: 'Parses a number', input: 'return number().parse(42)', expected: '42' },
      { description: 'Parses an object', input: 'const s = object({ name: string(), age: number() }); const r = s.parse({ name: "Alice", age: 30 }); return r.name + "," + r.age', expected: 'Alice,30' },
      { description: 'Throws on wrong type', input: 'try { string().parse(42); return "no error"; } catch(e) { return "error"; }', expected: 'error' },
    ],
    xpReward: 110,
    tags: ['schema-validation', 'generics', 'infer', 'enterprise'],
    tips: [
      '`string()` and `number()` return a schema object with a `parse` method that validates via `typeof`.',
      'For `object()`: iterate the shape\'s keys with `for (const key in shape)`, calling each schema\'s `parse`.',
      'The mapped type `{ [K in keyof S]: S[K] extends Schema<infer T> ? T : never }` extracts the inner type from each nested schema.',
    ],
    published: true,
  },
  {
    title: 'Type-Safe Configuration',
    description: 'Implement a `Config<T extends Record<string, unknown>>` class with:\n- Constructor accepting an initial config object of type `T`\n- `get<K extends keyof T>(key: K): T[K]` — retrieves a typed config value\n- `set<K extends keyof T>(key: K, value: T[K]): void` — updates a value',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 6,
    starterCode: `// Implement type-safe Config<T> class
class Config<T extends Record<string, unknown>> {
  // your code here
}`,
    solutionCode: `class Config<T extends Record<string, unknown>> {
  private data: T;

  constructor(initial: T) {
    this.data = { ...initial };
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.data[key] = value;
  }
}`,
    testCases: [
      { description: 'get returns correct value', input: 'const c = new Config({ host: "localhost", port: 3000 }); return c.get("host")', expected: 'localhost' },
      { description: 'get returns number value', input: 'const c = new Config({ host: "localhost", port: 3000 }); return c.get("port")', expected: '3000' },
      { description: 'set updates value', input: 'const c = new Config({ debug: false }); c.set("debug", true); return c.get("debug")', expected: 'true' },
      { description: 'set and get round-trip', input: 'const c = new Config({ name: "app" }); c.set("name", "updated"); return c.get("name")', expected: 'updated' },
    ],
    xpReward: 90,
    tags: ['configuration', 'generics', 'classes', 'enterprise'],
    tips: [
      'Store config as `private data: T` initialized from the constructor: `this.data = { ...initial };`',
      'For `get`: use indexed access `this.data[key]`. The return type `T[K]` infers automatically.',
      'For `set`: assign with the same shape. TypeScript ensures `value` matches the existing type of `key`.',
    ],
    published: true,
  },
  {
    title: 'Strict JSON Types',
    description: 'Define a recursive `JsonValue` type:\n```\ntype JsonValue = string | number | boolean | null | JsonArray | JsonObject\ntype JsonArray = JsonValue[]\ntype JsonObject = { [key: string]: JsonValue }\n```\nImplement `serialize(val: JsonValue): string` using `JSON.stringify`.',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 7,
    starterCode: `// Define recursive JSON types and implement serialize
type JsonValue = never; // replace with your implementation
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function serialize(val: JsonValue): string {
  // your code here
}`,
    solutionCode: `type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = string | number | boolean | null | JsonArray | JsonObject;

function serialize(val: JsonValue): string {
  return JSON.stringify(val);
}`,
    testCases: [
      { description: 'Serializes string', input: 'return serialize("hello")', expected: '"hello"' },
      { description: 'Serializes number', input: 'return serialize(42)', expected: '42' },
      { description: 'Serializes null', input: 'return serialize(null)', expected: 'null' },
      { description: 'Serializes object', input: 'return serialize({ a: 1, b: "x" })', expected: '{"a":1,"b":"x"}' },
      { description: 'Serializes nested array', input: 'return serialize([1, [2, 3], null])', expected: '[1,[2,3],null]' },
    ],
    xpReward: 95,
    tags: ['recursive-types', 'json', 'type-aliases', 'enterprise'],
    tips: [
      '`JsonValue` is a recursive union — it references `JsonObject` and `JsonArray`, which both reference `JsonValue` back.',
      'TypeScript allows recursive type aliases as long as the recursion goes through a structural type.',
      'Full type: `type JsonValue = string | number | boolean | null | JsonArray | JsonObject;`. The serializer is just `JSON.stringify(val)`.',
    ],
    published: true,
  },
  {
    title: 'tRPC-Style Procedure Builder',
    description: 'Build a `Procedure` builder inspired by tRPC:\n- `procedure()` creates a builder\n- `.input<I>(schema: { parse: (v: unknown) => I })` sets the input type\n- `.output<O>()` sets the output type (marker only)\n- `.handler(fn: (input: I) => O): { call: (raw: unknown) => O }` finalizes with a handler\n\nThe `.call(raw)` method should parse the input then invoke the handler.',
    difficulty: 'EXPERT',
    track: 'enterprise',
    order: 8,
    starterCode: `// Implement a tRPC-style procedure builder
function procedure() {
  // your code here
}`,
    solutionCode: `function procedure() {
  return {
    input<I>(schema: { parse: (v: unknown) => I }) {
      return {
        output<O>() {
          return {
            handler(fn: (input: I) => O): { call: (raw: unknown) => O } {
              return {
                call(raw: unknown): O {
                  const parsed = schema.parse(raw);
                  return fn(parsed);
                },
              };
            },
          };
        },
        handler<O>(fn: (input: I) => O): { call: (raw: unknown) => O } {
          return {
            call(raw: unknown): O {
              const parsed = schema.parse(raw);
              return fn(parsed);
            },
          };
        },
      };
    },
  };
}`,
    testCases: [
      { description: 'Handler receives parsed input', input: 'const greet = procedure().input({ parse: v => String(v) }).handler(name => "Hello, " + name); return greet.call("Alice")', expected: 'Hello, Alice' },
      { description: 'Input is parsed before handler', input: 'const double = procedure().input({ parse: v => Number(v) }).handler(n => n * 2); return double.call("21")', expected: '42' },
      { description: 'Output type flows through', input: 'const p = procedure().input({ parse: v => ({ name: String(v) }) }).handler(i => i.name.toUpperCase()); return p.call("world")', expected: 'WORLD' },
    ],
    xpReward: 120,
    tags: ['trpc', 'builder-pattern', 'generics', 'inference', 'enterprise'],
    tips: [
      'Each step returns a new object with the next allowed methods — classic fluent builder pattern.',
      '`input<I>` captures the input type from the schema. `handler<O>` captures the output type from the function.',
      'In the final `call`: `const parsed = schema.parse(raw); return fn(parsed);` — parse first, then invoke.',
    ],
    published: true,
  },
];

// ─── Achievements ─────────────────────────────────────────────────
const achievements = [
  { name: 'First Blood', description: 'Complete your first challenge', icon: '🩸', xpReward: 50 },
  { name: 'Beginner Graduate', description: 'Complete all Beginner challenges', icon: '🎓', xpReward: 200 },
  { name: 'Intermediate Unlocked', description: 'Complete all Intermediate challenges', icon: '⚡', xpReward: 300 },
  { name: 'Advanced Cleared', description: 'Complete all Advanced challenges', icon: '🔥', xpReward: 500 },
  { name: 'TypeScript Expert', description: 'Complete all Expert challenges', icon: '💎', xpReward: 750 },
  { name: 'Enterprise Ready', description: 'Complete all Enterprise challenges', icon: '🏢', xpReward: 1000 },
  { name: 'Type Wizard', description: 'Complete the full TypeForge curriculum', icon: '🧙', xpReward: 2000 },
  { name: 'Speed Demon', description: 'Submit 10 challenges in a single day', icon: '⚡', xpReward: 100 },
  { name: 'Perfectionist', description: 'Pass all test cases on first submission', icon: '✨', xpReward: 150 },
  { name: 'Self-Reliant', description: 'Complete a challenge without revealing any hints', icon: '🦉', xpReward: 75 },
];

async function main() {
  console.log('Seeding TypeForge database…');

  // Create default admin user (skip if already exists)
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@typeforge.dev';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: { email: adminEmail, username: 'admin', password: hashed, role: Role.ADMIN },
    });
    console.log(`  ✓ Admin user: ${adminEmail}`);
  }

  // Wipe and repopulate challenges (safe for development)
  await prisma.challengeAttempt.deleteMany({});
  await prisma.challenge.deleteMany({});
  console.log('  ✓ Cleared existing challenges');

  for (const c of challenges) {
    await prisma.challenge.create({
      data: { ...c, difficulty: c.difficulty as Difficulty, testCases: c.testCases as any },
    });
    console.log(`  ✓ ${c.track.padEnd(14)} ${c.title}`);
  }

  // Upsert achievements
  await prisma.achievement.deleteMany({});
  for (const a of achievements) {
    await prisma.achievement.create({ data: a });
    console.log(`  ✓ Achievement: ${a.name}`);
  }

  console.log(`\nDone. ${challenges.length} challenges + ${achievements.length} achievements seeded.`);
}

main().finally(() => prisma.$disconnect());
