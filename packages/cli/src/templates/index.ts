import type { Template, TemplateId } from '../types.js';
import { basicTemplate } from './basic.js';
import { nodeTemplate } from './node.js';
import { libraryTemplate } from './library.js';

export const templates: Record<TemplateId, Template> = {
  basic: basicTemplate,
  node: nodeTemplate,
  library: libraryTemplate,
};

export function getTemplate(id: TemplateId): Template {
  return templates[id];
}

export function listTemplates(): Template[] {
  return Object.values(templates);
}
