import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { IonicStorageModule,Storage } from '@ionic/storage-angular';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,  BrowserModule,
    FormsModule,NgxPaginationModule,
    ReactiveFormsModule,IonicModule.forRoot(), AppRoutingModule, HttpClientModule,IonicStorageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Storage,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
