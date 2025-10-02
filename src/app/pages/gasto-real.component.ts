// El archivo ha sido eliminado completamente.
      [mostrarSelectorAno]="false"
      [mostrarTasasConversion]="false"
      [labelCargaArchivo]="'Cargar Excel de Gastos Reales'"
      [opcionesAno]="[
        { value: '2025', label: '2025' },
        { value: '2024', label: '2024' }
      ]"
      [selectedMonth]="selectedMonth"
      [isLoading]="isLoading"
      [uploadMessage]="uploadMessage"
      [uploadSuccess]="uploadSuccess"
      [validationErrors]="validationErrors"
      [excelData]="excelData"
      [onDownloadTemplate]="downloadGastoRealTemplate"
      (fileSelected)="onFileSelected($event)"
    ></app-importar-gastos>
  `
})
export class GastoRealPageComponent implements OnInit, OnDestroy {
// Archivo eliminado. No debe contener código.

  constructor(private excelService: ExcelService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.excelService.getAnnualPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.excelData = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos para personalizar bullet points
  toggleBulletPoints(): void {
    this.mostrarBulletPoints = !this.mostrarBulletPoints;
  }

  setBulletPoints(puntos: string[]): void {
    this.bulletPointsPersonalizados = puntos;
  }

  agregarBulletPoint(punto: string): void {
    this.bulletPointsPersonalizados.push(punto);
  }

  eliminarBulletPoint(indice: number): void {
    if (indice >= 0 && indice < this.bulletPointsPersonalizados.length) {
      this.bulletPointsPersonalizados.splice(indice, 1);
    }
  }

  // Función personalizada para descargar la plantilla de gastos reales
  downloadGastoRealTemplate = () => {
    // Crear solo los encabezados sin datos de ejemplo
    const headers = [
    'País',
    'Razón Social',
    'CeCo',
    'Cuenta',
// Archivo eliminado. No debe contener código.
        this.uploadSuccess = false;
        this.isLoading = false;
        return;
      }

      // Procesar filas según el template de Gastos Reales
      const processedData: ExcelRow[] = [];
      const errors: string[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.every(cell => !cell || cell.toString().trim() === '')) continue;

        try {
          // Mapear los valores según el encabezado
          const getValue = (col: string) => {
            const idx = headers.indexOf(col);
            return idx !== -1 ? row[idx] : '';
          };

          // Validar campos requeridos de texto
          const basicTextFields = ['País', 'Razón Social', 'CeCo', 'Cuenta', 'Moneda', 'Glosa'];
          for (const col of basicTextFields) {
            const value = getValue(col);
            if (!value || value.toString().trim() === '') {
              throw new Error(`El campo "${col}" es requerido`);
            }
          }

          // Validar y procesar monto (campo requerido numérico)
          let monto = getValue('Monto');
          if (!monto && monto !== 0) {
            throw new Error('El campo "Monto" es requerido');
          }
          monto = typeof monto === 'number'
            ? monto
            : parseFloat(monto.toString().replace(/[^\d.-]/g, ''));
          if (isNaN(monto)) {
            throw new Error('El campo "Monto" debe ser un número válido');
          }

          // Validar que el monto sea mayor que 0
          if (monto <= 0) {
            throw new Error('El monto debe ser mayor que 0');
          }

          processedData.push({
            pais: getValue('País').toString().trim(),
            razonSocial: getValue('Razón Social').toString().trim(),
            ceco: getValue('CeCo').toString().trim(),
            cuenta: getValue('Cuenta').toString().trim(),
            areaPlanifica: '',
            recurso: '',
            localidadFisica: getValue('Glosa').toString().trim(), // Usar Glosa como localidad física
            tarifa: 0,
            moneda: getValue('Moneda').toString().trim(),
            planEnero: 0,
            planFebrero: 0,
            planMarzo: 0,
            planAbril: 0,
            planMayo: 0,
            planJunio: 0,
            planJulio: 0,
            planAgosto: 0,
            planSeptiembre: 0,
            planOctubre: 0,
            planNoviembre: 0,
            planDiciembre: monto // Poner el monto en diciembre para que se vea en el grid
          });
        } catch (error) {
          errors.push(`Fila ${i + 1}: ${error}`);
        }
      }

      this.excelData = processedData;
      this.validationErrors = errors;

      if (processedData.length === 0) {
        this.uploadMessage = 'No se encontraron datos válidos en el archivo';
        this.uploadSuccess = false;
        this.isLoading = false;
        return;
      }

      this.excelService.uploadData(processedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (responses) => {
            this.uploadMessage = `Se importaron ${responses.length} registros.`;
            this.uploadSuccess = true;
            this.isLoading = false;
          },
          () => {
            this.uploadMessage = 'Error al importar los datos';
            this.uploadSuccess = false;
            this.isLoading = false;
          }
        );

    } catch (error) {
      this.uploadMessage = error instanceof Error ? error.message : 'Error al procesar el archivo';
      this.uploadSuccess = false;
      this.isLoading = false;
    }
  }
}