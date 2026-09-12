import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../../header/header.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeActions } from '../store/employee.actions';
import { selectSelectedEmployee } from '../store/employee.selectors';
import type { EmployeesState } from '../store/employee.state';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, EmployeeFormComponent, EmployeeListComponent],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
})
export class EmployeePageComponent {
  private readonly store = inject(Store<{ employees: EmployeesState }>);
  @ViewChild(EmployeeFormComponent) private employeeForm?: EmployeeFormComponent;

  // selectSignal turns the selector result into a signal that the template can
  // read with selectedEmployee(). The selector returns the full selected record.
  readonly selectedEmployee = this.store.selectSignal(selectSelectedEmployee);

  constructor() {
    // The page starts the read workflow. The effect handles localStorage and
    // dispatches either Load Employees Success or Load Employees Failure.
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  hasUnsavedChanges(): boolean {
    return this.employeeForm?.hasUnsavedChanges() ?? false;
  }
}
