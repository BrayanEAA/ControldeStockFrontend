import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgForOf } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgForOf, CurrencyPipe, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categorias: Category[] = [];
  newProduct: Product = { name: '', description: '', category: '', stock: 0, price: 0 };
  loading: boolean = false;
  editing: boolean = false;

  categoriaSeleccionada: string = '';
  onlyLowStock: boolean = false;
  mensaje: string = '';

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      }
    });
  }

  getCategoryName(category: string | Category): string {
    return typeof category === 'string' ? category : category.name;
  }

  getProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.loading = false;
      }
    });
  }
  mostrarFormulario: boolean = false;

  filtrarProductos(): void {
    this.productService.getFilteredProducts(this.categoriaSeleccionada, this.onlyLowStock)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.mensaje = data.length === 0 ? 'No se encontraron productos con los criterios seleccionados.' : '';
        },
        error: (err) => {
          console.error('Error al filtrar productos:', err);
          this.mensaje = 'Error al filtrar productos.';
        }
      });
  }

  addProduct(): void {
    if (this.editing) {
      this.productService.updateProduct(this.newProduct._id ?? '', this.newProduct).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p._id === updatedProduct._id);
          if (index > -1) this.products[index] = updatedProduct;
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
        }
      });
    } else {
      this.productService.createProduct(this.newProduct).subscribe({
        next: (product) => {
          this.products.push(product);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al agregar producto:', err);
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.newProduct = { ...product };
    this.editing = true;
  }

  resetForm(): void {
    this.newProduct = { name: '', description: '', category: '', stock: 0, price: 0 };
    this.editing = false;
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter(product => product._id !== productId);
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
      }
    });
  }
}
