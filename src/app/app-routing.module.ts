import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './com/annaniks/lift/core/guards/auth.guard';


const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./com/annaniks/lift/pages/main/main.module')
      .then(m => m.MainModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./com/annaniks/lift/pages/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./com/annaniks/lift/pages/not-found/not-found.module')
      .then(m => m.NotFoundModule)
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
