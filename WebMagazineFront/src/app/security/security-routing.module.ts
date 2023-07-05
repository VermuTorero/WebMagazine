import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { PassRecoveryComponent } from './login/pass-recovery/pass-recovery.component';

const routes: Routes = [{
  path: `security`,
  children: [
    {
      path: `usuarios`,
      component: UsersComponent,
    }
  ],
},
{
  path: `security`,
  children: [
    {
      path: `usuario-editar`,
      component: EditUserComponent,
    }
  ],
},
{
  path: `security`,
  children: [
    {
      path: `login/pass-recovery`,
      component: PassRecoveryComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
