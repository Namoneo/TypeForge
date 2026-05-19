import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild,
  Input, Output, EventEmitter, AfterViewInit, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

declare const require: any;

@Component({
  selector: 'tf-monaco-editor',
  standalone: true,
  imports: [CommonModule],
  template: `<div #editorHost class="monaco-container"></div>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .monaco-container { width: 100%; height: 100%; }
  `],
})
export class MonacoEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: true }) editorHost!: ElementRef<HTMLDivElement>;
  @Input() value = '';
  @Input() language = 'typescript';
  @Input() readOnly = false;
  @Output() valueChange = new EventEmitter<string>();

  private editor: any;
  private monaco: any;

  async ngAfterViewInit() {
    this.monaco = await this.loadMonaco();
    this.createEditor();
  }

  private async loadMonaco(): Promise<any> {
    if ((window as any).monaco) return (window as any).monaco;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs/loader.min.js';
      script.onload = () => {
        const req = (window as any).require;
        req.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs' } });
        req(['vs/editor/editor.main'], (monaco: any) => {
          // Configure TypeScript defaults
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2022,
            strict: true,
            noImplicitAny: true,
            strictNullChecks: true,
          });
          resolve(monaco);
        });
      };
      document.head.appendChild(script);
    });
  }

  private createEditor() {
    this.editor = this.monaco.editor.create(this.editorHost.nativeElement, {
      value: this.value,
      language: this.language,
      theme: 'vs-dark',
      readOnly: this.readOnly,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontLigatures: true,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      padding: { top: 16, bottom: 16 },
      suggest: { preview: true },
      scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
    });

    this.editor.onDidChangeModelContent(() => {
      this.valueChange.emit(this.editor.getValue());
    });
  }

  setValue(code: string) {
    if (this.editor) this.editor.setValue(code);
  }

  getValue(): string {
    return this.editor?.getValue() ?? '';
  }

  ngOnDestroy() {
    this.editor?.dispose();
  }
}
