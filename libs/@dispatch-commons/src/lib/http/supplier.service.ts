import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ISupplierSearchRequest, ISupplierSearchResponse } from "../interfaces/bussiness/supplier-search.interface";
import { ISupplier } from "../interfaces/bussiness/supplier.interface";
import { IFinancialSearchResponse } from "../interfaces/bussiness/financial-search.interface";
import { IProductSearchResponse } from "../interfaces/bussiness/product-search.interface";

@Injectable()
export class SupplierService {
  private apiUrl: string;
  private readonly http = inject(HttpClient);

  constructor(@Inject('environment') environment) {
    this.apiUrl = `${environment.apiUrl}/api`;
  }

  private getParams(request: ISupplierSearchRequest) {
    return new HttpParams()
      .set('documentType', request.documentType || '')
      .set('documentValue', request.documentValue || '')
      .set('name', request.name || '')
      .set('status', request.status || '')
      .set('year', request.year || '')
      .set('page', request.pagination.page)
      .set('pageSize', request.pagination.pageSize);
  }

  getSuppliers(request: ISupplierSearchRequest): Observable<ISupplierSearchResponse> {
    const params = this.getParams(request);
    return this.http.get<ISupplierSearchResponse>(`${this.apiUrl}/suppliers/search`, { params });
  }

  getSupplier(id: number): Observable<ISupplier> {
    return this.http.get<ISupplier>(`${this.apiUrl}/suppliers/${id}`);
  }

  getFinancial(request: ISupplierSearchRequest): Observable<IFinancialSearchResponse> {
    const params = this.getParams(request);
    return this.http.get<IFinancialSearchResponse>(`${this.apiUrl}/suppliers/financial`, { params });
  }

  getProducts(request: ISupplierSearchRequest): Observable<IProductSearchResponse> {
    const params = this.getParams(request);
    return this.http.get<IProductSearchResponse>(`${this.apiUrl}/suppliers/products`, { params });
  }
}