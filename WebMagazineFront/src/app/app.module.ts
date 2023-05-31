import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { CoreModule } from './core/core.module';
import { fichaInterceptor } from './security/interceptors/ficha.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EcommerceModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    NgxSpinnerModule,
    HttpClientModule,
    QuillModule,
    AngularCropperjsModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [fichaInterceptor],
  bootstrap: [AppComponent]
})
export class AppModule { }
