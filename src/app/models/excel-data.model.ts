export interface ExcelRow {
  pais: string;
  razonSocial: string;
  ceco: string;
  cuenta: string;
  areaPlanifica: string;
  recurso: string;
  localidadFisica: string;
  tarifa: number;
  moneda: string;
  planEnero: number;
  planFebrero: number;
  planMarzo: number;
  planAbril: number;
  planMayo: number;
  planJunio: number;
  planJulio: number;
  planAgosto: number;
  planSeptiembre: number;
  planOctubre: number;
  planNoviembre: number;
  planDiciembre: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: ExcelRow[];
  errors?: string[];
}

export interface FileValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}