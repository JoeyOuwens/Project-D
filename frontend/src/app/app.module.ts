import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserModalComponent} from './user-modal/user-modal.component';
import {PopoverComponent} from './popover/popover.component';
import {HttpInterceptorService} from './http-interceptor/http-interceptor.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import { DatePipe, CommonModule  } from '@angular/common';


@NgModule({
  declarations: [AppComponent, UserModalComponent, PopoverComponent],
  entryComponents: [UserModalComponent, PopoverComponent],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    ChartsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
