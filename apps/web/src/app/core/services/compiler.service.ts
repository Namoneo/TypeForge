import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface CompileResult {
  success: boolean;
  compiledJs?: string;
  errors: Diagnostic[];
  warnings: Diagnostic[];
  elapsed: number;
}

export interface Diagnostic {
  category: 'error' | 'warning' | 'message' | 'suggestion';
  code: number;
  message: string;
  line?: number;
  column?: number;
}

@Injectable({ providedIn: 'root' })
export class CompilerService {
  private api = inject(ApiService);

  readonly isCompiling = signal(false);
  readonly lastResult = signal<CompileResult | null>(null);

  compile(code: string, strict = true) {
    this.isCompiling.set(true);
    return this.api.post<CompileResult>('/compiler/compile', { code, strict });
  }

  compileAndStore(code: string, strict = true) {
    this.isCompiling.set(true);
    this.api.post<CompileResult>('/compiler/compile', { code, strict }).subscribe({
      next: (result) => {
        this.lastResult.set(result);
        this.isCompiling.set(false);
      },
      error: () => this.isCompiling.set(false),
    });
  }
}
