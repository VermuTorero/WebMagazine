import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SecurityRoutingModule } from './security-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';


@NgModule({
  declarations: [
    LoginComponent,
    UsersComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    FormsModule
  ],
  exports: [
    LoginComponent
  ]
})
export class SecurityModule { }
