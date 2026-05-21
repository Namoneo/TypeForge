import { AskMentorDto, MentorQueryType } from './ai-mentor.dto';

export const AI_MENTOR_SYSTEM_PROMPT = `You are an expert TypeScript mentor and teacher embedded in TypeForge, an interactive TypeScript learning platform. You help developers learn and master TypeScript through clear, practical explanations.

Your teaching style:
- Be concise but thorough — respect the developer's time
- Use concrete code examples with \`\`\`typescript code blocks when helpful
- Explain the "why" not just the "what"
- For errors: explain root cause, not just the symptom, and show the corrected code
- For hints: guide without revealing the full solution — ask leading questions
- For code reviews: highlight strengths and suggest specific improvements
- For concepts: start with a one-line definition, then build up with examples

You are expert in TypeScript 5.x including:
- Type system: generics, conditional types, mapped types, template literal types, infer
- Utility types: Readonly, Partial, Required, Record, Pick, Omit, Extract, Exclude, ReturnType, etc.
- Advanced patterns: discriminated unions, branded types, type narrowing, satisfies operator
- Decorators, declaration files, project references, module resolution
- Integration with Angular, NestJS, Prisma, Zod, and tRPC ecosystems`;

export function buildMentorUserMessage(dto: AskMentorDto): string {
  switch (dto.type) {
    case MentorQueryType.EXPLAIN_ERRORS:
      return [
        'I have this TypeScript code with errors. Please explain what is wrong and how to fix it.\n',
        '**Code:**',
        '```typescript',
        dto.code,
        '```\n',
        '**Errors:**',
        (dto.errors ?? [])
          .map(
            (e) =>
              `- TS${e.code}: ${e.message}${e.line ? ` (line ${e.line})` : ''}`,
          )
          .join('\n') || '(no specific errors listed)',
      ].join('\n');

    case MentorQueryType.REVIEW_CODE:
      return [
        'Please review this TypeScript code and give feedback on correctness, type safety, and best practices.\n',
        '**Code:**',
        '```typescript',
        dto.code,
        '```',
        dto.context ? `\n**Context:** ${dto.context}` : '',
      ].join('\n');

    case MentorQueryType.HINT:
      return [
        'I am working on this TypeScript challenge and need a hint. Please do NOT give me the full solution — guide me with a nudge.\n',
        `**Challenge:** ${dto.context ?? 'Unknown'}`,
        '\n**My current code:**',
        '```typescript',
        dto.code,
        '```',
      ].join('\n');

    case MentorQueryType.EXPLAIN_CONCEPT:
      return `Please explain this TypeScript concept with clear examples: **${dto.context ?? dto.code}**`;

    default:
      return `Help me with this TypeScript code:\n\n\`\`\`typescript\n${dto.code}\n\`\`\``;
  }
}
