import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TRACKS } from '@typeforge/shared/constants';

const TRACK_TOPICS: Record<string, string[]> = {
  beginner:     ['Variables & Types', 'Functions', 'Interfaces', 'Unions & Intersections', 'Enums', 'Type Narrowing'],
  intermediate: ['Generics', 'Function Overloads', 'Utility Types', 'Mapped Types', 'Index Signatures', 'Declaration Merging'],
  advanced:     ['Conditional Types', 'Template Literal Types', 'Recursive Types', 'Variance', 'Infer Keyword', 'Distributive Types'],
  expert:       ['Type-Level Programming', 'Compiler Internals', 'DSL Creation', 'Advanced Inference', 'Type Gymnastics', 'Performance'],
  enterprise:   ['Angular Patterns', 'NestJS DI', 'Prisma & Zod', 'tRPC Contracts', 'Monorepo Typing', 'API Design'],
};

@Component({
  selector: 'tf-learn',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-4xl">
      <h1 class="text-2xl font-bold mb-2" style="color: var(--text-primary)">Learning Tracks</h1>
      <p class="text-sm mb-8" style="color: var(--text-secondary)">
        Structured progression from beginner to enterprise-grade TypeScript engineer.
      </p>

      <div class="space-y-4">
        @for (track of tracks; track track.id; let i = $index) {
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
                  {{ topics[track.id].length }} topics · varies by level
                </div>
              </div>
              <a [routerLink]="['/challenges']" [queryParams]="{ track: track.id }"
                 class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                 style="border-color: var(--border); color: var(--text-secondary)"
                 onmouseenter="this.style.color='var(--text-primary)'" onmouseleave="this.style.color='var(--text-secondary)'">
                View Challenges →
              </a>
            </div>

            <!-- Topics -->
            <div class="p-4 grid grid-cols-3 gap-2">
              @for (topic of topics[track.id]; track topic; let j = $index) {
                <div class="flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg"
                     style="background: var(--bg-elevated)">
                  <span class="w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0"
                        [style.background]="track.color + '30'"
                        [style.color]="track.color">{{ j + 1 }}</span>
                  <span style="color: var(--text-secondary)">{{ topic }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class LearnComponent {
  tracks = TRACKS;
  topics = TRACK_TOPICS;
}
