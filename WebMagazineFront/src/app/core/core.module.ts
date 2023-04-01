import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shell/header/header.component';
import { MainComponent } from './shell/main/main.component';
import { FooterComponent } from './shell/footer/footer.component';




@NgModule({
  declarations: [


    HeaderComponent,
        MainComponent,
        FooterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
