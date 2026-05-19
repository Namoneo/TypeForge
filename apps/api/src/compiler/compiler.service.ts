import { Injectable } from '@nestjs/common';
import * as ts from 'typescript';

export interface CompileResult {
  success: boolean;
  compiledJs?: string;
  errors: DiagnosticInfo[];
  warnings: DiagnosticInfo[];
  elapsed: number;
}

export interface DiagnosticInfo {
  category: 'error' | 'warning' | 'message' | 'suggestion';
  code: number;
  message: string;
  line?: number;
  column?: number;
}

export interface TestCase {
  description: string;
  input?: string;
  expected: string;
}

export interface ChallengeRunResult {
  passed: boolean;
  score: number;
  errors: string[];
  testResults: Array<{
    description: string;
    passed: boolean;
    expected: string;
    actual?: string;
    error?: string;
  }>;
}

const STRICT_OPTIONS: ts.CompilerOptions = {
  strict: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  noEmitOnError: false,
  noImplicitAny: true,
  strictNullChecks: true,
  lib: ['ES2022'],
};

@Injectable()
export class CompilerService {
  compile(code: string, strict = true): CompileResult {
    const start = Date.now();
    const filename = 'input.ts';

    const sourceFile = ts.createSourceFile(filename, code, ts.ScriptTarget.ES2022, true);

    const options: ts.CompilerOptions = strict ? STRICT_OPTIONS : {
      ...STRICT_OPTIONS,
      strict: false,
      noImplicitAny: false,
      strictNullChecks: false,
    };

    let compiledJs: string | undefined;
    const host = ts.createCompilerHost(options);
    const originalGetSourceFile = host.getSourceFile.bind(host);

    host.getSourceFile = (name, langVersion) =>
      name === filename ? sourceFile : originalGetSourceFile(name, langVersion);
    host.writeFile = (_name, text) => { compiledJs = text; };

    const program = ts.createProgram([filename], options, host);
    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    const errors: DiagnosticInfo[] = [];
    const warnings: DiagnosticInfo[] = [];

    for (const d of allDiagnostics) {
      const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
      let line: number | undefined;
      let column: number | undefined;

      if (d.file && d.start !== undefined) {
        const pos = d.file.getLineAndCharacterOfPosition(d.start);
        line = pos.line + 1;
        column = pos.character + 1;
      }

      const info: DiagnosticInfo = {
        category: this.categoryName(d.category),
        code: d.code,
        message: msg,
        line,
        column,
      };

      if (d.category === ts.DiagnosticCategory.Error) errors.push(info);
      else warnings.push(info);
    }

    return {
      success: errors.length === 0,
      compiledJs,
      errors,
      warnings,
      elapsed: Date.now() - start,
    };
  }

  async runChallenge(code: string, testCases: TestCase[]): Promise<ChallengeRunResult> {
    const compileResult = this.compile(code);
    if (!compileResult.success || !compileResult.compiledJs) {
      return {
        passed: false,
        score: 0,
        errors: compileResult.errors.map((e) => `TS${e.code}: ${e.message}`),
        testResults: testCases.map((tc) => ({
          description: tc.description,
          passed: false,
          expected: tc.expected,
          error: 'Compilation failed',
        })),
      };
    }

    const testResults: ChallengeRunResult['testResults'] = [];
    let passedCount = 0;

    for (const tc of testCases) {
      try {
        // Type-check based tests: evaluate expected type expressions
        const testCode = `${compileResult.compiledJs}\n${tc.input ?? ''}`;
        // Run in an isolated eval scope — note: real sandbox would use vm2/isolated-vm
        // eslint-disable-next-line no-new-func
        const fn = new Function(testCode);
        const actual = String(fn() ?? '');
        const pass = actual === tc.expected;
        if (pass) passedCount++;
        testResults.push({ description: tc.description, passed: pass, expected: tc.expected, actual });
      } catch (err: any) {
        testResults.push({
          description: tc.description,
          passed: false,
          expected: tc.expected,
          error: err?.message ?? 'Runtime error',
        });
      }
    }

    const score = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0;

    return {
      passed: passedCount === testCases.length,
      score,
      errors: [],
      testResults,
    };
  }

  private categoryName(cat: ts.DiagnosticCategory): DiagnosticInfo['category'] {
    switch (cat) {
      case ts.DiagnosticCategory.Error: return 'error';
      case ts.DiagnosticCategory.Warning: return 'warning';
      case ts.DiagnosticCategory.Suggestion: return 'suggestion';
      default: return 'message';
    }
  }
}
