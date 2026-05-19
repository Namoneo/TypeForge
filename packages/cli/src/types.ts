export type TemplateId = 'basic' | 'node' | 'library';

export interface ProjectConfig {
  name: string;
  template: TemplateId;
  description: string;
  author: string;
}

export interface TemplateFile {
  path: string;
  content: (config: ProjectConfig) => string;
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  files: TemplateFile[];
}
