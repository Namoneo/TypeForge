import * as Sentry from '@sentry/angular';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const sentryDsn = (window as any).__SENTRY_DSN__ as string | undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    tracesSampleRate: 0.2,
    integrations: [Sentry.browserTracingIntegration()],
  });
}

bootstrapApplication(App, appConfig)
  .catch((err) => {
    Sentry.captureException(err);
    console.error(err);
  });
