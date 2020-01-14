// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthRoutingModule } from './auth.routing.module';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthRoutingModule.components
  ],
  providers: [AuthService]
})
export class AuthModule { }
