import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface StockMovement {
  product: string; // <-- Cambiado de 'productId' a 'product'
  type: 'entrada' | 'salida';
  quantity: number;
  note?: string; // Añade 'note' si también lo envías desde el servicio
}

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
  private apiUrl = `${environment.apiUrl}/movements`;

  constructor(private http: HttpClient) {}

  createMovement(movement: StockMovement): Observable<any> {
    return this.http.post<any>(this.apiUrl, movement);
  }

  getMovements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMovementsByType(type: 'entrada' | 'salida'): Observable<any[]> { // Asegúrate de que el tipo aquí también coincida
    return this.http.get<any[]>(`${this.apiUrl}/type/${type}`);
  }
}