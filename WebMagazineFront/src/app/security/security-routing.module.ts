import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';

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
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
