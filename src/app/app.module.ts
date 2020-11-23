import { BrowserModule } from '@angular/platform-browser';
import { StateFilterComponent } from './state-filter/state-filter.component';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';


import { AppComponent } from './app.component';
import { ApptTablesComponent } from './appt-tables/appt-tables.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { QuickviewComponent } from './quickview/quickview.component';
import { ApptRecordsComponent } from './appt-records/appt-records.component';
import { SearchviewComponent } from './searchview/searchview.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: AppointmentsComponent },
  { path: 'search', component: SearchviewComponent },
  {path: '**', redirectTo: '/home'}
  // { path: "appointment/:id", component: AppointmentComponent}
  // NOTE: Alan's about component showed an under construction page for the About link
  // { path: "about", component: AboutComponent }
];

@NgModule({
  declarations: [
    SearchviewComponent,  
    HeaderBarComponent,
    AppComponent,
    ApptTablesComponent,
    AppointmentsComponent,
    StateFilterComponent,
    QuickviewComponent,
    ApptRecordsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    HeaderBarComponent,
    RouterModule,
    ApptTablesComponent,
    AppointmentsComponent,
    QuickviewComponent,
    ApptRecordsComponent
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap  {

  constructor(private injector: Injector) {

    // List of components converted into web components
    const appts = createCustomElement(AppointmentsComponent, {injector});
    customElements.define('appts-main', appts);
    const apptTables = createCustomElement(ApptTablesComponent, {injector});
    customElements.define('appt-tables', apptTables);
    const quickView = createCustomElement(QuickviewComponent, {injector});
    customElements.define('quick-view', quickView);
    const apptRecords = createCustomElement(ApptRecordsComponent, {injector});
    customElements.define('appt-records', apptRecords);
  }

  ngDoBootstrap() {}

}
/*1*/