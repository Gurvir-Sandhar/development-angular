import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { FormsModule, ReactiveFormsModule } from '@angular/forms';import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ApptTablesComponent } from './appt-tables/appt-tables.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "appt-tables" },
  { path: "appt-tables", component: ApptTablesComponent }
]; // sets up routes constant where you define your routes

@NgModule({
  declarations: [
    AppComponent,
    ApptTablesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  exports: [
    RouterModule,
    ApptTablesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
