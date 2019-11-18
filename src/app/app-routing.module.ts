import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/com/annaniks/lift/pages/main.module')
      .then(m => m.MainModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/com/annaniks/lift/pages/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('src/app/com/annaniks/lift/pages/not-found/not-found.module')
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
