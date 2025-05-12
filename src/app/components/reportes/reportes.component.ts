import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/Report.Service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

interface MovimientoConNombre {
  _id: string;
  product: string;
  type: string;
  quantity: number;
  date: string;
  note: string;
  productName?: string; // Propiedad para almacenar el nombre del producto
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, NgForOf, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  movimientosPorFecha: MovimientoConNombre[] = [];
  movimientosPorProducto: any[] = [];
  productosConStockBajo: any[] = [];
  startDate: string = '';
  endDate: string = '';
  selectedProductId: string = '';
  productos: any[] = [];
  errorMessage: string = '';

  constructor(
    private reportService: ReportService,
    private productService: ProductService // Inyecta el servicio de productos
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.getProducts()
      .pipe(
        catchError(error => {
          console.error('Error al cargar productos:', error);
          this.errorMessage = 'Error al cargar la lista de productos.';
          return of([]); // En caso de error, devuelve un array vacío
        })
      )
      .subscribe(productos => {
        this.productos = productos;
      });
  }

  obtenerMovimientosPorFecha(): void {
    const startDateObj = this.startDate ? new Date(this.startDate + 'T00:00:00Z') : null;
    const formattedStartDate = startDateObj ? startDateObj.toISOString() : '';

    const endDateObj = this.endDate ? new Date(this.endDate + 'T23:59:59Z') : null;
    const formattedEndDate = endDateObj ? endDateObj.toISOString() : '';

    this.reportService.getMovementsByDate(formattedStartDate, formattedEndDate)
      .pipe(
        map(movimientos => {
          console.log('Movimientos recibidos del servicio:', movimientos);
          return movimientos.map(movimiento => ({
            ...movimiento,
            productName: movimiento.product ? movimiento.product.name : 'Nombre no encontrado'
          }));
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Datos finales de movimientos con nombres:', data);
          this.movimientosPorFecha = data as MovimientoConNombre[];
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.movimientosPorFecha = [];
        }
      });
  }
  

  obtenerMovimientosPorProducto(): void {
    if (this.selectedProductId) {
      this.reportService.getMovementsByProduct(this.selectedProductId)
        .pipe(
          map(movimientos => movimientos.map(movimiento => ({
            ...movimiento,
            productName: movimiento.product?.name || 'Nombre no disponible' // Accede correctamente al nombre del producto
          })))
        )
        .subscribe({
          next: (data) => {
            this.movimientosPorProducto = data;
            this.errorMessage = '';
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.movimientosPorProducto = [];
          }
        });
    } else {
      this.errorMessage = 'Por favor, selecciona un producto.';
    }
  }

  obtenerProductosConStockBajo(): void {
    this.reportService.getLowStockProducts()
      .subscribe({
        next: (data) => {
          this.productosConStockBajo = data;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.productosConStockBajo = [];
        }
      });
  }
}
