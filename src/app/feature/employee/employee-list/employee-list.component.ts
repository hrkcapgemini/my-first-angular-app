import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { EmployeeActions } from '../store/employee.actions';
import { selectAllEmployees, selectEmployeesError, selectEmployeesLoading } from '../store/employee.selectors';
import type { EmployeesState } from '../store/employee.state';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  private readonly store = inject(Store<{ employees: EmployeesState }>);

  // Selectors are the read side of NgRx. Signals keep the template reactive:
  // a reducer update automatically causes the matching view to refresh.
  readonly employees = this.store.selectSignal(selectAllEmployees);
  readonly loading = this.store.selectSignal(selectEmployeesLoading);
  readonly error = this.store.selectSignal(selectEmployeesError);

  refreshEmployees(): void {
    // Dispatch an intention; the load effect performs the actual read.
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  selectEmployee(id: string): void {
    // Selection is local store state, so no persistence effect is needed.
    this.store.dispatch(EmployeeActions.setSelectedEmployee({ id }));
  }

  deleteEmployee(id: string): void {
    // The delete effect persists the change and emits a success action.
    this.store.dispatch(EmployeeActions.deleteEmployee({ id }));
  }
}
