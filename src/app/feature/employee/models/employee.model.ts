export interface Employee {
  // The entity stored in NgRx and persisted by the local-storage service.
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
}

export type EmployeeFormValue = Omit<Employee, 'id'>;
