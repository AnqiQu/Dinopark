import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ParkMaintenanceGridComponent } from "./components/park-maintenance-grid/park-maintenance-grid.component"
import { HeaderComponent } from "./components/header/header.component"

@NgModule({
  declarations: [
    AppComponent,
    ParkMaintenanceGridComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
