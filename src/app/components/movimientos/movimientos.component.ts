import { Component, OnInit } from '@angular/core';
import { StockMovementService } from '../../services/stockMovement.service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';

// Interfaz Movement que coincide con el backend (campo 'product')
interface Movement {
  _id?: string;
  product: string; // <-- Campo 'product' para coincidir con el backend
  type: 'entrada' | 'salida';
  quantity: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, NgForOf, FormsModule],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})

export class MovimientosComponent implements OnInit {
  movements: any[] = [];
  products: any[] = [];

  // 'movement' ahora usa el campo 'product'
  movement: Movement = { product: '', type: 'entrada', quantity: 0 };

  errorMessage = '';

  constructor(
    private stockMovementService: StockMovementService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getMovements();
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.errorMessage = 'No se pudieron obtener los productos.';
      }
    });
  }

  getMovements(): void {
    this.stockMovementService.getMovements().subscribe({
      next: (data) => {
        this.movements = data;
      },
      error: (err) => {
        console.error('Error al obtener movimientos:', err);
        this.errorMessage = 'No se pudo obtener el historial de movimientos.';
      }
    });
  }

  addMovement(): void {
    if (!this.movement.product || this.movement.quantity <= 0) {
      this.errorMessage = 'Por favor, selecciona un producto y una cantidad válida.';
      return;
    }

    // El payload ahora usa 'product'
    this.stockMovementService.createMovement(this.movement).subscribe({
      next: (response) => {
        this.movements.push(response.movimiento);
        this.getMovements();
        this.movement = { product: '', type: 'entrada', quantity: 0 };
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error al registrar movimiento:', err);
        this.errorMessage = 'Hubo un error al registrar el movimiento.';
      }
    });
  }
}