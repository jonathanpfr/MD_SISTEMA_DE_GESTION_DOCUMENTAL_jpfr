import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from "@angular/material/tabs";
import { Subject, finalize, of, takeUntil } from 'rxjs';
import { AutocompleteComponent } from '../../components/autocomplete/autocomplete.component';
import { RegisterFilterComponent } from './components/filter/filter.component';
import { SupplierService } from '@dispatch-commons';
import { ISupplierSearchRequest } from '@dispatch-commons/interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-supplier-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    RegisterFilterComponent,
    AutocompleteComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    SupplierService
  ]
})
export class SupplierRegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  countries: any = [];
  readonly isEdit = signal<boolean>(false);
  readonly multipleResults = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly supplierService = inject(SupplierService);
  readonly fb = inject(FormBuilder);
  readonly activatedRoute = inject(ActivatedRoute);

  readonly destroy$ = new Subject<void>();

  constructor() {
    this.builder();
  }

  ngOnInit(): void {
    this.getCountries();

    const id = +this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit.set(true);
      this.getSupplier(id);
    }
  }

  builder(): void {
    this.form = this.fb.group({
      idProveedor: '',
      tipoDocumento: '',
      nroDocumento: [{ value: '', disabled: true }],
      apePaterno: [{ value: '', disabled: true }],
      apeMaterno: [{ value: '', disabled: true }],
      nombres: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      telefono: '',
      celular: '',
      correo: '',
      estado: '',
      idPais: '',
      pais: '',
      idDepartamento: '',
      departamento: '',
      idProvincia: '',
      provincia: '',
      idDistrito: '',
      distrito: '',
      direccionSunat: [{ value: '', disabled: true }],
      direccionOpcional: '',
      paisControl: null,
      departamentoControl: null,
      provinciaControl: null,
      distritoControl: null,
    });
  }

  search(event): void {
    const request: ISupplierSearchRequest = {
      ...event,
      pagination: {
        page: 1,
        pageSize: 10
      }
    };

    this.multipleResults.set(false);
    this.isLoading.set(true);

    this.supplierService.getSuppliers(request)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: res => {
          if (res.data.length == 1) {
            this.getSupplier(res.data[0].idProveedor);
          }

          this.multipleResults.set(res.data.length > 1);
        }
      });
  }

  onAutocomplete(event): void {
    this.getSupplier(event.value);
  }

  onClear(event): void {
    this.multipleResults.set(false);
  }

  getSupplier(id: number): void {
    this.isLoading.set(true);

    this.supplierService.getSupplier(id)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: res => {
          this.form.patchValue({
            ...res
          });
        }
      })
  }

  getCountries() {
    of([
      { idPais: 'PE', pais: 'Perú' },
      { idPais: 'BR', pais: 'Brasil' },
    ]).subscribe({
      next: res => {
        this.countries = res;
      }
    })
  }

  selectedCountry(event: any): void {
    this.form.patchValue({
      idPais: event.value,
      pais: event.label
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
