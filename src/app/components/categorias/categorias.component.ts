import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { Category } from '../../interfaces/category'; // Asegúrate que el archivo existe

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, NgForOf, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { name: '', description: '' };
  editingCategory: boolean = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err: any) => {
        console.error('Error al obtener categorías:', err);
      }
    });
  }

  addCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (category: Category) => {
        this.categories.push(category);
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Error al agregar categoría:', err);
      }
    });
  }

  editCategory(category: Category): void {
    this.newCategory = { ...category };
    this.editingCategory = true;
  }

  updateCategory(): void {
    if (this.newCategory._id) {
      this.categoryService.updateCategory(this.newCategory._id, this.newCategory).subscribe({
        next: (updatedCategory: Category) => {
          const index = this.categories.findIndex((c) => c._id === updatedCategory._id);
          if (index > -1) {
            this.categories[index] = updatedCategory;
          }
          this.resetForm();
        },
        error: (err: any) => {
          console.error('Error al actualizar categoría:', err);
        }
      });
    }
  }

  deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c._id !== categoryId);
      },
      error: (err: any) => {
        console.error('Error al eliminar categoría:', err);
      }
    });
  }

  resetForm(): void {
    this.newCategory = { name: '', description: '' };
    this.editingCategory = false;
  }
}
