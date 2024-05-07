import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { SupplierService } from '@dispatch-commons';
import { IFinancialSearchItem, IPagination, ISupplierSearchRequest } from '@dispatch-commons/interfaces';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { filter, finalize, merge } from 'rxjs';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-supplier-financial',
  templateUrl: './financial.component.html',
  standalone: true,
  imports: [
    DecimalPipe,
    PercentPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule,
    FilterComponent
  ],
  providers: [
    SupplierService
  ]
})
export class SupplierFinancialComponent implements OnInit, AfterViewInit {
  request!: ISupplierSearchRequest;

  displayedColumns: string[] = ['periodo', 'tipoContrato', 'razonSocial', 'ejecucion', 'porcentajeEjecucion', 'actions'];
  dataSource: IFinancialSearchItem[] = [];
  pagination: IPagination;

  readonly isLoading = signal<boolean>(false);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly supplierService = inject(SupplierService);
  readonly fuseConfirmationService = inject(FuseConfirmationService);
  readonly router = inject(Router);
  readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const request: ISupplierSearchRequest = {
      pagination: {
        page: 1,
        pageSize: 5
      }
    }

    this.loadData(request);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      merge(this.paginator.page)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value: PageEvent) => {
          const request: ISupplierSearchRequest = {
            ...this.getRequest(),
            pagination: {
              page: value.pageIndex + 1,
              pageSize: value.pageSize
            }
          }

          this.loadData(request);
        });
    }
  }

  getRequest(): ISupplierSearchRequest {
    return {
      ...this.request,
      pagination: {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      }
    };
  }

  search(event: ISupplierSearchRequest): void {
    this.request = event;
    const values: ISupplierSearchRequest = this.getRequest();
    values.pagination.page = 1;
    this.loadData(values);
  }

  loadData(request: ISupplierSearchRequest): void {
    this.isLoading.set(true);

    this.supplierService.getFinancial(request)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.dataSource = res.data;
          this.pagination = res.pagination;
        }
      })
  }

  edit(element: IFinancialSearchItem): void {
    this.router.navigateByUrl(`/proveedor/registro/${element.idProveedor}`);
  }

  delete(item: IFinancialSearchItem): void {
    const dialogRef = this.fuseConfirmationService.open({
      title: 'Eliminar',
      message: `¿Desea eliminar ${item.razonSocial}?`,
      actions: {
        confirm: {
          show: true,
          label: 'Si, eliminar',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancelar'
        }
      },
      dismissible: true
    });

    dialogRef.afterClosed()
      .pipe(filter(result => result === 'confirmed'))
      .subscribe(() => {
        console.log('Eliminar fila', item);
      });
  }
}
