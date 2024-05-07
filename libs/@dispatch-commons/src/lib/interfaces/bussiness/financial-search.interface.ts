import { IPagination } from "../application/pagination.interface";

export interface IFinancialSearchResponse {
  data: IFinancialSearchItem[];
  pagination: IPagination
}

export interface IFinancialSearchItem {
  idProveedor: number;
  periodo: number;
  tipoContrato: string;
  razonSocial: string;
  ejecucion: number;
  porcentajeEjecucion: number;
}