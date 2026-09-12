import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Employee } from '../models/employee.model';

export const EmployeeActions = createActionGroup({
  source: 'Employee',
  events: {
    // Commands express intent. Effects listen for commands, while reducers
    // listen for the resulting success/failure actions to update state.
    'Load Employees': emptyProps(),
    'Load Employees Success': props<{ employees: Employee[] }>(),
    'Load Employees Failure': props<{ error: string }>(),
    'Create Employee': props<{ employee: Employee }>(),
    'Create Employee Success': props<{ employee: Employee }>(),
    'Create Employee Failure': props<{ error: string }>(),
    'Update Employee': props<{ employee: Employee }>(),
    'Update Employee Success': props<{ employee: Employee }>(),
    'Update Employee Failure': props<{ error: string }>(),
    'Delete Employee': props<{ id: string }>(),
    'Delete Employee Success': props<{ id: string }>(),
    'Delete Employee Failure': props<{ error: string }>(),
    'Set Selected Employee': props<{ id: string | null }>(),
  },
});
