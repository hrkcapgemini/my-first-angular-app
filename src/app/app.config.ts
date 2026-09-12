import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { EmployeeEffects } from './feature/employee/store/employee.effects';
import { employeeReducer } from './feature/employee/store/employee.reducer';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    // Register the feature reducer under the "employees" state key. Selectors
    // use this same key when reading employee state from the global store.
    provideStore({ employees: employeeReducer }),
    // Register effects so dispatched employee actions can trigger persistence
    // work and then dispatch success or failure actions.
    provideEffects(EmployeeEffects),
  ],
};
