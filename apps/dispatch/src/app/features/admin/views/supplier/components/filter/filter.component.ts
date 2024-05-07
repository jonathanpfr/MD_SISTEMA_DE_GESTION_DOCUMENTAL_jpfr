import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IValueDescription } from '@dispatch-commons/interfaces';
import { DOCUMENT_TYPES, STATES_SUPPLIER } from '../../../../core/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class FilterComponent {
  form!: FormGroup;
  documents: IValueDescription[] = DOCUMENT_TYPES;
  states: IValueDescription[] = STATES_SUPPLIER;
  years: number[] = this.createArrayYears(5);

  readonly onFilter = output<any>();
  readonly fb = inject(FormBuilder);

  constructor() {
    this.builder();
  }

  builder(): void {
    this.form = this.fb.group({
      documentType: '',
      documentValue: '',
      status: '',
      name: '',
      year: ''
    });

    this.form.addValidators(this.fnValidators());
  }

  fnValidators(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const documentValueControl = group.get('documentValue');

      documentValueControl.setErrors(null);

      if (group.get('documentType').value) {
        if (!documentValueControl.value) {
          documentValueControl.setErrors({ required: true });
        }
      }

      return null;
    }
  }

  createArrayYears(length: number): Array<number> {
    return Array.from({ length }).map((_, i) => new Date().getFullYear() - i);
  }

  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    const values = this.form.getRawValue();
    this.onFilter.emit(values);
  }

  clear(): void {
    this.form.reset({
      documentType: '',
      documentValue: '',
      status: '',
      name: '',
      year: ''
    });

    this.form.markAsUntouched();
  }
}
