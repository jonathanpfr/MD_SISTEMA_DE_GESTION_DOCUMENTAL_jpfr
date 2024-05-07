import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SupplierService } from '@dispatch-commons';
import { IValueDescription } from '@dispatch-commons/interfaces';
import { DOCUMENT_TYPES } from 'apps/dispatch/src/app/features/admin/core/constants';
import { map } from 'rxjs';
import { AutocompleteComponent } from '../../../../components/autocomplete/autocomplete.component';

@Component({
  selector: 'app-register-filter',
  templateUrl: './filter.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AutocompleteComponent
  ],
  providers: [
    SupplierService
  ]
})
export class RegisterFilterComponent {
  form!: FormGroup;
  documents: IValueDescription[] = DOCUMENT_TYPES;
  autocompleteOptions: any = {
    fn: (value: string) => {
      return this.supplierService.getSuppliers({
        name: value,
        pagination: { page: 1, pageSize: 50 }
      }).pipe(
        map(res => res.data)
      )
    }
  }

  readonly onFilter = output<any>();
  readonly onAutocomplete = output<any>();
  readonly onClear = output<any>();

  readonly fb = inject(FormBuilder);
  readonly supplierService = inject(SupplierService);

  constructor() {
    this.builder();
  }

  builder(): void {
    this.form = this.fb.group({
      documentType: '',
      documentValue: '',
      name: '',
      nameControl: null
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

  selected(event: any): void {
    this.form.patchValue({
      name: event.label
    });

    this.onAutocomplete.emit(event);
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
      name: ''
    });

    this.form.markAsUntouched();
    this.onClear.emit(true);
  }
}
