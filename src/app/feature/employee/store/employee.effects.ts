import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { EmployeeLocalStorageService } from '../services/local-storage.service';
import { EmployeeActions } from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private readonly actions$ = inject(Actions);
  private readonly storage = inject(EmployeeLocalStorageService);

  // Effects are the side-effect layer. They listen to actions, call the
  // persistence service, and return a new action for the reducer to handle.
  readonly loadEmployees$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.loadEmployees),
    exhaustMap(() => {
      try {
        return of(EmployeeActions.loadEmployeesSuccess({ employees: this.storage.getEmployees() }));
      } catch {
        return of(EmployeeActions.loadEmployeesFailure({ error: 'Unable to load employees.' }));
      }
    }),
  ));

  readonly createEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.createEmployee),
    // Storage is synchronous in this demo, so the effect maps the command to
    // one success or failure action.
    map(({ employee }) => {
      try {
        return EmployeeActions.createEmployeeSuccess({ employee: this.storage.addEmployee(employee) });
      } catch {
        return EmployeeActions.createEmployeeFailure({ error: 'Unable to create employee.' });
      }
    }),
  ));

  readonly updateEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.updateEmployee),
    map(({ employee }) => {
      try {
        return EmployeeActions.updateEmployeeSuccess({ employee: this.storage.updateEmployee(employee) });
      } catch {
        return EmployeeActions.updateEmployeeFailure({ error: 'Unable to update employee.' });
      }
    }),
  ));

  readonly deleteEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.deleteEmployee),
    map(({ id }) => {
      try {
        return EmployeeActions.deleteEmployeeSuccess({ id: this.storage.deleteEmployee(id) });
      } catch {
        return EmployeeActions.deleteEmployeeFailure({ error: 'Unable to delete employee.' });
      }
    }),
  ));
}
