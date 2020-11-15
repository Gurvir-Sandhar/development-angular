import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { ApptTablesComponent } from './appt-tables/appt-tables.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { QuickviewComponent } from './quickview/quickview.component';
import { ApptRecordsComponent } from './appt-records/appt-records.component';
import { StudentInteractionComponent } from './student-interaction/student-interaction.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: '**', pathMatch: 'full', component: AppointmentsComponent }
  // { path: "appointment/:id", component: AppointmentComponent}
  // { path: "search", component: SearchComponent }
  // NOTE: Alan's about component showed an under construction page for the About link
  // { path: "about", component: AboutComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ApptTablesComponent,
    AppointmentsComponent,
    QuickviewComponent,
    ApptRecordsComponent,
    StudentInteractionComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTabsModule
  ],
  exports: [
    RouterModule,
    ApptTablesComponent,
    AppointmentsComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap  {

  constructor(private injector: Injector) {
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
