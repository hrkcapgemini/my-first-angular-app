import { createReducer, on } from '@ngrx/store';
import { EmployeeActions } from './employee.actions';
import { initialEmployeesState } from './employee.state';

export const employeeReducer = createReducer(
  initialEmployeesState,
  // Reducers are pure: they receive the previous state and action, then
  // return a new state object without calling services or localStorage.
  on(EmployeeActions.loadEmployees, (state) => ({ ...state, loading: true, error: null })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) => ({ ...state, employees, loading: false })),
  on(
    EmployeeActions.loadEmployeesFailure,
    EmployeeActions.createEmployeeFailure,
    EmployeeActions.updateEmployeeFailure,
    EmployeeActions.deleteEmployeeFailure,
    (state, { error }) => ({ ...state, loading: false, error }),
  ),
  on(EmployeeActions.createEmployee, EmployeeActions.updateEmployee, EmployeeActions.deleteEmployee, (state) => ({ ...state, loading: true, error: null })),
  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) => ({ ...state, employees: [...state.employees, employee], loading: false })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: state.employees.map((item) => item.id === employee.id ? employee : item),
    selectedEmployeeId: null,
    loading: false,
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) => ({
    ...state,
    employees: state.employees.filter((employee) => employee.id !== id),
    selectedEmployeeId: state.selectedEmployeeId === id ? null : state.selectedEmployeeId,
    loading: false,
  })),
  on(EmployeeActions.setSelectedEmployee, (state, { id }) => ({ ...state, selectedEmployeeId: id })),
);
