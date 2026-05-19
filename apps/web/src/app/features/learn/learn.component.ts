import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TRACKS } from '@typeforge/shared/constants';

interface TopicInfo {
  name: string;
  summary: string;
  example: string;
}

const TRACK_TOPICS: Record<string, TopicInfo[]> = {
  beginner: [
    {
      name: 'Variables & Types',
      summary: 'TypeScript adds static types to JavaScript. Annotate variables with `: type` to catch mistakes at compile time.',
      example: 'let name: string = "Alice";\nlet age: number = 30;\nlet active: boolean = true;',
    },
    {
      name: 'Functions',
      summary: 'Annotate function parameters and return types. TypeScript infers return types but being explicit is better.',
      example: 'function add(a: number, b: number): number {\n  return a + b;\n}',
    },
    {
      name: 'Interfaces',
      summary: 'Interfaces describe the shape of an object. Any object with the required properties satisfies the interface.',
      example: 'interface User {\n  name: string;\n  email: string;\n  age?: number; // optional\n}',
    },
    {
      name: 'Unions & Intersections',
      summary: 'Union types (A | B) mean "either A or B". Intersection types (A & B) mean "both A and B".',
      example: 'type StringOrNumber = string | number;\ntype Admin = User & { role: string };',
    },
    {
      name: 'Enums',
      summary: 'Enums define a set of named constants. String enums are preferred for readability and debugging.',
      example: 'enum Direction {\n  Up = "UP",\n  Down = "DOWN",\n}',
    },
    {
      name: 'Type Narrowing',
      summary: 'TypeScript narrows types in conditional blocks. Use typeof, instanceof, or custom guards.',
      example: 'function format(val: string | number) {\n  if (typeof val === "string") return val.toUpperCase();\n  return val.toFixed(2);\n}',
    },
  ],
  intermediate: [
    {
      name: 'Generics',
      summary: 'Generics let you write reusable code that works with any type while preserving type safety.',
      example: 'function identity<T>(arg: T): T { return arg; }\nfunction first<T>(arr: T[]): T { return arr[0]; }',
    },
    {
      name: 'Function Overloads',
      summary: 'Multiple function signatures for the same function, allowing different input/output type combinations.',
      example: 'function parse(input: string): number;\nfunction parse(input: number): string;\nfunction parse(input: any): any { ... }',
    },
    {
      name: 'Utility Types',
      summary: 'Built-in generic types: Partial<T>, Required<T>, Readonly<T>, Pick<T,K>, Omit<T,K>, Record<K,V>.',
      example: 'type PartialUser = Partial<User>; // all fields optional\ntype ReadonlyUser = Readonly<User>; // all fields readonly',
    },
    {
      name: 'Mapped Types',
      summary: 'Create new types by transforming each property of an existing type using `[K in keyof T]` syntax.',
      example: 'type Nullable<T> = { [K in keyof T]: T[K] | null };',
    },
    {
      name: 'Index Signatures',
      summary: 'Allow objects with dynamic string or number keys while preserving the value type.',
      example: 'interface Dictionary<V> {\n  [key: string]: V;\n}',
    },
    {
      name: 'Declaration Merging',
      summary: 'Multiple declarations with the same name merge into one. Useful for augmenting existing types.',
      example: 'interface Window {\n  myLib: typeof myLib; // extend Window\n}',
    },
  ],
  advanced: [
    {
      name: 'Conditional Types',
      summary: 'Types that depend on a condition: `T extends U ? X : Y`. Enables powerful type-level logic.',
      example: 'type IsArray<T> = T extends any[] ? true : false;\ntype Flatten<T> = T extends Array<infer U> ? U : T;',
    },
    {
      name: 'Template Literal Types',
      summary: 'Construct string types using template literal syntax. Combine with unions for powerful string type patterns.',
      example: 'type EventName<T extends string> = `on${Capitalize<T>}`;\ntype ClickEvent = EventName<"click">; // "onClick"',
    },
    {
      name: 'Recursive Types',
      summary: 'Types that reference themselves, enabling deep transformations of nested structures.',
      example: 'type DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object\n    ? DeepReadonly<T[K]> : T[K]\n};',
    },
    {
      name: 'Variance',
      summary: 'Type compatibility rules: covariance (subtypes flow in), contravariance (subtypes flow out). Affects function types.',
      example: '// (Dog) => void is assignable to (Animal) => void\n// But NOT vice versa (contravariant in parameter)',
    },
    {
      name: 'Infer Keyword',
      summary: '`infer` captures a type within a conditional type. Essential for extracting types from generics.',
      example: 'type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never;\ntype PromiseValue<T> = T extends Promise<infer V> ? V : T;',
    },
    {
      name: 'Distributive Types',
      summary: 'Conditional types distribute over union types: `(A | B) extends T` checks each member separately.',
      example: 'type Exclude<T, U> = T extends U ? never : T;\ntype Result = Exclude<"a"|"b"|"c", "a">; // "b" | "c"',
    },
  ],
  expert: [
    {
      name: 'Type-Level Programming',
      summary: 'Use the type system as a compute engine: arithmetic, string parsing, recursive algorithms — all at compile time.',
      example: 'type Length<T extends any[]> = T["length"];\ntype Concat<A extends any[], B extends any[]> = [...A, ...B];',
    },
    {
      name: 'Compiler Internals',
      summary: 'Understanding how tsc works: declaration files, project references, incremental builds, language service.',
      example: '// tsconfig.json\n{\n  "compilerOptions": {\n    "strict": true,\n    "declaration": true\n  }\n}',
    },
    {
      name: 'DSL Creation',
      summary: 'Use TypeScript types to build type-safe DSLs (domain-specific languages) and fluent APIs.',
      example: 'const query = db\n  .select<User>("name", "email")\n  .where("age", ">", 18)\n  .limit(10);',
    },
    {
      name: 'Advanced Inference',
      summary: 'Complex infer patterns: inferring from arrays, tuples, function signatures, and deeply nested generics.',
      example: 'type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;\ntype Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;',
    },
    {
      name: 'Type Gymnastics',
      summary: 'Challenge problems that push the type system to its limits — recursive unions, constraint loops, phantom types.',
      example: 'type Brand<T, B> = T & { readonly _brand: B };\ntype UserId = Brand<string, "UserId">;\ntype ProductId = Brand<string, "ProductId">;',
    },
    {
      name: 'Performance',
      summary: 'Understand type instantiation depth limits, how to simplify complex types, and avoid slow compilation.',
      example: '// Use interface instead of type alias for objects\n// (interfaces are lazily evaluated)\ninterface BigType extends SomeBase { ... }',
    },
  ],
  enterprise: [
    {
      name: 'Angular Patterns',
      summary: 'Typed services, signals, strongly-typed reactive forms, component inputs with generics.',
      example: 'class UserService {\n  private users = signal<User[]>([]);\n  readonly count = computed(() => this.users().length);\n}',
    },
    {
      name: 'NestJS DI',
      summary: 'Typed dependency injection with decorators, typed providers, custom tokens, factory providers.',
      example: '@Injectable()\nclass OrderService {\n  constructor(private users: UserService) {}\n}',
    },
    {
      name: 'Prisma & Zod',
      summary: 'Leverage Prisma-generated types end-to-end and validate inputs with Zod schemas that export TypeScript types.',
      example: 'const UserSchema = z.object({\n  name: z.string(),\n  email: z.string().email(),\n});\ntype User = z.infer<typeof UserSchema>;',
    },
    {
      name: 'tRPC Contracts',
      summary: 'End-to-end type-safe APIs: routers, procedures, input/output types shared between server and client.',
      example: 'const appRouter = router({\n  getUser: procedure\n    .input(z.string())\n    .query(async ({ input }) => getUser(input)),\n});',
    },
    {
      name: 'Monorepo Typing',
      summary: 'Share types across packages, path aliases, project references, and TypeScript workspace patterns.',
      example: '// tsconfig.json\n"paths": {\n  "@myapp/shared": ["libs/shared/src/index.ts"]\n}',
    },
    {
      name: 'API Design',
      summary: 'Design type-safe REST/GraphQL APIs: discriminated response types, versioned schemas, error types.',
      example: 'type ApiResult<T> =\n  | { ok: true; data: T }\n  | { ok: false; error: string; code: number };',
    },
  ],
};

@Component({
  selector: 'tf-learn',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-5xl">
      <h1 class="text-2xl font-bold mb-2" style="color: var(--text-primary)">Learning Tracks</h1>
      <p class="text-sm mb-8" style="color: var(--text-secondary)">
        Structured progression from beginner to enterprise-grade TypeScript engineer.
        Each track builds on the previous one.
      </p>

      <div class="space-y-6">
        @for (track of tracks; track track.id) {
          <div class="rounded-xl border overflow-hidden" style="background: var(--bg-surface); border-color: var(--border)">
            <!-- Track header -->
            <div class="flex items-center gap-4 p-5 border-b" style="border-color: var(--border)">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                   [style.background]="track.color + '20'">
                {{ track.icon }}
              </div>
              <div class="flex-1">
                <div class="font-semibold" style="color: var(--text-primary)">{{ track.name }}</div>
                <div class="text-xs mt-0.5" style="color: var(--text-secondary)">
                  {{ topicList(track.id).length }} topics
                </div>
              </div>
              <a [routerLink]="['/challenges']" [queryParams]="{ track: track.id }"
                 class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                 style="border-color: var(--border); color: var(--text-secondary)">
                View Challenges →
              </a>
              <button (click)="toggleTrack(track.id)"
                      class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                      style="border-color: var(--border); color: var(--text-secondary)">
                {{ expanded() === track.id ? 'Collapse' : 'Expand' }}
              </button>
            </div>

            <!-- Topic grid — always shown as chips -->
            <div class="p-4 flex flex-wrap gap-2">
              @for (topic of topicList(track.id); track topic.name) {
                <button (click)="selectTopic(track.id, topic)"
                        class="px-3 py-1 rounded-full text-xs border transition-colors"
                        [style.background]="selectedTopic()?.name === topic.name ? track.color + '20' : 'var(--bg-elevated)'"
                        [style.borderColor]="selectedTopic()?.name === topic.name ? track.color : 'var(--border)'"
                        [style.color]="selectedTopic()?.name === topic.name ? track.color : 'var(--text-secondary)'">
                  {{ topic.name }}
                </button>
              }
            </div>

            <!-- Selected topic detail -->
            @if (expanded() === track.id && selectedTopic(); as t) {
              <div class="mx-4 mb-4 rounded-lg border p-4 space-y-3"
                   style="background: var(--bg-elevated); border-color: var(--border)">
                <div class="font-semibold text-sm" style="color: var(--text-primary)">{{ t.name }}</div>
                <p class="text-xs leading-relaxed" style="color: var(--text-secondary)">{{ t.summary }}</p>
                <pre class="text-xs rounded-md p-3 overflow-auto leading-relaxed"
                     style="background: var(--bg-base); color: var(--text-primary); font-family: 'Menlo','Monaco','Consolas',monospace">{{ t.example }}</pre>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class LearnComponent {
  tracks = TRACKS;
  expanded = signal<string | null>(null);
  selectedTopic = signal<TopicInfo | null>(null);

  topicList(trackId: string): TopicInfo[] {
    return TRACK_TOPICS[trackId] ?? [];
  }

  toggleTrack(trackId: string) {
    if (this.expanded() === trackId) {
      this.expanded.set(null);
      this.selectedTopic.set(null);
    } else {
      this.expanded.set(trackId);
      this.selectedTopic.set(this.topicList(trackId)[0] ?? null);
    }
  }

  selectTopic(trackId: string, topic: TopicInfo) {
    this.expanded.set(trackId);
    this.selectedTopic.set(topic);
  }
}
