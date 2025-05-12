import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/movements`; // Base URL para movimientos

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Error en el servicio de reportes', error);
    return throwError(() => new Error('Error al obtener los datos del reporte.'));
  }

  // Obtener movimientos por rango de fechas
  getMovementsByDate(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/date`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener movimientos por ID de producto
  getMovementsByProduct(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/${productId}`) // Esta URL es correcta
      .pipe(
        catchError(this.handleError)
      );
  }

 // Obtener productos con stock bajo
 getLowStockProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/low-stock`)
      .pipe(
        catchError(this.handleError)
      );
  
  }
}