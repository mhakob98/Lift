import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/com/annaniks/lift/pages/main.module')
      .then(m => m.MainModule)
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
  {
    path: 'not-found',
    loadChildren: () => import('src/app/com/annaniks/lift/pages/not-found/not-found.module').then(m => m.NotFoundModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
