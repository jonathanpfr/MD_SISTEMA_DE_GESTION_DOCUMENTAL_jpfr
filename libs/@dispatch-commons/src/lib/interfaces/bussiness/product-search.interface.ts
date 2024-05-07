import { IPagination } from "../application/pagination.interface";

export interface IProductSearchResponse {
  data: IProductSearchItem[];
  pagination: IPagination
}

export interface IProductSearchItem {
  idProveedor: number;
  periodo: string;
  tipoContrato: string;
  razonSocial: string;
  ejecucion: number;
  porcentajeEjecucion: number;
}