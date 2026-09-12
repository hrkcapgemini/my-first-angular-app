import { Injectable } from '@angular/core';
import type { Employee } from '../models/employee.model';

const EMPLOYEES_STORAGE_KEY = 'employees';

@Injectable({ providedIn: 'root' })
export class EmployeeLocalStorageService {
  private readonly seedEmployees: Employee[] = [
    {
      id: 'emp-1',
      firstName: 'Ava',
      lastName: 'Morgan',
      email: 'ava.morgan@example.com',
      department: 'Engineering',
      position: 'Frontend Developer',
      salary: 85000,
    },
  ];

  getEmployees(): Employee[] {
    // This service owns browser persistence. NgRx effects call it; components
    // and reducers stay independent from localStorage.
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const saved = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (!saved) {
      this.saveEmployees(this.seedEmployees);
      return [...this.seedEmployees];
    }

    try {
      return JSON.parse(saved) as Employee[];
    } catch {
      this.saveEmployees([]);
      return [];
    }
  }

  saveEmployees(employees: Employee[]): void {
    // localStorage only stores strings, so the typed array is serialized here.
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  }

  addEmployee(employee: Employee): Employee {
    const employees = this.getEmployees();
    this.saveEmployees([...employees, employee]);
    return employee;
  }

  updateEmployee(employee: Employee): Employee {
    const employees = this.getEmployees().map((item) => item.id === employee.id ? employee : item);
    this.saveEmployees(employees);
    return employee;
  }

  deleteEmployee(id: string): string {
    this.saveEmployees(this.getEmployees().filter((employee) => employee.id !== id));
    return id;
  }
}
