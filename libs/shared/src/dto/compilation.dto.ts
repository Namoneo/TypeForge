export interface CompileRequestDto {
  code: string;
  filename?: string;
  strict?: boolean;
}

export interface CompileResultDto {
  success: boolean;
  output?: string;
  errors: CompileError[];
  warnings: CompileError[];
  diagnostics: TsDiagnostic[];
  compiledJs?: string;
  elapsed: number;
}

export interface CompileError {
  message: string;
  line?: number;
  column?: number;
  file?: string;
}

export interface TsDiagnostic {
  category: 'error' | 'warning' | 'message' | 'suggestion';
  code: number;
  message: string;
  line?: number;
  column?: number;
}

export interface HoverInfoDto {
  code: string;
  position: number;
}

export interface HoverResultDto {
  type?: string;
  documentation?: string;
}
