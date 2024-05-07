import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeEsPE from '@angular/common/locales/es-PE';
import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { CryptoService, SessionService } from '@dispatch-commons';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { environment } from '../environments/environment';
import { InitialDataResolver } from './app.resolvers';
import { routes } from './app.routes';
import { appConfig as config } from './core/config/config';
import { CoreModule } from './core/core.module';
import { getDutchPaginatorIntl } from './core/functions/paginator-intl';
registerLocaleData(localeEsPE, 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      FuseModule,
      FuseConfigModule.forRoot(config),

      // Core module of your application
      CoreModule
    ),
    CryptoService,
    SessionService,
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimations(), // required animations providers    
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-PE' },
    InitialDataResolver,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { disableClose: true } },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
    { provide: 'environment', useValue: environment }
  ]
};
