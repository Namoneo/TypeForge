import { Test, TestingModule } from '@nestjs/testing';
import { CompilerService } from './compiler.service';

describe('CompilerService', () => {
  let service: CompilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompilerService],
    }).compile();
    service = module.get<CompilerService>(CompilerService);
  });

  describe('compile()', () => {
    it('compiles valid TypeScript without errors', () => {
      const result = service.compile(`
        function greet(name: string): string {
          return 'Hello, ' + name;
        }
      `);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.compiledJs).toBeDefined();
    });

    it('returns errors for invalid TypeScript', () => {
      const result = service.compile(`
        const x: number = "not a number";
      `);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].category).toBe('error');
    });

    it('includes line and column in diagnostics', () => {
      const result = service.compile(`const x: number = "bad";`);
      expect(result.errors[0].line).toBeDefined();
      expect(result.errors[0].column).toBeDefined();
    });

    it('compiles in non-strict mode when strict=false', () => {
      const result = service.compile(`const x = (a, b) => a + b;`, false);
      expect(result.success).toBe(true);
    });
  });

  describe('runChallenge()', () => {
    it('passes compile-only test when code is valid', async () => {
      const result = await service.runChallenge(
        `function greet(name: string): string { return 'Hello, ' + name; }`,
        [{ description: 'compiles', input: '', expected: 'ok' }],
      );
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
    });

    it('returns compilation failure when code is invalid', async () => {
      const result = await service.runChallenge(
        `const x: number = "bad";`,
        [{ description: 'test', input: 'return 1', expected: '1' }],
      );
      expect(result.passed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('executes test input in a sandbox and compares result', async () => {
      const result = await service.runChallenge(
        `function add(a: number, b: number): number { return a + b; }`,
        [{ description: 'adds 2+3', input: 'return add(2, 3)', expected: '5' }],
      );
      expect(result.passed).toBe(true);
      expect(result.testResults[0].actual).toBe('5');
    });

    it('reports failure when test result does not match', async () => {
      const result = await service.runChallenge(
        `function add(a: number, b: number): number { return a - b; }`,
        [{ description: 'should add', input: 'return add(2, 3)', expected: '5' }],
      );
      expect(result.passed).toBe(false);
      expect(result.testResults[0].actual).toBe('-1');
    });

    it('sandboxes code — no access to Node globals', async () => {
      const result = await service.runChallenge(
        `function evil(): string { return (globalThis as any).process?.version ?? 'sandboxed'; }`,
        [{ description: 'no process access', input: 'return evil()', expected: 'sandboxed' }],
      );
      // Either it's sandboxed (returns 'sandboxed') or throws — both are acceptable
      if (result.testResults[0].error) {
        expect(result.testResults[0].passed).toBe(false);
      } else {
        expect(result.testResults[0].actual).toBe('sandboxed');
      }
    });

    it('enforces execution timeout', async () => {
      const result = await service.runChallenge(
        `function loop(): number { while(true) {} return 0; }`,
        [{ description: 'infinite loop', input: 'return loop()', expected: '0' }],
      );
      expect(result.passed).toBe(false);
      expect(result.testResults[0].error).toMatch(/timed? ?out/i);
    }, 10000);

    it('calculates score as percentage of passed tests', async () => {
      const result = await service.runChallenge(
        `function id(x: number): number { return x; }`,
        [
          { description: 'test 1', input: 'return id(1)', expected: '1' },
          { description: 'test 2', input: 'return id(2)', expected: '99' }, // will fail
        ],
      );
      expect(result.score).toBe(50);
      expect(result.passed).toBe(false);
    });
  });
});
