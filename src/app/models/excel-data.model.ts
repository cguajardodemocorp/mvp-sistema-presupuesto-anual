export interface ExcelRow {
  pais: string;
  razonSocial: string;
  cuenta: string;
  ceco: string;
  moneda: string;
  monto: number;
  glosa: string;
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