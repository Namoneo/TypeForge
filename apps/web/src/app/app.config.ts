import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AppStore } from './core/store/app.store';
import { errorInterceptor } from './core/interceptors/error.interceptor';

function hydrateAuth(store: AppStore) {
  return () => store.hydrateFromStorage();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([errorInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: hydrateAuth,
      deps: [AppStore],
      multi: true,
    },
  ],
};
