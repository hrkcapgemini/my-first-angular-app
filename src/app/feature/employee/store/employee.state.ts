import type { Employee } from '../models/employee.model';

export interface EmployeesState {
  // This is the single source of truth for the employee feature in the store.
  employees: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
}

export const initialEmployeesState: EmployeesState = {
  // The reducer starts here before the first action is processed.
  employees: [],
  loading: false,
  error: null,
  selectedEmployeeId: null,
};
