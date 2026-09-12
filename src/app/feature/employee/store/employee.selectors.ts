import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { EmployeesState } from './employee.state';

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');
// Selectors are reusable, memoized queries. Components read these values
// instead of reaching into the store shape or copying state themselves.
export const selectAllEmployees = createSelector(selectEmployeesState, (state) => state.employees);
export const selectEmployeesLoading = createSelector(selectEmployeesState, (state) => state.loading);
export const selectEmployeesError = createSelector(selectEmployeesState, (state) => state.error);
export const selectSelectedEmployee = createSelector(
  selectEmployeesState,
  (state) => state.employees.find((employee) => employee.id === state.selectedEmployeeId) ?? null,
);
