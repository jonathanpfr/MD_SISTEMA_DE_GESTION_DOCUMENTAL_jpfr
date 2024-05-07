import { IPagination } from "@dispatch-commons/interfaces";

export interface ISupplierSearchRequest {
  documentType?: string;
  documentValue?: string;
  status?: string;
  name?: string;
  year?: number;
  pagination: {
    page: number;
    pageSize: number;
  }
}

export interface ISupplierSearchResponse {
  data: ISupplierSearchItem[];
  pagination: IPagination
}

export interface ISupplierSearchItem {
  idProveedor: number;
  razonSocial: string;
  nroDocumento: string;
  estado: string;
}