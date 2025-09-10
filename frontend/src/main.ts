import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import ptBrExtra from '@angular/common/locales/extra/pt';

registerLocaleData(ptBr, 'pt-BR', ptBrExtra);

bootstrapApplication(App, appConfig).catch(console.error);
