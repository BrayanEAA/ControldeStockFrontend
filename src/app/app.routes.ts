import { Routes } from '@angular/router';
import { ProductsComponent } from './components/productos/productos.component';
import { CategoriesComponent } from './components/categorias/categorias.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { ReportesComponent } from './components/reportes/reportes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductsComponent },
  { path: 'categorias', component: CategoriesComponent },
  { path: 'movimientos', component: MovimientosComponent },
  { path: 'reportes', component: ReportesComponent }
];
