import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from "./app-routing.module";
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentsComponent,
    AboutComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
