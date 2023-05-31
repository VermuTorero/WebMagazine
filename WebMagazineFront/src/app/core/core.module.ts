import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shell/header/header.component';
import { MainComponent } from './shell/main/main.component';
import { FooterComponent } from './shell/footer/footer.component';
import { ShellComponent } from './shell/shell.component';
import { CoreRoutingModule } from './core-routing.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SecurityModule } from '../security/security.module';




@NgModule({
  declarations: [
    ShellComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    SecurityModule,
    SecurityModule,
    NgbCollapseModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ShellComponent
  ]
})
export class CoreModule { }
