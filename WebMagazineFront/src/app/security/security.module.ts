import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SecurityRoutingModule } from './security-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { PassRecoveryComponent } from './login/pass-recovery/pass-recovery.component';
import { AngularCropperjsModule } from 'angular-cropperjs';


@NgModule({
  declarations: [
    LoginComponent,
    UsersComponent,
    UserComponent,
    EditUserComponent,
    PassRecoveryComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularCropperjsModule
  ],
  exports: [
    LoginComponent
  ]
})
export class SecurityModule { }
