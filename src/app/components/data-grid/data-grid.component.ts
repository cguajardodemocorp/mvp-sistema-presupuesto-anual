import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelRow } from '../../models/excel-data.model';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-grid-container" *ngIf="data && data.length > 0">
      <div class="grid-header">
        <h3>Vista previa Plan Anual</h3>
        <span class="record-count">{{ data.length }} registros</span>
      </div>
      
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>País</th>
              <th>Razón Social</th>
              <th>CeCo</th>
              <th>Cuenta</th>
              <th>Area</th>
              <th>Recurso</th>
              <th>Localidad</th>
              <th>Tarifa</th>
              <th>Moneda</th>
              <th>Total Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of paginatedData; let i = index" class="fade-in">
              <td class="row-number">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td>{{ row.pais }}</td>
              <td>{{ row.razonSocial }}</td>
              <td>{{ row.ceco }}</td>
              <td>{{ row.cuenta }}</td>
              <td>{{ row.areaPlanifica }}</td>
              <td>{{ row.recurso }}</td>
              <td>{{ row.localidadFisica }}</td>
              <td class="amount">{{ formatAmount(row.tarifa) }}</td>
              <td>{{ row.moneda }}</td>
              <td class="amount">{{ formatAmount(getTotalPlan(row)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" *ngIf="totalPages > 1">
        <button class="pagination-btn" 
                [disabled]="currentPage === 1"
                (click)="previousPage()">
          Anterior
        </button>
        
        <span class="pagination-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button class="pagination-btn"
                [disabled]="currentPage === totalPages"
                (click)="nextPage()">
          Siguiente
        </button>
      </div>
    </div>
  `,
  styles: [`
    .data-grid-container {
      background: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .grid-header {
      padding: 20px 24px;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .grid-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0;
    }

    .record-count {
      font-size: 14px;
      color: var(--gray-600);
      background: var(--white);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--gray-200);
    }

    .table-container {
      overflow-x: auto;
      max-height: 600px;
      overflow-y: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
      box-shadow: none;
    }

    .table th {
      background: var(--gray-100);
      color: var(--gray-700);
      font-weight: 600;
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid var(--gray-200);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--gray-200);
      font-size: 14px;
    }

    .table tr:nth-child(even) {
      background: var(--gray-50);
    }

    .table tr:hover {
      background: var(--light-blue);
    }

    .row-number {
      font-weight: 600;
      color: var(--gray-500);
      width: 60px;
    }

    .amount {
      font-weight: 600;
      text-align: right;
      font-family: 'Courier New', monospace;
    }

    .pagination {
      padding: 16px 24px;
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination-btn {
      background: var(--primary-blue);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--dark-blue);
    }

    .pagination-btn:disabled {
      background: var(--gray-300);
      cursor: not-allowed;
    }

    .pagination-info {
      font-size: 14px;
      color: var(--gray-600);
    }

    @media (max-width: 768px) {
      .table-container {
        max-height: 400px;
      }
      
      .table th,
      .table td {
        padding: 8px 12px;
        font-size: 13px;
      }
      
      .grid-header {
        padding: 16px;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }
    }
  `]
})
export class DataGridComponent {
  @Input() data: ExcelRow[] = [];
  
  currentPage = 1;
  pageSize = 50;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  get paginatedData(): ExcelRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getTotalPlan(row: ExcelRow): number {
    return row.planEnero + row.planFebrero + row.planMarzo + row.planAbril +
           row.planMayo + row.planJunio + row.planJulio + row.planAgosto +
           row.planSeptiembre + row.planOctubre + row.planNoviembre + row.planDiciembre;
  }
}