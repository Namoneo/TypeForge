import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'playground', loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent) },
      { path: 'challenges', loadComponent: () => import('./features/challenges/challenges.component').then(m => m.ChallengesComponent) },
      { path: 'challenges/:id', loadComponent: () => import('./features/challenges/challenge-detail.component').then(m => m.ChallengeDetailComponent) },
      { path: 'learn', loadComponent: () => import('./features/learn/learn.component').then(m => m.LearnComponent) },
      { path: 'leaderboard', loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent) },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
