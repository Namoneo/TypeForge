import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorComponent } from '../../shared/components/monaco-editor/monaco-editor.component';
import { AiMentorPanelComponent } from '../../shared/components/ai-mentor/ai-mentor-panel.component';
import { CompilerService, Diagnostic } from '../../core/services/compiler.service';

const STARTER = `// TypeForge Playground — real TypeScript compiler, live diagnostics
// Try writing some TypeScript and hit ▶ Run

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Config {
  server: { host: string; port: number };
  debug: boolean;
}

const config: DeepReadonly<Config> = {
  server: { host: 'localhost', port: 3000 },
  debug: false,
};

// config.debug = true; // ✖ Cannot assign to 'debug' because it is a read-only property

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Awaited1 = UnwrapPromise<Promise<string>>; // string
type Awaited2 = UnwrapPromise<number>;           // number

console.log('Hello from TypeForge!');
`;

@Component({
  selector: 'tf-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorComponent, AiMentorPanelComponent],
  template: `
    <div class="flex flex-col h-screen" style="background: var(--bg-base)">
      <!-- Toolbar -->
      <div class="flex items-center gap-3 px-4 py-2 border-b shrink-0"
           style="background: var(--bg-surface); border-color: var(--border)">
        <span class="text-sm font-semibold" style="color: var(--text-primary)">Playground</span>
        <div class="flex-1"></div>
        <label class="flex items-center gap-2 text-xs" style="color: var(--text-secondary)">
          <input type="checkbox" [(ngModel)]="strict" class="accent-indigo-500"> Strict mode
        </label>
        <button (click)="run()" [disabled]="compiler.isCompiling()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-opacity"
                style="background: var(--accent); color: white"
                [style.opacity]="compiler.isCompiling() ? '0.6' : '1'">
          {{ compiler.isCompiling() ? '…' : '▶ Run' }}
        </button>
        <button (click)="reset()" class="px-3 py-1.5 rounded-md text-xs border transition-colors"
                style="border-color: var(--border); color: var(--text-secondary)">
          Reset
        </button>
        <!-- AI Mentor toggle -->
        <button (click)="rightPanel.set(rightPanel() === 'mentor' ? 'output' : 'mentor')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors"
                [style.background]="rightPanel() === 'mentor' ? 'var(--accent)' : 'transparent'"
                [style.color]="rightPanel() === 'mentor' ? 'white' : 'var(--text-secondary)'"
                [style.borderColor]="rightPanel() === 'mentor' ? 'var(--accent)' : 'var(--border)'">
          ✦ AI Mentor
        </button>
      </div>

      <!-- Main split pane -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Editor (left) -->
        <div class="flex-1 overflow-hidden">
          <tf-monaco-editor #editor [value]="code" language="typescript"
            (valueChange)="code = $event">
          </tf-monaco-editor>
        </div>

        <!-- Right panel (output or mentor) -->
        <div class="w-80 shrink-0 border-l flex flex-col"
             style="background: var(--bg-surface); border-color: var(--border)">

          @if (rightPanel() === 'output') {
            <!-- Status bar -->
            <div class="flex items-center gap-2 px-3 py-2 border-b text-xs"
                 style="border-color: var(--border)">
              @if (compiler.lastResult(); as r) {
                <span class="w-2 h-2 rounded-full"
                      [style.background]="r.success ? 'var(--success)' : 'var(--danger)'"></span>
                <span [style.color]="r.success ? 'var(--success)' : 'var(--danger)'">
                  {{ r.success ? 'No errors' : r.errors.length + ' error(s)' }}
                </span>
                <span class="ml-auto" style="color: var(--text-muted)">{{ r.elapsed }}ms</span>
              } @else {
                <span style="color: var(--text-muted)">Ready — press ▶ Run</span>
              }
            </div>

            <!-- Diagnostics -->
            <div class="flex-1 overflow-auto p-3 space-y-2">
              @if (compiler.lastResult(); as r) {
                @for (err of r.errors; track $index) {
                  <div class="rounded-md p-2 text-xs border"
                       style="background: #ef444410; border-color: #ef444440; color: var(--danger)">
                    <div class="font-mono">TS{{ err.code }}</div>
                    <div class="mt-0.5 leading-relaxed" style="color: var(--text-primary)">{{ err.message }}</div>
                    @if (err.line) {
                      <div class="mt-1" style="color: var(--text-muted)">Line {{ err.line }}, col {{ err.column }}</div>
                    }
                  </div>
                }
                @for (w of r.warnings; track $index) {
                  <div class="rounded-md p-2 text-xs border"
                       style="background: #f59e0b10; border-color: #f59e0b40; color: var(--warning)">
                    <div class="font-mono">TS{{ w.code }}</div>
                    <div class="mt-0.5" style="color: var(--text-primary)">{{ w.message }}</div>
                  </div>
                }
                @if (r.success && r.errors.length === 0 && r.warnings.length === 0) {
                  <div class="text-xs p-2 rounded-md"
                       style="background: #22c55e10; color: var(--success)">
                    ✓ Compilation successful — {{ r.elapsed }}ms
                  </div>
                }
              }
            </div>
          } @else {
            <tf-ai-mentor-panel
              [code]="code"
              [errors]="currentErrors()"
              mode="playground"
              class="flex flex-col flex-1 overflow-hidden">
            </tf-ai-mentor-panel>
          }
        </div>
      </div>
    </div>
  `,
})
export class PlaygroundComponent {
  @ViewChild('editor') editorRef!: MonacoEditorComponent;
  compiler = inject(CompilerService);

  code = STARTER;
  strict = true;
  rightPanel = signal<'output' | 'mentor'>('output');

  currentErrors() {
    return this.compiler.lastResult()?.errors ?? [];
  }

  run() {
    this.compiler.compileAndStore(this.code, this.strict);
  }

  reset() {
    this.code = STARTER;
    this.editorRef?.setValue(STARTER);
    this.compiler.lastResult.set(null);
  }
}
