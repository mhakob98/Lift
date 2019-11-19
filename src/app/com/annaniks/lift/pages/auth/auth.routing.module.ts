

// Angular Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Our Components
import {
  SignUpComponent,
  LoginComponent,
  ForgetPasswordComponent
} from './components/index';


const authRoutes: Routes = [
  { path: '', redirectTo: '/auth/signup', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: ForgetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
  static components = [
    SignUpComponent,
    LoginComponent,
    ForgetPasswordComponent
  ]
}
