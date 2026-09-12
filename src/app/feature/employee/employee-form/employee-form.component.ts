import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import type { Employee, EmployeeFormValue } from '../models/employee.model';
import { EmployeeActions } from '../store/employee.actions';
import type { EmployeesState } from '../store/employee.state';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly store = inject(Store<{ employees: EmployeesState }>);

  @Input() employee: Employee | null = null;

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
    position: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges(): void {
    // The page passes the selected record into this component. Patching the
    // form makes the same form support both create and edit workflows.
    if (this.employee) {
      this.form.patchValue(this.employee);
    } else {
      this.resetForm(false);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as EmployeeFormValue;
    if (this.employee) {
      // Components describe user intent by dispatching actions. They do not
      // update the store or localStorage directly.
      this.store.dispatch(EmployeeActions.updateEmployee({ employee: { ...this.employee, ...value } }));
    } else {
      this.store.dispatch(EmployeeActions.createEmployee({ employee: { id: `emp-${Date.now()}`, ...value } }));
    }
    this.resetForm();
  }

  resetForm(clearSelection = true): void {
    this.form.reset({ firstName: '', lastName: '', email: '', department: '', position: '', salary: 0 });
    this.form.markAsPristine();
    if (clearSelection) {
      // Clearing the selected id makes the page switch back to create mode.
      this.store.dispatch(EmployeeActions.setSelectedEmployee({ id: null }));
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}
